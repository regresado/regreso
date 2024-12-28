import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { destinations } from "~/server/db/schema";

import { destinationSchema } from "~/server/models";

export const destinationRouter = createTRPCRouter({
  create: publicProcedure
    .input(destinationSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(destinations).values({
        location: input.location,
      });
    }),
  getRecent: publicProcedure.query(async ({ ctx }) => {
    // get recent destinations
    const dests = await ctx.db.query.destinations.findMany({
      orderBy: (destinations, { desc }) => [desc(destinations.createdAt)],
      // where: eq(destinations.userId, ctx.user.id),
      limit: 10,
    });

    return dests ?? null;
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
