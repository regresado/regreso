import Link from "next/link";
import { redirect } from "next/navigation";

import { encodeBase64 } from "@oslojs/encoding";
import { Verify2FAWithPasskeyButton } from "~/components/reset-with-2fa-passkey";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { getPasswordReset2FARedirect } from "~/server/2fa";
import { getCurrentPasswordResetSession } from "~/server/password-reset";
import { globalGETRateLimit } from "~/server/request";
import { getUserPasskeyCredentials } from "~/server/webauthn";

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
  if (!user.registeredPasskey) {
    return redirect(getPasswordReset2FARedirect(user));
  }
  const credentials = await getUserPasskeyCredentials(user.id);
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Authenticate with passkeys</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Verify2FAWithPasskeyButton
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
