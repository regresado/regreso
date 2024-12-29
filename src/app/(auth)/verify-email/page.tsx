import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  EmailVerificationForm,
  ResendEmailVerificationCodeForm,
} from "~/components/verify-email";

import { getCurrentUserEmailVerificationRequest } from "~/server/email-verification";
import { globalGETRateLimit } from "~/server/request";
import { getCurrentSession } from "~/server/session";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const cookieStore = await cookies();

  const { user, session } = await getCurrentSession();
  if (user === null || session === null) {
    return redirect("/log-in");
  }

  // FIXME: Ideally we'd sent a new verification email automatically if the previous one is expired,
  // but we can't set cookies inside server components.
  const verificationRequest = await getCurrentUserEmailVerificationRequest();
  if (verificationRequest === null && user.emailVerified) {
    if (
      !user.registered2FA &&
      cookieStore.get("disable2FAReminder")?.value != "yes"
    ) {
      return redirect("/2fa/setup");
    }
    return redirect("/dashboard");
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Verify your Email Address</CardTitle>
        <CardDescription>
          We sent an 8-digit code to {verificationRequest?.email ?? user.email}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmailVerificationForm />
        <ResendEmailVerificationCodeForm />
      </CardContent>
    </Card>
  );
}
