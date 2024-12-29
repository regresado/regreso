import { cookies } from "next/headers";

import { generateState } from "arctic";

import { github } from "~/server/oauth";
import { globalGETRateLimit } from "~/server/request";

export async function GET(): Promise<Response> {
  if (!(await globalGETRateLimit())) {
    return new Response("Too many requests", {
      status: 429,
    });
  }

  const state = generateState();
  const url = github.createAuthorizationURL(state, ["user:email"]);
  const cookieStore = await cookies();

  cookieStore.set("disable2FAReminder", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });

  cookieStore.set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
