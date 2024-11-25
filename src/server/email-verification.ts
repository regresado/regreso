import { generateRandomOTP } from "~/server/utils";
import { db } from "~/server/db";
import { and, eq } from "drizzle-orm";

import { emailVerificationRequests } from "~/server/db/schema";
import { ExpiringTokenBucket } from "~/server/rate-limit";
import { encodeBase32 } from "@oslojs/encoding";
import { cookies } from "next/headers";
import { getCurrentSession } from "./session";

export async function getUserEmailVerificationRequest(
  userId: number,
  id: string,
): Promise<EmailVerificationRequest | null> {
  const verificationRequest =
    await db.query.emailVerificationRequests.findFirst({
      where: and(
        eq(emailVerificationRequests.userId, userId),
        eq(emailVerificationRequests.id, id),
      ),
    });
  if (!verificationRequest) {
    return null;
  }
  const request: EmailVerificationRequest = verificationRequest;
  return request;
}

export async function createEmailVerificationRequest(
  userId: number,
  email: string,
): Promise<EmailVerificationRequest> {
  void deleteUserEmailVerificationRequest(userId);
  const idBytes = new Uint8Array(20);
  crypto.getRandomValues(idBytes);
  const id = encodeBase32(idBytes).toLowerCase();

  const code = generateRandomOTP();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

  const request: EmailVerificationRequest = {
    id,
    userId,
    code,
    email,
    expiresAt,
  };
  await db.insert(emailVerificationRequests).values(request);

  return request;
}

export async function deleteUserEmailVerificationRequest(
  userId: number,
): Promise<void> {
  await db
    .delete(emailVerificationRequests)
    .where(eq(emailVerificationRequests.userId, userId));
}

export function sendVerificationEmail(email: string, code: string): void {
  console.log(`To ${email}: Your verification code is ${code}`);
}

export async function setEmailVerificationRequestCookie(
  request: EmailVerificationRequest,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("email_verification", request.id, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: request.expiresAt,
  });
}

export async function deleteEmailVerificationRequestCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("email_verification", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}

export async function getUserEmailVerificationRequestFromRequest(): Promise<EmailVerificationRequest | null> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return null;
  }
  const cookieStore = await cookies();
  const id = cookieStore.get("email_verification")?.value ?? null;
  if (id === null) {
    return null;
  }
  const request = getUserEmailVerificationRequest(user.id, id);
  if (request === null) {
    // TODO: Evaluate whether this is correct or not
    void deleteEmailVerificationRequestCookie();
  }
  return request;
}

export const sendVerificationEmailBucket = new ExpiringTokenBucket<number>(
  3,
  60 * 10,
);

export interface EmailVerificationRequest {
  id: string;
  userId: number;
  code: string;
  email: string;
  expiresAt: Date;
}
