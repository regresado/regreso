import { cache } from "react";
import { cookies } from "next/headers";

import { encodeBase32 } from "@oslojs/encoding";
import { and, eq } from "drizzle-orm";
import nodemailer from "nodemailer";

import { db } from "~/server/db";
import { emailVerificationRequests } from "~/server/db/schema";
import { ExpiringTokenBucket } from "~/server/rate-limit";
import { getCurrentSession } from "~/server/session";
import { generateRandomOTP } from "~/server/utils";
import { getBaseOrigin } from "~/lib/utils";

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

export async function sendVerificationEmail(
  email: string,
  code: string,
): Promise<Error | null> {
  // TODO: Consider adding hyphen between parts of OTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // TODO: Consider adding code to email subject line
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your Email for Regreso",
    html: `<div><p>To ${email}: Your verification code is ${code}</p> 
    <p>An account registration process has been initiated from <a href="${getBaseOrigin()}">Regreso</a>. Enter this code in the verification form to activate your account.</p>
    <strong>The Regreso Team</strong></div>`,
  };
  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        resolve(err);
      } else {
        resolve(null);
      }
    });
    setTimeout(() => {
      transporter.close();
      resolve(new Error("Timeout"));
    }, 1000);
  });
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
    void deleteEmailVerificationRequestCookie();
  }
  return request;
}

export const getCurrentUserEmailVerificationRequest = cache(async () => {
  const { user } = await getCurrentSession();
  if (user === null) {
    return null;
  }
  const id = (await cookies()).get("email_verification")?.value ?? null;
  if (id === null) {
    return null;
  }
  const request = getUserEmailVerificationRequest(user.id, id);
  if (request === null) {
    void deleteEmailVerificationRequestCookie();
  }
  return request;
});

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
