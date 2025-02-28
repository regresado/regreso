import { NextRequest } from "next/server";

import { api } from "~/trpc/server";
import RSS from "rss";
import { Destination, List } from "~/server/models";

import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { getBaseOrigin } from "~/lib/utils";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ mapId: string }> },
) {
  const { mapId } = await context.params;
  const searchParams = request.nextUrl.searchParams;
  const session =
    searchParams.get("session") ?? request.headers.get("authorization");

  const trpcServerClient = session
    ? appRouter.createCaller(
        await createTRPCContext({
          headers: new Headers(),
          sesh: session,
        }),
      )
    : null;
  try {
    const data: List | undefined = await (trpcServerClient ?? api).list.get({
      id: parseInt(mapId ?? "0", 10),
    });
    if (data === undefined) {
      return new Response("Not found", { status: 404 });
    }

    const searchResults: { count: number; items: Destination[] } = await (
      trpcServerClient ?? api
    ).destination.getMany({
      lists: [parseInt(mapId)],
      offset: 0,
      limit: 6,
    });

    const feed = new RSS({
      title: "Map: " + data?.emoji + " " + data?.name,
      description: data.description ?? undefined,
      site_url: getBaseOrigin(),
      feed_url: `${getBaseOrigin()}/map/${mapId}/feed.xml`,
      copyright: `${new Date().getFullYear()} Regreso`,
      language: "en",
      pubDate: new Date(),
    });

    searchResults.items.map((result: Destination) => {
      feed.item({
        title: result.name ?? "",
        guid: result.id.toString(),
        url: `${getBaseOrigin()}/pin/${result.id}`,
        date: result.createdAt,
        description: result.body ?? "",
        categories: result.tags?.map((tag) => tag.text) || [],
      });
    });

    return new Response(feed.xml({ indent: true }), {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
      },
    });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message == "UNAUTHORIZED") {
        return new Response(e.message, { status: 401 });
      }
      return new Response(e.message, { status: 500 });
    }
    return new Response("An unknown error occurred", { status: 500 });
  }
}
