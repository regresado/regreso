import { and, asc, desc, eq, inArray, or, sql } from "drizzle-orm";
import { listSchema, listSearchSchema, type List } from "~/server/models";

import {
  createTRPCRouter,
  protectedMutationProcedure,
  protectedQueryProcedure,
} from "~/server/api/trpc";
import { destinationLists, lists, listTags, tags } from "~/server/db/schema";

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
              destinationId: listRows[0]!.id,
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
    .query(async ({ ctx, input }): Promise<List[]> => {
      const tagNames = input.tags ?? [];
      const lsts = await ctx.db
        .select({
          list: lists,
        })
        .from(lists)
        .leftJoin(
          listTags,
          tagNames.length > 0 ? eq(lists.id, listTags.listId) : sql`1 = 0`,
        )
        .leftJoin(
          tags,
          tagNames.length > 0 ? eq(listTags.tagId, tags.id) : sql`1 = 0`,
        )
        .leftJoin(destinationLists, eq(lists.id, destinationLists.listId))
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
        .groupBy(lists.id)
        .having(
          tagNames.length > 0
            ? sql`COUNT(DISTINCT ${tags.name}) = ${tagNames.length}`
            : undefined,
        )
        .orderBy(
          input.order == "ASC"
            ? asc(sql`COUNT(${destinationLists.listId})`)
            : desc(sql`COUNT(${destinationLists.listId})`),
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
          //   size: list.size,
          //   updatedAt: list.list.updatedAt,
          ...list.list,
        };
      });
      return returnLists;
    }),
});
