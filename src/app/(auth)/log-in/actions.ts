"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { api } from "~/trpc/server";

import { get2FARedirect } from "~/server/2fa";
import { globalPOSTRateLimit } from "~/server/request";
import { setSessionTokenCookie } from "~/server/session";

export async function loginAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    };
  }

  const cookieStore = await cookies();

  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") {
    return {
      message: "Invalid or missing fields",
    };
  }
  const response = await api.session.create({
    email,
    password,
  });
  if (!response.success) {
    return {
      message: response.message,
    };
  }

  await setSessionTokenCookie(response.token, response.expiresAt);
  cookieStore.set("disable2FAReminder", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });

  if (!response.user.emailVerified) {
    return redirect("/verify-email");
  }
  if (
    !response.user.registered2FA &&
    cookieStore.get("disable2FAReminder")?.value != "yes"
  ) {
    return redirect("/2fa/setup");
  }
  return redirect(get2FARedirect(response.user));
}

interface ActionResult {
  message: string;
}
