import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";

import { PasswordResetTOTPForm } from "~/components/password-reset-totp";

import { getCurrentPasswordResetSession } from "~/server/password-reset";
import { getPasswordReset2FARedirect } from "~/server/2fa";

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
  if (!user.registeredTOTP) {
    return redirect(getPasswordReset2FARedirect(user));
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          Authenticate with authenticator app
        </CardTitle>
        <CardDescription>Enter the code from your app.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PasswordResetTOTPForm />
        <Button asChild variant="outline">
          <Link href="/reset-password/2fa/reset">Use recovery code</Link>
        </Button>
        {user.registeredPasskey && (
          <Button asChild variant="outline">
            <Link href="/reset-password/2fa/passkey">Use passkeys</Link>
          </Button>
        )}
        {user.registeredSecurityKey && (
          <Button asChild variant="outline">
            <Link href="/reset-password/2fa/security-key">
              Use security keys
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
