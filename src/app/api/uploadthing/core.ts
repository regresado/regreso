import { eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { getCurrentSession } from "~/server/session";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  profilePicture: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "1MB",
      minFileCount: 1,
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // get session cookie

      const { session, user } = await getCurrentSession();

      if (!session) throw new UploadThingError("Unauthorized") as Error;

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      // console.log("Upload complete for userId:", metadata.userId);

      // console.log("file url", file.url);
      const { userId } = metadata;
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { avatarUrl: true },
      });
      await db
        .update(users)
        .set({
          avatarUrl: file.url,
        })
        .where(eq(users.id, userId))
        .returning({ avatarUrl: users.avatarUrl });
      if (user?.avatarUrl) {
        const key: string | undefined = user?.avatarUrl?.split("/f/")[1];
        if (key) {
          await new UTApi().deleteFiles(key);
        }
      }

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
