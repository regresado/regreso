import { cache } from "react";

import { and, eq } from "drizzle-orm";

import nodemailer from "nodemailer";

import { generateRandomOTP } from "~/server/utils";
import { db } from "~/server/db";

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

export async function sendVerificationEmail(
  email: string,
  code: string,
): Promise<Error | null> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your Email for Regreso",
    html: `<p>To ${email}: Your verification code is ${code}</p>
    <p>Enter this code in the verification form to activate your account.</p>
    <strong>The Regreso Team</strong>`,
  };
  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        resolve(err);
        console.log("error sending", err);
      } else {
        console.log("Email sent: " + info.response);
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
    // TODO: Evaluate whether this is correct or not
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
