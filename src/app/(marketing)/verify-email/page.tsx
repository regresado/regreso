import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";

import {
  EmailVerificationForm,
  ResendEmailVerificationCodeForm,
} from "~/components/verify-email";

import { getCurrentSession } from "~/server/session";
import { redirect } from "next/navigation";
import { getCurrentUserEmailVerificationRequest } from "~/server/email-verification";
import { globalGETRateLimit } from "~/server/request";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/log-in");
  }

  // TODO: Ideally we'd sent a new verification email automatically if the previous one is expired,
  // but we can't set cookies inside server components.
  const verificationRequest = await getCurrentUserEmailVerificationRequest();
  if (verificationRequest === null && user.emailVerified) {
    return redirect("/dashboard");
  }
  return (
    <>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Email</CardTitle>
          <CardDescription>
            We sent an 8-digit code to{" "}
            {verificationRequest?.email ?? user.email}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <p className="mb-4">
            We sent an 8-digit code to{" "}
            {verificationRequest?.email ?? user.email}.
          </p> */}
          <EmailVerificationForm />
          <ResendEmailVerificationCodeForm />
          {/* <Link href="/settings">Change your email</Link> */}
        </CardContent>
      </Card>
      {/* <h1>Verify your email address</h1>
      <p className="mb-4">
        We sent an 8-digit code to {verificationRequest?.email ?? user.email}.
      </p>
      <EmailVerificationForm />
      <ResendEmailVerificationCodeForm /> */}
      {/* <Link href="/settings">Change your email</Link> */}
    </>
  );
}
