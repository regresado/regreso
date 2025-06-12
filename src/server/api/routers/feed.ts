import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, inArray, or, sql } from "drizzle-orm";
import { z } from "zod";
import {
  feedFormSchema,
  feedSchema,
  feedSearchSchema,
  updateFeedSchema,
  type Feed,
} from "~/server/models";

import {
  createTRPCRouter,
  protectedMutationProcedure,
  protectedQueryProcedure,
} from "~/server/api/trpc";
import { destinationFeeds, workspaces } from "~/server/db/schema";

export const feedRouter = createTRPCRouter({
  create: protectedMutationProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/v1/feeds",
        protect: true,
      },
    })
    .input(feedFormSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (input.workspaceId && input.workspaceId !== ctx.user.workspaceId) {
        const workspace = await ctx.db.query.workspaces.findFirst({
          where: and(
            eq(workspaces.id, input.workspaceId),
            eq(workspaces.userId, ctx.user.id),
          ),
        });
        if (workspace?.archived) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot add feed to archived workspace",
          });
        }
      }
      await ctx.db
        .insert(destinationFeeds)
        .values({
          workspaceId: input.workspaceId ?? ctx.user.workspaceId ?? 0,
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          jsonQuery: input.query,
          emoji: input.emoji,
          visibility: input.visibility,
        })
        .returning({
          id: destinationFeeds.id,
        });

      return {
        success: true,
      };
    }),
  getMany: protectedQueryProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/v1/feeds",
        protect: true,
      },
    })
    .input(feedSearchSchema)
    .output(
      z.object({
        items: z.array(feedSchema),
        count: z.number(),
      }),
    )
    .query(
      async ({ ctx, input }): Promise<{ items: Feed[]; count: number }> => {
        const fds = await ctx.db
          .select({
            feed: destinationFeeds,
            count: sql<number>`count(*) over()`,
            workspace: workspaces,
          })
          .from(destinationFeeds)
          .where(
            and(
              and(
                input.searchString && input.searchString.length > 0
                  ? sql`(setweight(to_tsvector('english', ${destinationFeeds.name}), 'A') ||
            setweight(to_tsvector('english', ${destinationFeeds.description}), 'B'))
            @@ websearch_to_tsquery  ('english', ${input.searchString})`
                  : undefined,
              ),
              input.archived != undefined
                ? and(
                    eq(destinationFeeds.archived, input.archived),
                    eq(workspaces.archived, input.archived),
                  )
                : undefined,
              eq(destinationFeeds.userId, ctx.user.id),
              input.workspaceId
                ? eq(destinationFeeds.workspaceId, input.workspaceId)
                : undefined,
            ),
          )

          .orderBy(
            (input.order === "ASC" ? asc : desc)(
              destinationFeeds[
                input.sortBy == "complexity" ? "createdAt" : "createdAt"
              ],
            ),
          )
          .limit(input.limit)
          .offset(input.offset);

        const returnfeeds: Feed[] = fds.map((feed) => {
          if (!feed.workspace) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Workspace not found for feed.",
            });
          }
          return {
            ...feed.feed,
            emoji: feed.feed?.emoji
              ? feed.feed?.emoji.match(
                  /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu,
                )
                ? (feed.feed?.emoji.match(
                    /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu,
                  )?.[0] ?? null)
                : null
              : null,
            workspace: feed.workspace,
            query: feed.feed.jsonQuery,
          };
        });
        if (!fds) {
          return {
            items: [],
            count: 0,
          };
        }

        return {
          items: returnfeeds,
          count:
            (typeof fds[0]?.count == "string"
              ? parseInt(fds[0]?.count)
              : fds[0]?.count) ?? 0,
        };
      },
    ),
  update: protectedMutationProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/v1/feed/{id}",
        protect: true,
      },
    })
    .input(updateFeedSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (input.workspaceId && input.workspaceId !== ctx.user.workspaceId) {
        const workspace = await ctx.db.query.workspaces.findFirst({
          where: and(
            eq(workspaces.id, input.workspaceId),
            eq(workspaces.userId, ctx.user.id),
          ),
        });
        if (workspace?.archived) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot add feed to archived workspace",
          });
        }
      }
      let feedRows = null;
      if (
        input.name ||
        input.emoji ||
        input.description ||
        input.workspaceId ||
        input.archived != undefined
      ) {
        feedRows = await ctx.db
          .update(destinationFeeds)
          .set({
            name: input.name,
            description: input.description,
            emoji: input.emoji,
            workspaceId: input.workspaceId ?? undefined,
            archived: input.archived ?? false,
          })
          .where(
            and(
              eq(destinationFeeds.id, input.id),
              eq(destinationFeeds.userId, ctx.user.id),
              input.archived !== false
                ? eq(destinationFeeds.archived, false)
                : undefined,
            ),
          )
          .returning({
            id: destinationFeeds.id,
          });
      } else {
        feedRows = await ctx.db.query.destinationFeeds.findMany({
          columns: { id: true },
          where: and(
            eq(destinationFeeds.id, input.id),
            eq(destinationFeeds.userId, ctx.user.id),
          ),
        });
      }
      return {
        success: true,
      };
    }),
  delete: protectedMutationProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/v1/feed/{id}",
        protect: true,
      },
    })
    .input(z.object({ id: z.number() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(destinationFeeds)
        .where(
          and(
            eq(destinationFeeds.id, input.id),
            eq(destinationFeeds.userId, ctx.user.id),
          ),
        );
      return {
        success: true,
      };
    }),

  get: protectedQueryProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/v1/feed/{id}",
        protect: true,
      },
    })
    .input(z.object({ id: z.number() }))
    .output(feedSchema)
    .query(async ({ ctx, input }) => {
      const fdData = await ctx.db
        .select({
          id: destinationFeeds.id,
          name: destinationFeeds.name,
          description: destinationFeeds.description,
          emoji: destinationFeeds.emoji,
          createdAt: destinationFeeds.createdAt,
          userId: destinationFeeds.userId,
          query: destinationFeeds.jsonQuery,
          archived: destinationFeeds.archived,
          count: sql<number>`count(*) over()`,
          visibility: destinationFeeds.visibility,
          workspace: workspaces,
        })
        .from(destinationFeeds)
        .leftJoin(workspaces, eq(destinationFeeds.workspaceId, workspaces.id))
        .where(
          and(
            eq(destinationFeeds.id, input.id),
            eq(destinationFeeds.userId, ctx.user.id),
          ),
        )
        .groupBy(destinationFeeds.id, workspaces.id)
        .limit(1);

      if (!fdData || fdData.length === 0 || !fdData[0]) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "feed not found or access denied",
        });
      }

      if (!fdData[0].workspace) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Workspace not found for feed",
        });
      }

      const fd: Feed | undefined =
        fdData.length > 0
          ? {
              ...fdData[0],
              workspace: fdData[0].workspace,
            }
          : undefined;

      if (!fd) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "feed not found or access denied",
        });
      }

      return {
        ...fd,
        emoji:
          (fd?.emoji
            ? fd?.emoji.match(
                /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu,
              )
              ? (fd?.emoji.match(
                  /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu,
                )?.[0] ?? null)
              : null
            : null) ?? "❔",
      };
    }),
});
