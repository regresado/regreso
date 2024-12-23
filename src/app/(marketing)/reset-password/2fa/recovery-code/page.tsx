import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { PasswordResetRecoveryCodeForm } from "~/components/password-reset-recovery";

import { getCurrentPasswordResetSession } from "~/server/password-reset";

import { globalGETRateLimit } from "~/server/request";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { session, user } = await getCurrentPasswordResetSession();

  if (session === null) {
    return redirect("/forgot-password");
  }
  if (!session.emailVerified) {
    return redirect("/reset-password/verify-email");
  }
  if (!user.registered2FA) {
    return redirect("/reset-password");
  }
  if (session.twoFactorVerified) {
    return redirect("/reset-password");
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Use your recovery code</CardTitle>
      </CardHeader>
      <CardContent>
        <PasswordResetRecoveryCodeForm />
      </CardContent>
    </Card>
  );
}
