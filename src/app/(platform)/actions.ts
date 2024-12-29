"use server";

import { redirect } from "next/navigation";

import { globalPOSTRateLimit } from "~/server/request";
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "~/server/session";

export async function logoutAction(): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    };
  }

  const { session } = await getCurrentSession();
  if (session === null) {
    return {
      message: "Not authenticated",
    };
  }

  void invalidateSession(session.id);
  void deleteSessionTokenCookie();
  return redirect("/log-in");
}

interface ActionResult {
  message: string;
}
