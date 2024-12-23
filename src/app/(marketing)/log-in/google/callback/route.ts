import crypto from "node:crypto";
import { cookies } from "next/headers";

import { decodeIdToken, type OAuth2Tokens } from "arctic";

import { ObjectParser } from "@pilcrowjs/object-parser";

import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "~/server/session";
import { createUser, getUserFromGoogleId } from "~/server/user";
import { google } from "~/server/oauth";

import { globalGETRateLimit } from "~/server/request";

export async function GET(request: Request): Promise<Response> {
  if (!(await globalGETRateLimit())) {
    return new Response("Too many requests", {
      status: 429,
    });
  }
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState =
    (await cookies()).get("google_oauth_state")?.value ?? null;
  const codeVerifier =
    (await cookies()).get("google_code_verifier")?.value ?? null;
  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  const claims = decodeIdToken(tokens.idToken());

  if (!claims || typeof claims !== "object") {
    return new Response("Invalid ID token claims.", {
      status: 400,
    });
  }
  const claimsParser = new ObjectParser(claims);

  const googleId = claimsParser.getString("sub");
  if (typeof googleId !== "string") {
    return new Response("Invalid Google ID.", {
      status: 400,
    });
  }
  const name = claimsParser.getString("name");
  if (typeof name !== "string") {
    return new Response("Invalid name.", {
      status: 400,
    });
  }
  // const picture = claimsParser.getString("picture");
  const email = claimsParser.getString("email");
  if (typeof email !== "string") {
    return new Response("Invalid name.", {
      status: 400,
    });
  }
  const existingUser = await getUserFromGoogleId(googleId);
  if (existingUser !== null) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id, {
      twoFactorVerified: false,
    });
    void setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard",
      },
    });
  }

  const user = await createUser(
    email,
    name,
    crypto.randomBytes(8).toString("hex"),
    null,
    googleId,
    null,
  );
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id, {
    twoFactorVerified: false,
  });
  void setSessionTokenCookie(sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/dashboard",
    },
  });
}
