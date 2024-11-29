"use server";

import { verifyEmailInput } from "~/server/email";
import {
  createPasswordResetSession,
  invalidateUserPasswordResetSessions,
  sendPasswordResetEmail,
  setPasswordResetSessionTokenCookie,
} from "~/server/password-reset";
import { RefillingTokenBucket } from "~/server/rate-limit";
import { generateSessionToken } from "~/server/session";
import { getUserFromEmail } from "~/server/user";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { globalPOSTRateLimit } from "~/server/request";

const passwordResetEmailIPBucket = new RefillingTokenBucket<string>(3, 60);
const passwordResetEmailUserBucket = new RefillingTokenBucket<number>(3, 60);

export async function forgotPasswordAction(
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
  if (clientIP !== null && !passwordResetEmailIPBucket.check(clientIP, 1)) {
    return {
      message: "Too many requests",
    };
  }

  const email = formData.get("email");
  if (typeof email !== "string") {
    return {
      message: "Invalid or missing fields",
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
  if (clientIP !== null && !passwordResetEmailIPBucket.consume(clientIP, 1)) {
    return {
      message: "Too many requests",
    };
  }
  if (!passwordResetEmailUserBucket.consume(user.id, 1)) {
    return {
      message: "Too many requests",
    };
  }
  invalidateUserPasswordResetSessions(user.id);
  const sessionToken = generateSessionToken();
  const session = await createPasswordResetSession(
    sessionToken,
    user.id,
    user.email,
  );

  void sendPasswordResetEmail(session.email, session.code);
  void setPasswordResetSessionTokenCookie(sessionToken, session.expiresAt);
  return redirect("/reset-password/verify-email");
}

interface ActionResult {
  message: string;
}
