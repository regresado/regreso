import { defaultMaxListeners } from "node:events";

import { and, asc, desc, eq, inArray, or, sql } from "drizzle-orm";
import { z } from "zod";
import {
  destinationSchema,
  destinationSearchSchema,
  updateDestinationSchema,
  type Destination,
} from "~/server/models";

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
        const existingTagRows = await ctx.db.query.tags.findMany({
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
        });
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

        const tagRows = [...newTagRows, ...existingTagRows];
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
    .input(destinationSearchSchema)
    .query(async ({ ctx, input }): Promise<Destination[]> => {
      // get recent destinations
      const tagNames = input.tags ?? [];
      // let tagRows = null;
      // if (tagNames.length > 0) {
      //   tagRows = await ctx.db
      //     .select()
      //     .from(tags)
      //     .where(
      //       or(inArray(tags.name, tagNames), inArray(tags.shortcut, tagNames)),
      //     );
      //   // console.log(tagRows);
      // }
      // const tagNames = ["note to self", "cool notes"];
      console.log("hey");
      const dests2 = await ctx.db
        .select({ destination: destinations })
        .from(destinations)
        .innerJoin(
          destinationTags,
          eq(destinations.id, destinationTags.destinationId),
        )
        .innerJoin(tags, eq(destinationTags.tagId, tags.id))
        .where(tagNames.length > 0 ? inArray(tags.name, tagNames) : undefined) // Filter for specific tags
        .groupBy(destinations.id) // Group by post ID to count matching tags
        .having(
          tagNames.length > 0
            ? sql`COUNT(DISTINCT ${tags.name}) = ${tagNames.length}`
            : undefined,
        );
      console.log(JSON.stringify(dests2));

      // const dests = await ctx.db.query.destinations.findMany({
      //   with: {
      //     destinationTags: {
      //       columns: {
      //         tagId: true,
      //       },
      //       with: {
      //         tag: true,
      //       },
      //     },
      //   },
      //   limit: input.limit,
      //   offset: input.offset,
      //   orderBy:
      //     input.order == "ASC"
      //       ? asc(destinations[input.sortBy ?? "createdAt"])
      //       : desc(destinations[input.sortBy ?? "createdAt"]),
      //   where: and(
      //     input.searchString && input.searchString.length > 0
      //       ? and(
      //           sql`to_tsvector('english', ${destinations.name}) @@ websearch_to_tsquery('english', ${input.searchString})`,
      //           eq(destinations.userId, ctx.user.id),
      //         )
      //       : eq(destinations.userId, ctx.user.id),
      //     input.type ? eq(destinations.type, input.type) : undefined,
      //   ),
      // });
      // console.log(JSON.stringify(dests));
      // const destsMatchingTags = dests.filter((dest) => {
      //   if (!tagRows) {
      //     return true;
      //   }
      //   const destTagIds = dest.destinationTags.map((tag) => tag.tagId);
      //   return tagRows.every((tag) => destTagIds.includes(tag.id));
      // });

      // if (dests2.length === 0) {
      //   return [];
      // }
      // const destsWithTags = await Promise.all(
      //   dests2.map(async (dest) => {
      //     return {
      //       tags: dest.destinationTags.map((tagRow) => {
      //         return {
      //           id: tagRow.tag!.id,
      //           text: tagRow.tag!.name,
      //         };
      //       }),
      //       ...dest,
      //     };
      //   }),
      // );
      console.log("hi");
      // const destsWithTags2 = await ctx.db
      //   .select({
      //     destination: destinations,
      //     tagName: tags.name,
      //   })
      //   .from(destinations)
      //   .innerJoin(
      //     destinationTags,
      //     eq(destinations.id, destinationTags.destinationId),
      //   )
      //   .innerJoin(tags, eq(destinationTags.tagId, tags.id))
      //   .where(
      //     sql`${destinations.id} IN (${dests2.toSQL()})`, // Filter posts using the subquery
      //   );

      const destTags = await ctx.db
        .select()
        .from(destinationTags)
        .innerJoin(tags, eq(destinationTags.tagId, tags.id))
        .where(
          inArray(
            destinationTags.destinationId,
            dests2.map((dest) => dest.destination.id),
          ),
        );

      console.log("hiya", destTags);

      const returnDestinations = dests2.map((dest) => {
        return {
          tags: destTags
            .filter(
              (tag) => tag.destination_tag.destinationId == dest.destination.id,
            )
            .map((tag) => {
              return {
                id: tag.tag.id,
                text: tag.tag.name,
              };
            }),
          ...dest.destination,
        };
      });
      return returnDestinations;
    }),
  update: protectedMutationProcedure
    .input(updateDestinationSchema)
    .mutation(async ({ ctx, input }) => {
      const destinationRows = await ctx.db
        .update(destinations)
        .set({
          name: input.name,
          body: input.body,
          type: input.type,
          location: input.location,
        })
        .where(
          and(
            eq(destinations.id, input.id),
            eq(destinations.userId, ctx.user.id),
          ),
        )
        .returning({
          id: destinations.id,
        });
      if (input.tags.length > 0) {
        const existingTagRows = await ctx.db.query.tags.findMany({
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
        });
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

        const tagRows = [...newTagRows, ...existingTagRows];
        await ctx.db
          .insert(destinationTags)
          .values(
            tagRows.map((tag) => {
              return {
                destinationId: destinationRows[0]!.id,
                tagId: tag.id,
              };
            }),
          )
          .onConflictDoNothing();
      }
      return {
        success: true,
      };
    }),
  delete: protectedMutationProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(destinations)
        .where(
          and(
            eq(destinations.id, input.id),
            eq(destinations.userId, ctx.user.id),
          ),
        );
      return {
        success: true,
      };
    }),

  get: protectedQueryProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      // get by id
      const dest: Destination | undefined =
        await ctx.db.query.destinations.findFirst({
          where: and(
            eq(destinations.id, input.id),
            eq(destinations.userId, ctx.user.id),
          ),
        });

      return {
        ...dest,
        tags: dest
          ? await ctx.db.query.destinationTags
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
              )
          : undefined,
      };
    }),
});
