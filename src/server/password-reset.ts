import { cache } from "react";
import { cookies } from "next/headers";

import { eq } from "drizzle-orm";

import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import { db } from "~/server/db";
import { passwordResetSessions } from "~/server/db/schema";
import { generateRandomOTP } from "~/server/utils";
import type { User } from "~/server/models";

export async function createPasswordResetSession(
  token: string,
  userId: number,
  email: string,
): Promise<PasswordResetSession> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: PasswordResetSession = {
    id: sessionId,
    userId,
    email,
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    code: generateRandomOTP(),
    emailVerified: false,
    twoFactorVerified: false,
  };

  await db.insert(passwordResetSessions).values(session);
  return session;
}

export async function validatePasswordResetSessionToken(
  token: string,
): Promise<PasswordResetSessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const resetSession = (await db.query.passwordResetSessions.findFirst({
    where: eq(passwordResetSessions.id, sessionId),
    with: {
      user: true,
    },
  })) as {
    id: string;
    userId: number;
    email: string;
    code: string;
    expiresAt: Date;
    emailVerified: boolean;
    twoFactorVerified: boolean;
    user: {
      id: number;
      email: string;
      name: string;
      displayName: string;
      emailVerified: boolean;
      totpKey: string | null;
    };
  } | null;
  console.log("resetSession", resetSession);
  if (!resetSession) {
    return { session: null, user: null };
  }
  const session: PasswordResetSession = {
    id: resetSession.id,
    userId: resetSession.userId,
    email: resetSession.email,
    code: resetSession.code,
    expiresAt: resetSession.expiresAt,
    emailVerified: resetSession.emailVerified,
    twoFactorVerified: resetSession.twoFactorVerified,
  };
  const user: User = {
    id: resetSession.user.id,
    email: resetSession.user.email,
    displayName: resetSession.user.displayName,
    name: resetSession.user.name,
    emailVerified: resetSession.user.emailVerified,
    registered2FA: false,
  };
  if (resetSession.user.totpKey) {
    user.registered2FA = true;
  }

  return { session, user };
}

export function setPasswordResetSessionAsEmailVerified(
  sessionId: string,
): void {
  //   db.execute(
  //     "UPDATE password_reset_session SET email_verified = 1 WHERE id = ?",
  //     [sessionId],
  //   );
  void db
    .update(passwordResetSessions)
    .set({
      emailVerified: true,
    })
    .where(eq(passwordResetSessions.id, sessionId))
    .returning({ emailVerified: passwordResetSessions.emailVerified });
}

export function setPasswordResetSessionAs2FAVerified(sessionId: string): void {
  //   db.execute(
  //     "UPDATE password_reset_session SET two_factor_verified = 1 WHERE id = ?",
  //     [sessionId],
  //   );
  void db
    .update(passwordResetSessions)
    .set({
      twoFactorVerified: true,
    })
    .where(eq(passwordResetSessions.id, sessionId))
    .returning({ twoFactorVerified: passwordResetSessions.twoFactorVerified });
}

export function invalidateUserPasswordResetSessions(userId: number): void {
  db.delete(passwordResetSessions).where(
    eq(passwordResetSessions.userId, userId),
  );
  //   db.execute("DELETE FROM password_reset_session WHERE user_id = ?", [userId]);
}

export const getCurrentPasswordResetSession = cache(async () => {
  const token = (await cookies()).get("password_reset_session")?.value ?? null;
  if (token === null) {
    return { session: null, user: null };
  }
  const result = await validatePasswordResetSessionToken(token);
  if (result.session === null) {
    void deletePasswordResetSessionTokenCookie();
  }
  return result;
});

export async function setPasswordResetSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  (await cookies()).set("password_reset_session", token, {
    expires: expiresAt,
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function deletePasswordResetSessionTokenCookie(): Promise<void> {
  (await cookies()).set("password_reset_session", "", {
    maxAge: 0,
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export function sendPasswordResetEmail(email: string, code: string): void {
  console.log(`To ${email}: Your reset code is ${code}`);
}

export interface PasswordResetSession {
  id: string;
  userId: number;
  email: string;
  expiresAt: Date;
  code: string;
  emailVerified: boolean;
  twoFactorVerified: boolean;
}

export type PasswordResetSessionValidationResult =
  | { session: PasswordResetSession; user: User }
  | { session: null; user: null };
