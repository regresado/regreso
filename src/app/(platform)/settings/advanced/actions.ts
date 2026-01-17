"use server";

import { headers } from "next/headers";

import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { ExpiringTokenBucket, RefillingTokenBucket } from "~/server/rate-limit";
import { globalPOSTRateLimit } from "~/server/request";
import { getCurrentSession } from "~/server/session";

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export async function updateAdvancedAction(
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

    const instance = formData.get("instance");
 
    await db
        .update(users)
        .set({
            aiTaggingInstance: (instance && instance.toString() ) ? instance.toString() : "",
        })
        .where(eq(users.id, user.id));

    return {
        message: "Updated profile settings",
    };
}

interface ActionResult {
    message: string;
}