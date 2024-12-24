"use server";

import { ObjectParser } from "@pilcrowjs/object-parser";
import { decodeBase64 } from "@oslojs/encoding";
import {
  ClientDataType,
  coseAlgorithmES256,
  coseAlgorithmRS256,
  createAssertionSignatureMessage,
  parseAuthenticatorData,
  parseClientDataJSON,
} from "@oslojs/webauthn";
import type { AuthenticatorData, ClientData } from "@oslojs/webauthn";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  decodePKIXECDSASignature,
  decodeSEC1PublicKey,
  p256,
  verifyECDSASignature,
} from "@oslojs/crypto/ecdsa";
import {
  decodePKCS1RSAPublicKey,
  sha256ObjectIdentifier,
  verifyRSASSAPKCS1v15Signature,
} from "@oslojs/crypto/rsa";

import { getBaseOrigin, getBaseHost } from "~/lib/utils";

import { getCurrentSession, setSessionAs2FAVerified } from "~/server/session";

import {
  getUserPasskeyCredential,
  verifyWebAuthnChallenge,
} from "~/server/webauthn";

import { globalPOSTRateLimit } from "~/server/request";

export async function verify2FAWithPasskeyAction(
  data: unknown,
): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      error: "Too many requests",
    };
  }

  const { session, user } = await getCurrentSession();
  if (session === null || user === null) {
    return {
      error: "Not authenticated",
    };
  }
  if (
    !user.emailVerified ||
    !user.registeredPasskey ||
    session.twoFactorVerified
  ) {
    return {
      error: "Forbidden",
    };
  }

  const parser = new ObjectParser(data);
  let encodedAuthenticatorData: string;
  let encodedClientDataJSON: string;
  let encodedCredentialId: string;
  let encodedSignature: string;
  try {
    encodedAuthenticatorData = parser.getString("authenticator_data");
    encodedClientDataJSON = parser.getString("client_data_json");
    encodedCredentialId = parser.getString("credential_id");
    encodedSignature = parser.getString("signature");
  } catch {
    return {
      error: "Invalid or missing fields",
    };
  }
  let authenticatorDataBytes: Uint8Array;
  let clientDataJSON: Uint8Array;
  let credentialId: Uint8Array;
  let signatureBytes: Uint8Array;
  try {
    authenticatorDataBytes = decodeBase64(encodedAuthenticatorData);
    clientDataJSON = decodeBase64(encodedClientDataJSON);
    credentialId = decodeBase64(encodedCredentialId);
    signatureBytes = decodeBase64(encodedSignature);
  } catch {
    return {
      error: "Invalid or missing fields",
    };
  }

  let authenticatorData: AuthenticatorData;
  try {
    const result = parseAuthenticatorData(authenticatorDataBytes);
    if (result instanceof Error) {
      throw result;
    }
    authenticatorData = result;
  } catch {
    return {
      error: "Invalid data",
    };
  }
  if (!authenticatorData.verifyRelyingPartyIdHash(getBaseHost())) {
    return {
      error: "Invalid data",
    };
  }
  if (!authenticatorData.userPresent) {
    return {
      error: "Invalid data",
    };
  }

  let clientData: ClientData;
  try {
    clientData = parseClientDataJSON(clientDataJSON);
  } catch {
    return {
      error: "Invalid data",
    };
  }
  if (clientData.type !== ClientDataType.Get) {
    return {
      error: "Invalid data",
    };
  }

  if (!verifyWebAuthnChallenge(clientData.challenge)) {
    return {
      error: "Invalid data",
    };
  }
  if (clientData.origin !== getBaseOrigin()) {
    return {
      error: "Invalid data",
    };
  }
  if (clientData.crossOrigin !== null && clientData.crossOrigin) {
    return {
      error: "Invalid data",
    };
  }

  const credential = await getUserPasskeyCredential(user.id, credentialId);
  if (credential === null) {
    return {
      error: "Invalid credential",
    };
  }

  let validSignature: boolean;
  if (credential.algorithmId === coseAlgorithmES256) {
    const ecdsaSignature = decodePKIXECDSASignature(signatureBytes);
    const ecdsaPublicKey = decodeSEC1PublicKey(p256, credential.publicKey);
    const hash = sha256(
      createAssertionSignatureMessage(authenticatorDataBytes, clientDataJSON),
    );
    validSignature = verifyECDSASignature(ecdsaPublicKey, hash, ecdsaSignature);
  } else if (credential.algorithmId === coseAlgorithmRS256) {
    const rsaPublicKey = decodePKCS1RSAPublicKey(credential.publicKey);
    const hash = sha256(
      createAssertionSignatureMessage(authenticatorDataBytes, clientDataJSON),
    );
    validSignature = verifyRSASSAPKCS1v15Signature(
      rsaPublicKey,
      sha256ObjectIdentifier,
      hash,
      signatureBytes,
    );
  } else {
    return {
      error: "Internal error",
    };
  }

  if (!validSignature) {
    return {
      error: "Invalid data",
    };
  }

  void setSessionAs2FAVerified(session.id);
  return {
    error: null,
  };
}

interface ActionResult {
  error: string | null;
}
