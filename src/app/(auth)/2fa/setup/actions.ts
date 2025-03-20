"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { globalPOSTRateLimit } from "~/server/request";

export async function skip2FASetupAction(
  _data: unknown,
): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      error: "Too many requests",
    };
  }
  const cookieStore = await cookies();

  cookieStore.set("disable2FAReminder", "yes", {
    httpOnly: true,
  });
  return redirect("/dashboard?loginState=signedIn");
}

interface ActionResult {
  error: string | null;
}
