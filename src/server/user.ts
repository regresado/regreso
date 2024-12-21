import { and, eq } from "drizzle-orm";

import { db } from "~/server/db";
import { users } from "~/server/db/schema";

import { decryptToString, encryptString } from "~/server/encryption";
import { hashPassword } from "~/server/password";
import { generateRandomRecoveryCode } from "~/server/utils";
import type { User } from "~/server/models";

export function verifyUsernameInput(username: string): boolean {
  const reservedUsernames = [
    "admin",
    "administrator",
    "mod",
    "moderator",
    "staff",
    "owner",
    "developer",
    "dev",
    "support",
    "help",
    "contact",
    "anonymous",
  ];
  return (
    username.length > 3 &&
    username.length < 32 &&
    username.trim() === username &&
    !reservedUsernames.includes(username)
  );
}

export async function createUser(
  email: string,
  displayName: string,
  name: string,
  password: string | null,
  googleId: string | null,
  githubId: number | null,
): Promise<User> {
  const passwordHash = password ? await hashPassword(password) : null;
  const recoveryCode = generateRandomRecoveryCode();
  const encryptedRecoveryCode = encryptString(recoveryCode);

  const row = await db
    .insert(users)
    .values({
      email,
      name,
      googleId,
      githubId,
      displayName,
      emailVerified: googleId || githubId ? true : false,
      passwordHash: passwordHash
        ? Buffer.from(passwordHash).toString("base64")
        : null,
      recoveryCode: Buffer.from(encryptedRecoveryCode).toString("base64"),
    })
    .returning({ id: users.id });
  if (!row || row.length === 0) {
    throw new Error("Unexpected error");
  }
  const user: User = {
    id: row[0]!.id,
    email,
    displayName,
    name,
    googleId,
    githubId,
    registeredTOTP: false,
    registeredPasskey: false,
    registeredSecurityKey: false,
    emailVerified: false,
    avatarUrl: null,
    registered2FA: false,
  };

  return user;
}

export async function getUserFromGoogleId(
  googleId: string,
): Promise<User | null> {
  if (!googleId) {
    return null;
  }

  const userProfile = await db.query.users.findFirst({
    where: eq(users.googleId, googleId),
    with: {
      totpCredentials: true,
      passkeyCredentials: true,
      securityKeyCredentials: true,
    },
  });
  if (!userProfile) {
    return null;
  }
  const user: User = {
    id: userProfile.id,
    email: userProfile.email,
    name: userProfile.name,
    displayName: userProfile.displayName,
    emailVerified: userProfile.emailVerified,
    googleId: userProfile.googleId,
    githubId: userProfile.githubId,
    registeredTOTP: userProfile.totpCredentials.length > 0,
    registeredPasskey: userProfile.passkeyCredentials.length > 0,
    registeredSecurityKey: userProfile.securityKeyCredentials.length > 0,
    avatarUrl: userProfile.avatarUrl,
    registered2FA: false,
  };
  if (
    user.registeredPasskey ||
    user.registeredSecurityKey ||
    user.registeredTOTP
  ) {
    user.registered2FA = true;
  }
  return user;
}

export async function getUserFromGitHubId(
  githubId: number,
): Promise<User | null> {
  if (!githubId) {
    return null;
  }

  const userProfile = await db.query.users.findFirst({
    where: eq(users.githubId, githubId),
    with: {
      totpCredentials: true,
      passkeyCredentials: true,
      securityKeyCredentials: true,
    },
  });
  if (!userProfile) {
    return null;
  }
  const user: User = {
    id: userProfile.id,
    email: userProfile.email,
    name: userProfile.name,
    displayName: userProfile.displayName,
    emailVerified: userProfile.emailVerified,
    googleId: userProfile.googleId,
    githubId: userProfile.githubId,
    registeredTOTP: userProfile.totpCredentials.length > 0,
    registeredPasskey: userProfile.passkeyCredentials.length > 0,
    registeredSecurityKey: userProfile.securityKeyCredentials.length > 0,
    avatarUrl: userProfile.avatarUrl,
    registered2FA: false,
  };
  if (
    user.registeredPasskey ||
    user.registeredSecurityKey ||
    user.registeredTOTP
  ) {
    user.registered2FA = true;
  }
  return user;
}

export async function getUserPasswordHash(userId: number): Promise<string> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user?.passwordHash) {
    throw new Error("Invalid user ID");
  }
  return atob(user?.passwordHash);
}

export async function updateUserPassword(
  userId: number,
  password: string,
): Promise<void> {
  const passwordHash = await hashPassword(password);
  db.update(users)
    .set({
      passwordHash,
    })
    .where(eq(users.id, userId));
}

export async function updateUserEmailAndSetEmailAsVerified(
  userId: number,
  email: string,
): Promise<void> {
  await db
    .update(users)
    .set({
      emailVerified: true,
      email,
    })
    .where(eq(users.id, userId));
}

export async function setUserAsEmailVerifiedIfEmailMatches(
  userId: number,
  email: string,
): Promise<boolean> {
  const updatedVerification: { emailVerified: boolean }[] = await db
    .update(users)
    .set({
      emailVerified: true,
    })
    .where(and(eq(users.id, userId), eq(users.email, email)))
    .returning({ emailVerified: users.emailVerified });

  return updatedVerification[0]?.emailVerified !== undefined;
}

export async function getUserRecoverCode(userId: number): Promise<string> {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!result) {
    throw new Error("Invalid user ID");
  }
  if (!result?.recoveryCode) {
    throw new Error("Invalid recovery code");
  }
  return decryptToString(
    Uint8Array.from(
      atob(result.recoveryCode)
        .split("")
        .map((char) => char.charCodeAt(0)),
    ),
  );
}

export function resetUserRecoveryCode(userId: number): string {
  const recoveryCode = generateRandomRecoveryCode();
  const encrypted = encryptString(recoveryCode);
  db.update(users)
    .set({
      recoveryCode: Buffer.from(encrypted).toString("base64"),
    })
    .where(eq(users.id, userId));

  return recoveryCode;
}

export async function getUserFromEmail(email: string): Promise<User | null> {
  const userResult = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      totpCredentials: true,
      passkeyCredentials: true,
      securityKeyCredentials: true,
    },
  });

  if (!userResult) {
    return null;
  }

  const user: User = {
    id: userResult.id,
    email: userResult.email,
    name: userResult.name,
    displayName: userResult.displayName,
    googleId: userResult.googleId,
    githubId: userResult.githubId,
    emailVerified: userResult.emailVerified,
    registeredTOTP: userResult.totpCredentials.length > 0,
    registeredPasskey: userResult.passkeyCredentials.length > 0,
    registeredSecurityKey: userResult.securityKeyCredentials.length > 0,
    avatarUrl: userResult.avatarUrl,
    registered2FA: false,
  };
  if (
    user.registeredPasskey ||
    user.registeredSecurityKey ||
    user.registeredTOTP
  ) {
    user.registered2FA = true;
  }
  return user;
}
