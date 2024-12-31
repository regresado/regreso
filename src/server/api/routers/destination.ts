import { eq } from "drizzle-orm";
import { z } from "zod";
import { Destination, destinationSchema } from "~/server/models";

import {
  createTRPCRouter,
  protectedMutationProcedure,
  protectedQueryProcedure,
} from "~/server/api/trpc";
import { destinations, destinationTags, tags } from "~/server/db/schema";

export const destinationRouter = createTRPCRouter({
  create: protectedMutationProcedure
    .input(destinationSchema)
    .mutation(async ({ ctx, input }) => {
      const destinationRows = await ctx.db
        .insert(destinations)
        .values({
          userId: ctx.user.id,
          name: input.name,
          body: input.body,
          type: input.type,
          location: input.location,
        })
        .returning({
          id: destinations.id,
        });
      let tagRows: { id: number }[] = [];
      try {
        tagRows = await ctx.db
          .insert(tags)
          .values(
            input.tags.map((tag) => {
              return {
                userId: ctx.user.id,
                name: tag.text,
                shortcut: tag.text.toLowerCase().replace(/\s/g, "-"),
              };
            }),
          )
          .onConflictDoNothing()
          .returning({
            id: tags.id,
          });
      } catch (e) {
        if (e instanceof Error && (e as any).code === "23505") {
          console.error("duplicate key error");
          // duplicate key error
          // ignore
        }
      }
      await ctx.db.insert(destinationTags).values(
        tagRows.map((tag) => {
          return {
            destinationId: destinationRows[0]!.id,
            tagId: tag.id,
          };
        }),
      );
      // simulate a long running task
      // }
      return {
        success: true,
      };
    }),
  getRecent: protectedQueryProcedure.query(
    async ({ ctx }): Promise<Destination[]> => {
      // get recent destinations
      const dests = await ctx.db.query.destinations.findMany({
        orderBy: (destinations, { desc }) => [desc(destinations.createdAt)],
        where: eq(destinations.userId, ctx.user.id),
        limit: 10,
      });

      if (dests.length === 0) {
        return [];
      }
      const destsWithTags = await Promise.all(
        dests.map(async (dest) => {
          return {
            tags: await ctx.db.query.destinationTags
              .findMany({
                where: eq(destinationTags.destinationId, dest!.id),
                with: {
                  tag: true,
                },
              })
              .then((res) =>
                res.map((tagRow) => {
                  return {
                    id: tagRow.tag!.id,
                    text: tagRow.tag!.name,
                  };
                }),
              ),
            ...dest,
          };
        }),
      );
      return destsWithTags;

      // return (
      //   (await dests.map(async (dest) => {
      //     const tagRows = await ctx.db.query.destinationTags.findMany({
      //       where: eq(destinationTags.destinationId, dest!.id),
      //       with: {
      //         tag: true,
      //       },
      //     });
      //     return {
      //       tags: await tagRows.map((tagRow) => {
      //         return {
      //           id: tagRow.tag!.id,
      //           text: tagRow.tag!.name,
      //         };
      //       }),
      //       ...dest,
      //     };
      //   })) ?? null
      // );
    },
  ),

  get: protectedQueryProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      // get by id
      const dest = await ctx.db.query.destinations.findFirst({
        where: eq(destinations.id, input.id),
      });

      return dest ?? null;
    }),
});
