import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { totpCredentials, users } from "~/server/db/schema";
import { decrypt, encrypt } from "~/server/encryption";
import { ExpiringTokenBucket, RefillingTokenBucket } from "~/server/rate-limit";

export const totpBucket = new ExpiringTokenBucket<number>(5, 60 * 30);
export const totpUpdateBucket = new RefillingTokenBucket<number>(3, 60 * 10);

export async function getUserTOTPKey(
  userId: number,
): Promise<Uint8Array | null> {
  const result = await db.query.totpCredentials.findFirst({
    columns: {
      key: true,
    },
    where: eq(totpCredentials.userId, userId),
  });

  if (!result) {
    throw new Error("Invalid user ID");
  }
  const encrypted = result.key;
  if (encrypted === null) {
    return null;
  }
  return decrypt(
    Uint8Array.from(
      atob(encrypted)
        .split("")
        .map((char) => char.charCodeAt(0)),
    ),
  );
}

export async function updateUserTOTPKey(
  userId: number,
  key: Uint8Array,
): Promise<void> {
  const encrypted = encrypt(key);
  await db.transaction(async (tx) => {
    try {
      const existingCredential = await tx
        .select({ key: totpCredentials.key })
        .from(totpCredentials)
        .where(eq(totpCredentials.userId, userId));
      if (existingCredential.length > 0) {
        await tx.delete(totpCredentials).where(eq(users.id, userId));
      }
      await tx.insert(totpCredentials).values({
        userId,
        key: Buffer.from(encrypted).toString("base64"),
      });
    } catch (e) {
      tx.rollback();
      throw e;
    }
  });
}

export function deleteUserTOTPKey(userId: number): void {
  db.delete(totpCredentials).where(eq(totpCredentials.userId, userId));
}
