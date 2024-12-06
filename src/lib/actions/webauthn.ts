"use server";

import { headers } from "next/headers";

import { encodeBase64 } from "@oslojs/encoding";

import { RefillingTokenBucket } from "~/server/rate-limit";
import { createWebAuthnChallenge } from "~/server/webauthn";

const webauthnChallengeRateLimitBucket = new RefillingTokenBucket<string>(
  30,
  10,
);

export async function createWebAuthnChallengeAction(): Promise<string> {
  const clientIP = (await headers()).get("X-Forwarded-For");
  if (
    clientIP !== null &&
    !webauthnChallengeRateLimitBucket.consume(clientIP, 1)
  ) {
    throw new Error("Too many requests");
  }
  const challenge = createWebAuthnChallenge();
  return encodeBase64(challenge);
}
