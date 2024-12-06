import { encodeHexLowerCase } from "@oslojs/encoding";
import { eq, and } from "drizzle-orm";

import { db } from "~/server/db";
import { passkeyCredentials, securityKeyCredentials } from "~/server/db/schema";

const challengeBucket = new Set<string>();

export function createWebAuthnChallenge(): Uint8Array {
  const challenge = new Uint8Array(20);
  crypto.getRandomValues(challenge);
  const encoded = encodeHexLowerCase(challenge);
  challengeBucket.add(encoded);
  return challenge;
}

export function verifyWebAuthnChallenge(challenge: Uint8Array): boolean {
  const encoded = encodeHexLowerCase(challenge);
  return challengeBucket.delete(encoded);
}

export async function getUserPasskeyCredentials(
  userId: number,
): Promise<WebAuthnUserCredential[]> {
  const result = await db.query.passkeyCredentials.findMany({
    columns: {
      id: true,
      userId: true,
      name: true,
      algorithm: true,
      publicKey: true,
    },
    where: eq(passkeyCredentials.userId, userId),
  });

  const credentials: WebAuthnUserCredential[] = [];
  for (const row of result) {
    const credential: WebAuthnUserCredential = {
      id: Uint8Array.from(
        atob(row.id)
          .split("")
          .map((char) => char.charCodeAt(0)),
      ),
      userId: row.userId,
      name: row.name,
      algorithmId: row.algorithm,
      publicKey: Uint8Array.from(
        atob(row.publicKey)
          .split("")
          .map((char) => char.charCodeAt(0)),
      ),
    };
    credentials.push(credential);
  }
  return credentials;
}

export async function getPasskeyCredential(
  credentialId: Uint8Array,
): Promise<WebAuthnUserCredential | null> {
  const row = await db.query.passkeyCredentials.findFirst({
    columns: {
      id: true,
      userId: true,
      name: true,
      algorithm: true,
      publicKey: true,
    },
    where: eq(
      passkeyCredentials.id,
      Buffer.from(credentialId).toString("base64"),
    ),
  });

  if (!row) {
    return null;
  }
  const credential: WebAuthnUserCredential = {
    id: Uint8Array.from(
      atob(row.id)
        .split("")
        .map((char) => char.charCodeAt(0)),
    ),
    userId: row.userId,
    name: row.name,
    algorithmId: row.algorithm,
    publicKey: Uint8Array.from(
      atob(row.publicKey)
        .split("")
        .map((char) => char.charCodeAt(0)),
    ),
  };
  return credential;
}

export async function getUserPasskeyCredential(
  userId: number,
  credentialId: Uint8Array,
): Promise<WebAuthnUserCredential | null> {
  const row = await db.query.passkeyCredentials.findFirst({
    columns: {
      id: true,
      userId: true,
      name: true,
      algorithm: true,
      publicKey: true,
    },
    where: and(
      eq(passkeyCredentials.id, Buffer.from(credentialId).toString("base64")),
      eq(passkeyCredentials.userId, userId),
    ),
  });

  if (!row) {
    return null;
  }
  const credential: WebAuthnUserCredential = {
    id: Uint8Array.from(
      atob(row.id)
        .split("")
        .map((char) => char.charCodeAt(0)),
    ),
    userId: row.userId,
    name: row.name,
    algorithmId: row.algorithm,
    publicKey: Uint8Array.from(
      atob(row.publicKey)
        .split("")
        .map((char) => char.charCodeAt(0)),
    ),
  };
  return credential;
}

export function createPasskeyCredential(
  credential: WebAuthnUserCredential,
): void {
  db.insert(passkeyCredentials).values({
    id: Buffer.from(credential.id).toString("base64"),
    userId: credential.userId,
    name: credential.name,
    algorithm: credential.algorithmId,
    publicKey: Buffer.from(credential.publicKey).toString("base64"),
  });
}

export async function deleteUserPasskeyCredential(
  userId: number,
  credentialId: Uint8Array,
): Promise<boolean> {
  const deletedPasskeys = await db
    .delete(passkeyCredentials)
    .where(
      and(
        eq(passkeyCredentials.id, Buffer.from(credentialId).toString("base64")),
        eq(passkeyCredentials.userId, userId),
      ),
    )
    .returning({ deletedId: passkeyCredentials.id });

  return deletedPasskeys.length > 0;
}

export async function getUserSecurityKeyCredentials(
  userId: number,
): Promise<WebAuthnUserCredential[]> {
  const rows = await db.query.securityKeyCredentials.findMany({
    where: eq(securityKeyCredentials.userId, userId),
    columns: {
      id: true,
      userId: true,
      name: true,
      algorithm: true,
      publicKey: true,
    },
  });
  //   const rows = db.query(
  //     "SELECT id, user_id, name, algorithm, public_key FROM security_key_credential WHERE user_id = ?",
  //     [userId],
  //   );
  const credentials: WebAuthnUserCredential[] = [];
  for (const row of rows) {
    const credential: WebAuthnUserCredential = {
      id: Uint8Array.from(
        atob(row.id)
          .split("")
          .map((char) => char.charCodeAt(0)),
      ),
      userId: row.userId,
      name: row.name,
      algorithmId: row.algorithm,
      publicKey: Uint8Array.from(
        atob(row.publicKey)
          .split("")
          .map((char) => char.charCodeAt(0)),
      ),
    };
    credentials.push(credential);
  }
  return credentials;
}

export async function getUserSecurityKeyCredential(
  userId: number,
  credentialId: Uint8Array,
): Promise<WebAuthnUserCredential | null> {
  const row = await db.query.securityKeyCredentials.findFirst({
    columns: {
      id: true,
      userId: true,
      name: true,
      algorithm: true,
      publicKey: true,
    },
    where: and(
      eq(
        securityKeyCredentials.id,
        Buffer.from(credentialId).toString("base64"),
      ),
      eq(securityKeyCredentials.userId, userId),
    ),
  });

  if (!row) {
    return null;
  }
  const credential: WebAuthnUserCredential = {
    id: Uint8Array.from(
      atob(row.id)
        .split("")
        .map((char) => char.charCodeAt(0)),
    ),
    userId: row.userId,
    name: row.name,
    algorithmId: row.algorithm,
    publicKey: Uint8Array.from(
      atob(row.publicKey)
        .split("")
        .map((char) => char.charCodeAt(0)),
    ),
  };
  return credential;
}

export function createSecurityKeyCredential(
  credential: WebAuthnUserCredential,
): void {
  db.insert(securityKeyCredentials).values({
    id: Buffer.from(credential.id).toString("base64"),
    userId: credential.userId,
    name: credential.name,
    algorithm: credential.algorithmId,
    publicKey: Buffer.from(credential.publicKey).toString("base64"),
  });
}

export async function deleteUserSecurityKeyCredential(
  userId: number,
  credentialId: Uint8Array,
): Promise<boolean> {
  const deletedSecurityKey = await db
    .delete(securityKeyCredentials)
    .where(
      and(
        eq(
          securityKeyCredentials.id,
          Buffer.from(credentialId).toString("base64"),
        ),
        eq(securityKeyCredentials.userId, userId),
      ),
    )
    .returning({ deletedId: securityKeyCredentials.id });

  return deletedSecurityKey.length > 0;
}

export interface WebAuthnUserCredential {
  id: Uint8Array;
  userId: number;
  name: string;
  algorithmId: number;
  publicKey: Uint8Array;
}
