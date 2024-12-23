"use server";

import { redirect } from "next/navigation";

import { verifyTOTP } from "@oslojs/otp";

import {
  setPasswordResetSessionAs2FAVerified,
  getCurrentPasswordResetSession,
} from "~/server/password-reset";
import { getUserTOTPKey, totpBucket } from "~/server/totp";

import { globalPOSTRateLimit } from "~/server/request";

export async function verifyPasswordReset2FAWithTOTPAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    };
  }

  const { session, user } = await getCurrentPasswordResetSession();
  if (session === null) {
    return {
      message: "Not authenticated",
    };
  }
  if (
    !session.emailVerified ||
    !user.registeredTOTP ||
    session.twoFactorVerified
  ) {
    return {
      message: "Forbidden",
    };
  }
  if (!totpBucket.check(session.userId, 1)) {
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
  const totpKey = await getUserTOTPKey(session.userId);
  if (totpKey === null) {
    return {
      message: "Forbidden",
    };
  }
  if (!totpBucket.consume(session.userId, 1)) {
    return {
      message: "Too many requests",
    };
  }
  if (!verifyTOTP(totpKey, 30, 6, code)) {
    return {
      message: "Invalid code",
    };
  }
  totpBucket.reset(session.userId);
  await setPasswordResetSessionAs2FAVerified(session.id);
  return redirect("/reset-password");
}

interface ActionResult {
  message: string;
}
