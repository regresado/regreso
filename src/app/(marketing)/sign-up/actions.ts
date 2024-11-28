"use server";

import { checkEmailAvailability, verifyEmailInput } from "~/server/email";
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from "~/server/email-verification";
import { verifyPasswordStrength } from "~/server/password";
import { RefillingTokenBucket } from "~/server/rate-limit";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "~/server/session";
import { createUser, verifyUsernameInput } from "~/server/user";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { globalPOSTRateLimit } from "~/server/request";

import type { SessionFlags } from "~/server/models";

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export async function signupAction(
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

  const email = formData.get("email");
  const username = formData.get("username");
  const displayName = formData.get("displayName");
  const password = formData.get("password");
  if (
    typeof email !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof displayName !== "string"
  ) {
    return {
      message: "Invalid or missing fields",
    };
  }
  if (
    email === "" ||
    password === "" ||
    username === "" ||
    displayName === ""
  ) {
    return {
      message: "Please enter your username, email, and password",
    };
  }
  if (!verifyEmailInput(email)) {
    return {
      message: "Invalid email",
    };
  }
  const emailAvailable = await checkEmailAvailability(email);
  console.log(emailAvailable);
  if (!emailAvailable) {
    return {
      message: "Email is already used",
    };
  }
  if (!verifyUsernameInput(username)) {
    return {
      message: "Invalid username",
    };
  }
  const strongPassword = await verifyPasswordStrength(password);
  if (!strongPassword) {
    return {
      message: "Weak password",
    };
  }
  if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
    return {
      message: "Too many requests",
    };
  }
  const user = await createUser(
    email,
    displayName,
    username,
    password,
    null,
    null,
  );
  const emailVerificationRequest = await createEmailVerificationRequest(
    user.id,
    user.email,
  );
  sendVerificationEmail(
    emailVerificationRequest.email,
    emailVerificationRequest.code,
  );
  void setEmailVerificationRequestCookie(emailVerificationRequest);

  const sessionFlags: SessionFlags = {
    twoFactorVerified: false,
  };
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id, sessionFlags);
  void setSessionTokenCookie(sessionToken, session.expiresAt);
  return redirect("/dashboard");
}

interface ActionResult {
  message: string;
}
