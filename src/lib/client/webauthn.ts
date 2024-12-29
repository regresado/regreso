import { decodeBase64 } from "@oslojs/encoding";
import { createWebAuthnChallengeAction } from "~/lib/actions/webauthn";

export async function createChallenge(): Promise<Uint8Array> {
  const encoded = await createWebAuthnChallengeAction();
  return decodeBase64(encoded);
}
