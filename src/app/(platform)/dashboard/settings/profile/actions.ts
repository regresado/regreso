"use server";

import { headers } from "next/headers";

import { UTApi } from "uploadthing/server";

import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { users } from "~/server/db/schema";

import { getCurrentSession } from "~/server/session";

import { RefillingTokenBucket, ExpiringTokenBucket } from "~/server/rate-limit";
import { globalPOSTRateLimit } from "~/server/request";

const usernameUpdateBucket = new ExpiringTokenBucket<string>(5, 60 * 30);

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export async function updateProfileAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    };
  }
  // FIXME: Assumes X-Forwarded-For is always included.
  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return {
      message: "Too many requests",
    };
  }

  const { session, user } = await getCurrentSession();

  if (session === null) {
    return {
      message: "Not authenticated",
    };
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    return {
      message: "Forbidden",
    };
  }
  if (!usernameUpdateBucket.check(session.id, 1)) {
    return {
      message: "Too many requests",
    };
  }

  const displayName = formData.get("displayName");
  const bio = formData.get("bio");

  if (typeof displayName !== "string" && typeof bio !== "string") {
    return {
      message: "Invalid or missing fields",
    };
  }

  await db
    .update(users)
    .set({
      displayName: typeof displayName === "string" ? displayName : undefined,
      bio: typeof bio === "string" ? bio : undefined,
    })
    .where(eq(users.id, user.id));

  return {
    message: "Updated profile settings",
  };
}

interface ActionResult {
  message: string;
}
export async function clearProfilePictureAction(): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    };
  }

  const { session, user } = await getCurrentSession();

  if (session === null) {
    return {
      message: "Not authenticated",
    };
  }

  if (user.registered2FA && !session.twoFactorVerified) {
    return {
      message: "Forbidden",
    };
  }
  const url = user.avatarUrl;

  if (url === null) {
    return {
      message: "No profile picture to delete",
    };
  }

  const newUrl = url.substring(url.lastIndexOf("/") + 1);
  const utapi = new UTApi();
  await utapi.deleteFiles(newUrl);

  await db
    .update(users)
    .set({
      avatarUrl: null,
    })
    .where(eq(users.id, user.id))
    .returning({ avatarUrl: users.avatarUrl });

  return {
    message: "ok",
  };
}
