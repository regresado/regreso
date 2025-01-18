import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  sayHello: publicProcedure
    .meta({
      openapi: { method: "GET", path: "/v1/say-hello", protect: true },
    })
    .input(z.object({ name: z.string() }))
    .output(z.object({ greeting: z.string() }))
    .query(({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          message: "User not found",
          code: "UNAUTHORIZED",
        });
      }
      return { greeting: `Hello ${input.name}!` };
    }),
});
