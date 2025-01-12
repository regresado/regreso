import { eq } from "drizzle-orm";
import type { User } from "~/server/models";

import { db } from "~/server/db";
import {
  passkeyCredentials,
  securityKeyCredentials,
  sessions,
  totpCredentials,
  users,
} from "~/server/db/schema";
import { decryptToString, encryptString } from "~/server/encryption";
import { ExpiringTokenBucket } from "~/server/rate-limit";
import { generateRandomRecoveryCode } from "~/server/utils";

export const recoveryCodeBucket = new ExpiringTokenBucket<number>(3, 60 * 60);

export async function resetUser2FAWithRecoveryCode(
  userId: number,
  recoveryCode: string,
): Promise<boolean> {
  // Note: In Postgres and MySQL, these queries should be done in a transaction using SELECT FOR UPDATE
  await db.transaction(async (tx) => {
    try {
      const [user] = await tx
        .select({ recoveryCode: users.recoveryCode })
        .from(users)
        .where(eq(users.id, userId));

      if (!user?.recoveryCode) {
        tx.rollback();
        return false;
      }
      const encryptedRecoveryCode = user?.recoveryCode;
      const userRecoveryCode = decryptToString(
        Uint8Array.from(
          atob(encryptedRecoveryCode)
            .split("")
            .map((char) => char.charCodeAt(0)),
        ),
      );

      if (recoveryCode !== userRecoveryCode) {
        tx.rollback();
        return false;
      }

      const newRecoveryCode = generateRandomRecoveryCode();
      const encryptedNewRecoveryCode = encryptString(newRecoveryCode);

      const setRecoveryCode = await tx
        .update(users)
        .set({
          recoveryCode: Buffer.from(encryptedNewRecoveryCode).toString(
            "base64",
          ),
        })
        .where(eq(users.id, userId))
        .returning({ recoveryCode: users.recoveryCode });

      if (
        setRecoveryCode &&
        setRecoveryCode.length > 0 &&
        setRecoveryCode[0] &&
        setRecoveryCode[0].recoveryCode !=
          Buffer.from(encryptedNewRecoveryCode).toString("base64")
      ) {
        tx.rollback();
        return false;
      }

      await tx
        .update(sessions)
        .set({
          twoFactorVerified: false,
        })
        .where(eq(sessions.userId, userId));

      await tx
        .delete(totpCredentials)
        .where(eq(totpCredentials.userId, userId));
      await tx
        .delete(passkeyCredentials)
        .where(eq(passkeyCredentials.userId, userId));
      await tx
        .delete(securityKeyCredentials)
        .where(eq(securityKeyCredentials.userId, userId));
    } catch (e) {
      if (e instanceof Error) {
        if (!e.toString().includes("Rollback")) {
          tx.rollback();
        }
      }
      return false;
    }
  });

  return true;
}

export function get2FARedirect(user: User): string {
  if (user.registeredPasskey) {
    return "/2fa/passkey";
  }
  if (user.registeredSecurityKey) {
    return "/2fa/security-key";
  }
  if (user.registeredTOTP) {
    return "/2fa/totp";
  }
  return "/2fa/setup";
}

export function getPasswordReset2FARedirect(user: User): string {
  if (user.registeredPasskey) {
    return "/reset-password/2fa/passkey";
  }
  if (user.registeredSecurityKey) {
    return "/reset-password/2fa/security-key";
  }
  if (user.registeredTOTP) {
    return "/reset-password/2fa/totp";
  }
  return "/2fa/setup";
}
