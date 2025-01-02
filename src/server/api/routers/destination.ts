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
      const tagNames = input.tags ?? [];
      const dests = await ctx.db
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
        )
        .orderBy(
          input.order == "ASC"
            ? asc(destinations[input.sortBy ?? "createdAt"])
            : desc(destinations[input.sortBy ?? "createdAt"]),
        )
        .limit(input.limit)
        .offset(input.offset);

      const destTags = await ctx.db
        .select()
        .from(destinationTags)
        .innerJoin(tags, eq(destinationTags.tagId, tags.id))
        .where(
          inArray(
            destinationTags.destinationId,
            dests.map((dest) => dest.destination.id),
          ),
        );

      const returnDestinations = dests.map((dest) => {
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
