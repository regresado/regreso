import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { destinations } from "~/server/db/schema";

export const destinationRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ location: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(destinations).values({
        location: input.location,
      });
    }),

  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      // get by id
      const dest = await ctx.db.query.destinations.findFirst({
        where: eq(destinations.id, input.id),
      });

      return dest ?? null;
    }),
});
