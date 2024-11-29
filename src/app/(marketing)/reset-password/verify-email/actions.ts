"use server";

import {
  setPasswordResetSessionAsEmailVerified,
  getCurrentPasswordResetSession,
} from "~/server/password-reset";
import { ExpiringTokenBucket } from "~/server/rate-limit";
import { setUserAsEmailVerifiedIfEmailMatches } from "~/server/user";
import { getCurrentSession } from "~/server/session";
import { redirect } from "next/navigation";
import { globalPOSTRateLimit } from "~/server/request";

const emailVerificationBucket = new ExpiringTokenBucket<number>(5, 60 * 30);

export async function verifyPasswordResetEmailAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    };
  }

  const resetSession = (await getCurrentPasswordResetSession()).session;
  if (resetSession === null) {
    return {
      message: "Not authenticated",
    };
  }
  if (resetSession.emailVerified) {
    return {
      message: "Forbidden",
    };
  }
  if (!emailVerificationBucket.check(resetSession.userId, 1)) {
    return {
      message: "Too many requests",
    };
  }

  const code = formData.get("code");
  if (typeof code !== "string") {
    return {
      message: "Invalid or missing fields",
    };
  }
  if (code === "") {
    return {
      message: "Please enter your code",
    };
  }
  if (!emailVerificationBucket.consume(resetSession.userId, 1)) {
    return { message: "Too many requests" };
  }
  if (code !== resetSession.code) {
    return {
      message: "Incorrect code",
    };
  }
  emailVerificationBucket.reset(resetSession.userId);
  await setPasswordResetSessionAsEmailVerified(resetSession.id);
  const emailMatches = await setUserAsEmailVerifiedIfEmailMatches(
    resetSession.userId,
    resetSession.email,
  );
  if (!emailMatches) {
    return {
      message: "Please restart the process",
    };
  }
  const { session, user } = await getCurrentSession();

  if (user?.registered2FA && !session?.twoFactorVerified) {
    return redirect("/reset-password/2fa");
  }
  return redirect("/reset-password");
}

interface ActionResult {
  message: string;
}
