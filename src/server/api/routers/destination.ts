import { eq, inArray, or } from "drizzle-orm";
import { z } from "zod";
import { destinationSchema, type Destination } from "~/server/models";

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
      if (input.tags.length > 0) {
        const newTagRows = await ctx.db
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

        const tagRows = [
          ...newTagRows,
          ...(await ctx.db.query.tags.findMany({
            where: or(
              inArray(
                tags.name,
                input.tags.map((tag) => tag.text),
              ),
              inArray(
                tags.shortcut,
                input.tags.map((tag) => tag.text),
              ),
            ),
            with: {
              destinationTags: true,
            },
          })),
        ];
        await ctx.db.insert(destinationTags).values(
          tagRows.map((tag) => {
            return {
              destinationId: destinationRows[0]!.id,
              tagId: tag.id,
            };
          }),
        );
      }
      return {
        success: true,
      };
    }),
  getMany: protectedQueryProcedure
    .input(
      z.object({
        sortBy: z.enum(["createdAt", "updatedAt"]).default("createdAt"),
        order: z.enum(["asc", "desc"]).default("desc"),
        limit: z.number().max(10).default(5),
        offset: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }): Promise<Destination[]> => {
      // get recent destinations
      const dests = await ctx.db.query.destinations.findMany({
        orderBy: (destinations, { desc, asc }) => [
          input.order == "asc"
            ? asc(destinations[input.sortBy])
            : desc(destinations[input.sortBy]),
        ],
        where: eq(destinations.userId, ctx.user.id),
        limit: input.limit,
      });

      if (dests.length === 0) {
        return [];
      }
      const destsWithTags = await Promise.all(
        dests.map(async (dest) => {
          return {
            tags: await ctx.db.query.destinationTags
              .findMany({
                where: eq(destinationTags.destinationId, dest.id),
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
    }),

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
