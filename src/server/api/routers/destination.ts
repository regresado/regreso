import { eq } from "drizzle-orm";
import { z } from "zod";
import { destinationSchema } from "~/server/models";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { destinations } from "~/server/db/schema";

export const destinationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(destinationSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(destinations).values({
        userId: ctx.user.id,
        name: input.name,
        body: input.body,
        type: input.type,
        location: input.location,
      });
      return {
        success: true,
      };
    }),
  getRecent: protectedProcedure.query(async ({ ctx }) => {
    // get recent destinations
    const dests = await ctx.db.query.destinations.findMany({
      orderBy: (destinations, { desc }) => [desc(destinations.createdAt)],
      where: eq(destinations.userId, ctx.user.id),
      limit: 10,
    });

    return dests ?? null;
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      // get by id
      const dest = await ctx.db.query.destinations.findFirst({
        where: eq(destinations.id, input.id),
      });

      return dest ?? null;
    }),
});
