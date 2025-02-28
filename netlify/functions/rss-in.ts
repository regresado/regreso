import { eq } from "drizzle-orm";
import Parser from "rss-parser";

import { db } from "~/server/db";
import { destinations, feedDestinations, listFeeds } from "~/server/db/schema";

const parser = new Parser();

export default async (req: Request) => {
  const activeFeeds = await db.query.listFeeds.findMany({
    where: eq(listFeeds.active, true),
  });
  for (const row of activeFeeds) {
    try {
      const feed = await parser.parseURL(row.feedUrl);
      let lastFetchedGuid;
      let lastFetchedDestination;
      for (const item of feed.items) {
        if (item.guid == row.lastFetchedGuid) {
          break;
        }
        try {
          const destinationRow = await db
            .insert(destinations)
            .values({
              userId: row.userId,
              name: item.title,
              body: item.description,
              type: "location",
              location: item.link,
            })
            .onConflictDoNothing()
            .returning({
              id: destinations.id,
            });
          if (
            !destinationRow ||
            destinationRow.length == 0 ||
            !destinationRow[0]
          ) {
            continue;
          }
          if (!item.guid) {
            db.insert(feedDestinations)
              .values({
                listFeedId: row.id,
                destinationId: destinationRow[0].id,
                guid: item.guid?.toString() ?? "",
              })
              .onConflictDoNothing()
              .returning({
                id: listFeeds.id,
              });
            lastFetchedGuid = item.guid ?? null;
          }

          lastFetchedDestination = destinationRow[0].id;
        } catch (e) {
          console.error(e);
          continue;
        }
      }
      await db
        .update(listFeeds)
        .set({
          lastFetchedAt: new Date(),
          lastFetchedGuid: lastFetchedGuid ?? undefined,
          lastFetchedDestination: lastFetchedDestination ?? undefined,
          failCount: 0,
        })
        .where(eq(listFeeds.id, row.id));
    } catch (e) {
      if (row.failCount >= 3) {
        await db
          .update(listFeeds)
          .set({
            active: false,
            failCount: 0,
          })
          .where(eq(listFeeds.id, row.id));
        return new Response("Feed is not active anymore");
      }
      await db
        .update(listFeeds)
        .set({
          failCount: row.failCount + 1,
        })
        .where(eq(listFeeds.id, row.id));
      return new Response("Error fetching feed");
    }
  }
};
