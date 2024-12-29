import Link from "next/link";
import { redirect } from "next/navigation";

import { encodeBase64 } from "@oslojs/encoding";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Verify2FAWithPasskeyButton } from "~/components/verify-2fa-passkey";

import { get2FARedirect } from "~/server/2fa";
import { globalGETRateLimit } from "~/server/request";
import { getCurrentSession } from "~/server/session";
import { getUserPasskeyCredentials } from "~/server/webauthn";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { session, user } = await getCurrentSession();
  if (session === null || user === null) {
    return redirect("/log-in");
  }
  if (!user.emailVerified) {
    return redirect("/verify-email");
  }
  if (!user.registered2FA) {
    return redirect("/dashboard");
  }
  if (session.twoFactorVerified) {
    return redirect("/dashboard");
  }
  if (!user.registeredPasskey) {
    return redirect(get2FARedirect(user));
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
          <Link href="/2fa/reset">Use recovery code</Link>
        </Button>
        {user.registeredTOTP && (
          <Button asChild variant="outline">
            <Link href="/2fa/totp">Use authenticator apps</Link>
          </Button>
        )}
        {user.registeredSecurityKey && (
          <Button asChild variant="outline">
            <Link href="/2fa/security-key">Use security keys</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
