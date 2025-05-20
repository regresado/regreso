import { headers } from "next/headers";

import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  SessionFlags,
  User,
  userFormSchema,
  userSchema,
} from "~/server/models";

import {
  createTRPCRouter,
  protectedMutationProcedure,
  protectedQueryProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { verifyEmailInput } from "~/server/email";
import { hashPassword, verifyPasswordHash } from "~/server/password";
import { RefillingTokenBucket, Throttler } from "~/server/rate-limit";
import {
  createSession,
  generateSessionToken,
  invalidateSession,
} from "~/server/session";
import {
  createUser,
  getUserFromEmail,
  getUserPasswordHash,
  updateUserPassword,
  verifyDisplayNameInput,
  verifyUsernameInput,
} from "~/server/user";

const throttler = new Throttler<number>([1, 2, 4, 8, 16, 30, 60, 180, 300]);

const ipBucket = new RefillingTokenBucket<string>(20, 1);

export const userRouter = createTRPCRouter({
  get: protectedQueryProcedure
    .meta({
      openapi: { method: "GET", path: "/v1/user", protect: true },
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
      openapi: { method: "POST", path: "/v1/user" },
    })
    .input(userFormSchema)
    .output(userSchema)
    .mutation(async ({ input }) => {
      const clientIP = (await headers()).get("X-Forwarded-For");
      if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });
      }

      return await createUser(
        input.email,
        input.displayName,
        input.username,
        input.password ?? null,
        input.googleId ?? null,
        input.githubId ?? null,
      );
    }),
  updateProfile: protectedMutationProcedure
    .meta({
      openapi: { method: "PATCH", path: "/v1/user", protect: true },
    })
    .input(
      z.object({
        workspaceId: z.number().optional(),
        bio: z.string().optional(),
        displayName: z.string().optional(),
        username: z.string().optional(),
      }),
    )
    .output(z.object({ success: z.boolean() }))

    .mutation(async ({ ctx, input }) => {
      const clientIP = (await headers()).get("X-Forwarded-For");
      if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });
      }

      if (input.username) {
        const valid = verifyUsernameInput(input.username);
        if (!valid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid username",
          });
        }
      }
      if (input.displayName) {
        const valid = verifyDisplayNameInput(input.displayName);
        if (!valid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid username",
          });
        }
      }

      await ctx.db
        .update(users)
        .set({
          bio: input.bio,
          displayName: input.displayName,
          name: input.username,
          workspaceId: input.workspaceId,
        })
        .where(eq(users.id, ctx.user.id));

      return { success: true };
    }),
  updatePassword: protectedMutationProcedure
    .meta({
      openapi: { method: "PATCH", path: "/v1/user/password", protect: true },
    })
    .input(
      z.object({
        password: z.string().min(8),
        newPassword: z.string().min(8),
      }),
    )
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const passwordHash = await getUserPasswordHash(ctx.user.id);
      if (!verifyPasswordHash(input.password, passwordHash)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }
      await updateUserPassword(ctx.user.id, input.newPassword);
      return { success: true };
    }),

  // delete: protectedMutationProcedure
  //   .meta({
  //     openapi: { method: "DELETE", path: "/v1/user", protect: true },
  //   })
  //   .input(z.object({}))
  //   .output(z.object({ success: z.boolean() }))
  //   .mutation(async ({ ctx }) => {
  //     return { success: true };
  //   }),
});
