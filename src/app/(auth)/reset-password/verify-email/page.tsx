import { redirect } from "next/navigation";

import { getCurrentPasswordResetSession } from "~/server/password-reset";
import { globalGETRateLimit } from "~/server/request";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PasswordResetEmailVerificationForm } from "~/components/password-reset";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { session } = await getCurrentPasswordResetSession();
  if (session === null) {
    return redirect("/forgot-password");
  }
  if (session.emailVerified) {
    return redirect("/reset-password");
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Verify your Email Address</CardTitle>
        <CardDescription>
          We sent an 8-digit code to {session.email}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PasswordResetEmailVerificationForm />
      </CardContent>
    </Card>
  );
}
