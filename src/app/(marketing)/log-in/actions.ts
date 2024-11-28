"use server";

import { verifyEmailInput } from "~/server/email";
import { verifyPasswordHash } from "~/server/password";
import { RefillingTokenBucket, Throttler } from "~/server/rate-limit";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "~/server/session";
import { getUserFromEmail, getUserPasswordHash } from "~/server/user";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { globalPOSTRateLimit } from "~/server/request";

import type { SessionFlags } from "~/server/db/schema";

const throttler = new Throttler<number>([1, 2, 4, 8, 16, 30, 60, 180, 300]);
const ipBucket = new RefillingTokenBucket<string>(20, 1);

export async function loginAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    };
  }
  // TODO: Assumes X-Forwarded-For is always included.
  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return {
      message: "Too many requests",
    };
  }

  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") {
    return {
      message: "Invalid or missing fields",
    };
  }
  if (email === "" || password === "") {
    return {
      message: "Please enter your email and password.",
    };
  }
  if (!verifyEmailInput(email)) {
    return {
      message: "Invalid email",
    };
  }
  const user = await getUserFromEmail(email);
  if (user === null) {
    return {
      message: "Account does not exist",
    };
  }
  if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
    return {
      message: "Too many requests",
    };
  }
  if (user === null || !throttler.consume(user.id)) {
    return {
      message: "Too many requests",
    };
  }
  const passwordHash = await getUserPasswordHash(user.id);
  const validPassword = await verifyPasswordHash(passwordHash, password);
  if (!validPassword) {
    return {
      message: "Invalid password",
    };
  }
  throttler.reset(user.id);
  const sessionFlags: SessionFlags = {
    twoFactorVerified: false,
  };
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id, sessionFlags);
  await setSessionTokenCookie(sessionToken, session.expiresAt);

  if (!user.emailVerified) {
    return redirect("/verify-email");
  }
  if (!user.registered2FA) {
    return redirect("/2fa/setup");
  }
  return redirect("/2fa");
}

interface ActionResult {
  message: string;
}
