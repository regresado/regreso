"use server";

import { redirect } from "next/navigation";

import { recoveryCodeBucket, resetUser2FAWithRecoveryCode } from "~/server/2fa";
import { globalPOSTRateLimit } from "~/server/request";
import { getCurrentSession } from "~/server/session";

export async function reset2FAAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
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
  if (!user.emailVerified || !user.registered2FA || session.twoFactorVerified) {
    return {
      message: "Forbidden",
    };
  }
  if (!recoveryCodeBucket.check(user.id, 1)) {
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
  if (!recoveryCodeBucket.consume(user.id, 1)) {
    return {
      message: "Too many requests",
    };
  }
  const valid = await resetUser2FAWithRecoveryCode(user.id, code);
  if (!valid) {
    return {
      message: "Invalid recovery code",
    };
  }
  recoveryCodeBucket.reset(user.id);
  return redirect("/2fa/setup");
}

interface ActionResult {
  message: string;
}
