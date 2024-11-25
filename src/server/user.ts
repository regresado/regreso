import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { users } from "~/server/db/schema";

import {
  decrypt,
  decryptToString,
  encrypt,
  encryptString,
} from "~/server/encryption";
import { hashPassword } from "./password";
import { generateRandomRecoveryCode } from "./utils";

export async function createUser(
  email: string,
  name: string,
  password: string,
  googleId: string | null,
): Promise<User> {
  const passwordHash = await hashPassword(password);
  const recoveryCode = generateRandomRecoveryCode();
  const encryptedRecoveryCode = encryptString(recoveryCode);

  const row = await db
    .insert(users)
    .values({
      email,
      name,
      passwordHash: new TextEncoder().encode(passwordHash),
      emailVerified: googleId ? true : false,
      recoveryCode: encryptedRecoveryCode,
    })
    .returning();
  if (!row || row.length === 0) {
    throw new Error("Unexpected error");
  }
  const user: User = {
    id: row[0].id,
    email: email,
    googleId: row[0].googleId,
    emailVerified: false,
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
  });
  if (!userProfile) {
    return null;
  }
  const user: User = {
    id: userProfile.id,
    email: userProfile.email,
    emailVerified: userProfile.emailVerified,
    googleId: userProfile.googleId,
    registered2FA: !!userProfile.totpKey,
  };
  return user;
}

export async function getUserPasswordHash(userId: number): Promise<string> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user?.passwordHash) {
    throw new Error("Invalid user ID");
  }
  return user?.passwordHash;
}

export async function getUserFromEmail(email: string): Promise<User | null> {
  const userResult = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!userResult) {
    return null;
  }

  const user: User = {
    id: userResult.id,
    email: userResult.email,
    googleId: userResult.googleId,
    emailVerified: userResult.emailVerified,
    registered2FA: !!userResult.totpKey,
  };
  return user;
}

export interface User {
  id: number;
  email: string;
  googleId: string | null;
  emailVerified: boolean;
  registered2FA: boolean;
}
