import { cookies, headers } from "next/headers";

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Session, SessionFlags, User } from "~/server/models";

import {
  createTRPCRouter,
  protectedMutationProcedure,
  protectedQueryProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { verifyEmailInput } from "~/server/email";
import { verifyPasswordHash } from "~/server/password";
import { RefillingTokenBucket, Throttler } from "~/server/rate-limit";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  invalidateSession,
} from "~/server/session";
import { getUserFromEmail, getUserPasswordHash } from "~/server/user";

import { loginAction } from "~/app/(auth)/log-in/actions";
import { logoutAction } from "~/app/(platform)/actions";

const throttler = new Throttler<number>([1, 2, 4, 8, 16, 30, 60, 180, 300]);

const ipBucket = new RefillingTokenBucket<string>(20, 1);

export const sessionRouter = createTRPCRouter({
  hello: protectedQueryProcedure
    .meta({
      openapi: { method: "GET", path: "/v1/say-hello", protect: true },
    })
    .input(z.object({}))
    .output(z.object({ greeting: z.string() }))
    .query(({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          message: "User not found",
          code: "UNAUTHORIZED",
        });
      }
      return { greeting: `Hello ${ctx.user.displayName}!` };
    }),
  get: protectedQueryProcedure
    .meta({
      openapi: { method: "GET", path: "/v1/session", protect: true },
    })
    .input(z.object({}))
    .output(
      z.object({
        id: z.string(),
        expiresAt: z.date(),
        user: z.custom<User>(),
      }),
    )
    .query(({ ctx }) => {
      return {
        ...{ id: ctx.session.id, expiresAt: ctx.session.expiresAt },
        user: ctx.user,
      };
    }),
  create: publicProcedure
    .meta({
      openapi: { method: "POST", path: "/v1/session" },
    })
    .input(z.object({ email: z.string(), password: z.string() }))
    .output(
      z.discriminatedUnion("success", [
        z.object({ success: z.literal(false), message: z.string() }),
        z.object({
          success: z.literal(true),
          token: z.string(),
          expiresAt: z.date(),
          user: z.custom<User>(),
        }),
      ]),
    )
    .mutation(async ({ ctx, input }) => {
      // FIXME: Assumes X-Forwarded-For is always included.
      const clientIP = (await headers()).get("X-Forwarded-For");
      if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
        return {
          success: false,
          message: "Too many requests",
        };
      }

      if (input.email === "" || input.password === "") {
        return {
          success: false,
          message: "Please enter your email and password.",
        };
      }
      if (!verifyEmailInput(input.email)) {
        return {
          success: false,
          message: "Invalid email",
        };
      }
      const user = await getUserFromEmail(input.email);
      if (user === null) {
        return {
          success: false,
          message: "Account does not exist or password is incorrect",
        };
      }
      if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
        return {
          success: false,
          message: "Too many requests",
        };
      }
      if (user === null || !throttler.consume(user.id)) {
        return {
          success: false,
          message: "Too many requests",
        };
      }
      const passwordHash = await getUserPasswordHash(user.id);
      const validPassword = await verifyPasswordHash(
        passwordHash,
        input.password,
      );
      if (!validPassword) {
        return {
          success: false,
          message: "Account does not exist or password is incorrect",
        };
      }
      throttler.reset(user.id);

      const sessionFlags: SessionFlags = {
        twoFactorVerified: false,
      };
      const sessionToken = generateSessionToken();
      const session = await createSession(sessionToken, user.id, sessionFlags);

      return {
        success: true,
        token: sessionToken,
        expiresAt: session.expiresAt,
        user,
      };
    }),
  delete: protectedMutationProcedure
    .meta({
      openapi: { method: "DELETE", path: "/v1/session", protect: true },
    })
    .input(z.object({}))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx }) => {
      invalidateSession(ctx.session.id);
      return { success: true };
    }),
});
