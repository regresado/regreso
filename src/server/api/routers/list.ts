import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, exists, inArray, or, sql } from "drizzle-orm";
import { z } from "zod";
import {
  listSchema,
  listSearchSchema,
  updateListSchema,
  type List,
} from "~/server/models";

import {
  createTRPCRouter,
  protectedMutationProcedure,
  protectedQueryProcedure,
} from "~/server/api/trpc";
import {
  destinationLists,
  destinations,
  lists,
  listTags,
  tags,
} from "~/server/db/schema";

export const listRouter = createTRPCRouter({
  create: protectedMutationProcedure
    .input(listSchema)
    .mutation(async ({ ctx, input }) => {
      const listRows = await ctx.db
        .insert(lists)
        .values({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
        })
        .returning({
          id: lists.id,
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
            listTags: true,
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
        await ctx.db.insert(listTags).values(
          tagRows.map((tag) => {
            return {
              listId: listRows[0]!.id,
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
    .input(listSearchSchema)
    .query(
      async ({ ctx, input }): Promise<{ items: List[]; count: number }> => {
        const tagNames = input.tags ?? [];

        const stats = ctx.db.$with("list_stats").as(
          ctx.db
            .select({
              listId: lists.id,
              size: sql<number>`COUNT(${destinationLists}.id)`.as("list_size"),
              latestCreatedAt:
                sql<Date | null>`MAX(${destinations.createdAt})`.as(
                  "latest_created",
                ),
            })
            .from(lists)
            .leftJoin(destinationLists, eq(lists.id, destinationLists.listId))
            .leftJoin(
              destinations,
              eq(destinationLists.destinationId, destinations.id),
            )
            .groupBy(lists.id),
        );

        const lsts = await ctx.db
          .with(stats)
          .select({
            list: lists,
            count: sql<number>`count(*) over()`,
            size: sql<number>`${stats.size}`.as("size"),
            latestCreatedAt: sql<Date | null>`${stats.latestCreatedAt}`.as(
              "updated_at",
            ),
          })
          .from(lists)
          .leftJoin(stats, eq(lists.id, stats.listId))
          .leftJoin(
            listTags,
            tagNames.length > 0 ? eq(lists.id, listTags.listId) : sql`1 = 0`,
          )
          .leftJoin(
            tags,
            tagNames.length > 0 ? eq(listTags.tagId, tags.id) : sql`1 = 0`,
          )
          .where(
            and(
              and(
                input.searchString && input.searchString.length > 0
                  ? sql`(setweight(to_tsvector('english', ${lists.name}), 'A') ||
            setweight(to_tsvector('english', ${lists.description}), 'B'))
            @@ websearch_to_tsquery  ('english', ${input.searchString})`
                  : undefined,
              ),
              tagNames.length > 0
                ? or(
                    inArray(tags.name, tagNames),
                    inArray(tags.shortcut, tagNames),
                  )
                : undefined,
              eq(lists.userId, ctx.user.id),
            ),
          )
          .groupBy(
            lists.id,
            lists.name,
            lists.description,
            lists.userId,
            lists.createdAt,
            stats.size,
            stats.latestCreatedAt,
          )
          .orderBy(
            input.order === "ASC"
              ? asc(
                  input.sortBy === "size"
                    ? stats.size
                    : input.sortBy === "updatedAt"
                      ? stats.latestCreatedAt
                      : lists.createdAt,
                )
              : desc(
                  input.sortBy === "size"
                    ? stats.size
                    : input.sortBy === "updatedAt"
                      ? stats.latestCreatedAt
                      : lists.createdAt,
                ),
          )
          .limit(input.limit)
          .offset(input.offset);

        const lstTags = await ctx.db
          .select()
          .from(listTags)
          .innerJoin(tags, eq(listTags.tagId, tags.id))
          .where(
            inArray(
              listTags.listId,
              lsts.map((list) => list.list.id),
            ),
          );

        const returnLists = lsts.map((list) => {
          return {
            tags: lstTags
              .filter((tag) => tag.list_tag.listId == list.list.id)
              .map((tag) => {
                return {
                  id: tag.tag.id,
                  text: tag.tag.name,
                };
              }),
            size: list.size,
            updatedAt: list.latestCreatedAt,
            ...list.list,
            emoji: list.list?.emoji
              ? list.list?.emoji.match(
                  /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu,
                )
                ? (list.list?.emoji.match(
                    /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu,
                  )?.[0] ?? null)
                : null
              : null,
          };
        });
        return { items: returnLists, count: lsts[0]?.count ?? 0 };
      },
    ),
  update: protectedMutationProcedure
    .input(updateListSchema)
    .mutation(async ({ ctx, input }) => {
      let listRows = null;
      if (input.name || input.emoji || input.description) {
        listRows = await ctx.db
          .update(lists)
          .set({
            name: input.name,
            description: input.description,
            emoji: input.emoji,
          })
          .where(and(eq(lists.id, input.id), eq(lists.userId, ctx.user.id)))
          .returning({
            id: lists.id,
          });
      } else {
        listRows = await ctx.db.query.lists.findMany({
          columns: { id: true },
          where: and(eq(lists.id, input.id), eq(lists.userId, ctx.user.id)),
        });
      }
      if (
        (input.tags && input.tags.length > 0) ||
        (input.newTags && input.newTags?.length > 0) ||
        (input.removedTags && input.removedTags.length > 0)
      ) {
        const existingTagRows =
          input.tags || input.newTags
            ? await ctx.db.query.tags.findMany({
                where: or(
                  inArray(
                    tags.name,
                    input.tags
                      ? input.tags.map((tag) => tag.text)
                      : input.newTags
                        ? input.newTags?.map((tag) => tag)
                        : [],
                  ),
                  inArray(
                    tags.shortcut,
                    input.tags
                      ? input.tags.map((tag) => tag.text)
                      : input.newTags
                        ? input.newTags?.map((tag) => tag)
                        : [],
                  ),
                ),
                with: {
                  destinationTags: true,
                },
              })
            : [];
        const newTagValues = [
          ...(input.tags
            ? input.tags.map((tag) => {
                return {
                  userId: ctx.user.id,
                  name: tag.text,
                  shortcut: tag.text.toLowerCase().replace(/\s/g, "-"),
                };
              })
            : []),
          ...(input.newTags
            ? input.newTags.map((tag) => {
                return {
                  userId: ctx.user.id,
                  name: tag,
                  shortcut: tag.toLowerCase().replace(/\s/g, "-"),
                };
              })
            : []),
        ];
        let newTagRows: { id: number }[] = [];
        if (newTagValues.length > 0) {
          newTagRows = await ctx.db
            .insert(tags)
            .values(newTagValues)
            .onConflictDoNothing()
            .returning({
              id: tags.id,
            });
        }

        if (input.removedTags && input.removedTags.length > 0) {
          await ctx.db.delete(listTags).where(
            and(
              eq(listTags.listId, input.id),
              exists(
                ctx.db
                  .select()
                  .from(lists)
                  .where(
                    and(
                      eq(lists.id, listTags.listId),
                      eq(lists.userId, ctx.user.id),
                    ),
                  ),
              ),
              exists(
                ctx.db
                  .select()
                  .from(tags)
                  .where(
                    and(
                      eq(tags.id, listTags.tagId),
                      inArray(tags.name, input.removedTags),
                    ),
                  ),
              ),
            ),
          );
        }

        const tagRows = [...newTagRows, ...existingTagRows];
        if (tagRows.length > 0) {
          await ctx.db
            .insert(listTags)
            .values(
              tagRows.map((tag) => {
                return {
                  listId: listRows[0]!.id,
                  tagId: tag.id,
                };
              }),
            )
            .onConflictDoNothing();
        }
      }
      return {
        success: true,
      };
    }),
  delete: protectedMutationProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(lists)
        .where(and(eq(lists.id, input.id), eq(lists.userId, ctx.user.id)));
      return {
        success: true,
      };
    }),

  get: protectedQueryProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const lstData = await ctx.db
        .select({
          id: lists.id,
          name: lists.name,
          description: lists.description,
          emoji: lists.emoji,
          createdAt: lists.createdAt,
          userId: lists.userId,
          count: sql<number>`count(*) over()`,
          size: sql<number>`COUNT(${destinationLists}.id)`,
          updatedAt: sql<Date | null>`(
                SELECT MAX(${destinations.createdAt})
                FROM ${destinations}
                JOIN ${destinationLists} ON ${destinations.id} = ${destinationLists.destinationId}
                WHERE ${destinationLists.listId} = ${lists.id}
              )`,
        })
        .from(lists)
        .leftJoin(destinationLists, eq(lists.id, destinationLists.listId))
        .where(and(eq(lists.id, input.id), eq(lists.userId, ctx.user.id)))
        .groupBy(lists.id)
        .limit(1);

      if (!lstData || lstData.length === 0 || !lstData[0]) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "List not found or access denied",
        });
      }

      const lst: List | undefined =
        lstData.length > 0
          ? {
              ...lstData[0],
              size: lstData[0]?.size ?? 0,
              updatedAt: lstData[0].updatedAt ?? null,
            }
          : undefined;

      return {
        ...lst,
        emoji: lst?.emoji
          ? lst?.emoji.match(
              /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu,
            )
            ? (lst?.emoji.match(
                /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu,
              )?.[0] ?? null)
            : null
          : null,
        tags: lst
          ? await ctx.db.query.listTags
              .findMany({
                where: eq(listTags.listId, lst.id),
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

  addDestinations: protectedMutationProcedure
    .input(z.object({ destinations: z.array(z.number()), listId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Verify list ownership
      const list = await ctx.db.query.lists.findFirst({
        where: and(eq(lists.id, input.listId), eq(lists.userId, ctx.user.id)),
      });

      if (!list) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "List not found or access denied",
        });
      }

      // Verify all destinations belong to user
      const destinationCount = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(destinations)
        .where(
          and(
            inArray(destinations.id, input.destinations),
            eq(destinations.userId, ctx.user.id),
          ),
        );

      if (destinationCount[0]?.count !== input.destinations.length) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "One or more destinations not found or access denied",
        });
      }

      // Insert if all checks pass
      await ctx.db.insert(destinationLists).values(
        input.destinations.map((id) => ({
          destinationId: id,
          listId: input.listId,
        })),
      );

      return { success: true };
    }),

  removeDestinations: protectedMutationProcedure
    .input(z.object({ destinations: z.array(z.number()), listId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Verify list ownership and destination ownership in one query
      await ctx.db.delete(destinationLists).where(
        and(
          eq(destinationLists.listId, input.listId),
          inArray(destinationLists.destinationId, input.destinations),
          exists(
            ctx.db
              .select()
              .from(lists)
              .where(
                and(eq(lists.id, input.listId), eq(lists.userId, ctx.user.id)),
              ),
          ),
          exists(
            ctx.db
              .select()
              .from(destinations)
              .where(
                and(
                  inArray(destinations.id, input.destinations),
                  eq(destinations.userId, ctx.user.id),
                ),
              ),
          ),
        ),
      );

      return { success: true };
    }),
});
