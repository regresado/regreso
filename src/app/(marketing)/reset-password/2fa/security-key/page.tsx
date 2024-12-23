import Link from "next/link";
import { redirect } from "next/navigation";

import { encodeBase64 } from "@oslojs/encoding";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { Verify2FAWithSecurityKeyButton } from "~/components/reset-with-security-key";

import { getUserSecurityKeyCredentials } from "~/server/webauthn";
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
  if (!user.registeredSecurityKey) {
    return redirect(getPasswordReset2FARedirect(user));
  }
  const credentials = await getUserSecurityKeyCredentials(user.id);
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          Authenticate with security keys
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Verify2FAWithSecurityKeyButton
          encodedCredentialIds={credentials.map((credential) =>
            encodeBase64(credential.id),
          )}
        />
        <Button asChild variant="outline">
          <Link href="/reset-password/2fa/recovery-code">
            Use recovery code
          </Link>
        </Button>
        {user.registeredTOTP && (
          <Button asChild variant="outline">
            <Link href="/reset-password/2fa/totp">Use authenticator apps</Link>
          </Button>
        )}
        {user.registeredPasskey && (
          <Button asChild variant="outline">
            <Link href="/reset-password/2fa/passkey">Use passkeys</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
