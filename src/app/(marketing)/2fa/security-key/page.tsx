import Link from "next/link";
import { redirect } from "next/navigation";

import { encodeBase64 } from "@oslojs/encoding";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { Verify2FAWithSecurityKeyButton } from "~/components/verify-security-key";

import { get2FARedirect } from "~/server/2fa";
import { getCurrentSession } from "~/server/session";
import { getUserSecurityKeyCredentials } from "~/server/webauthn";
import { globalGETRateLimit } from "~/server/request";

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
  if (!user.registeredSecurityKey) {
    return redirect(get2FARedirect(user));
  }
  const credentials = await getUserSecurityKeyCredentials(user.id);
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          Authenticate with security keys
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Verify2FAWithSecurityKeyButton
          encodedCredentialIds={credentials.map((credential) =>
            encodeBase64(credential.id),
          )}
        />
        <Link href="/2fa/reset">Use recovery code</Link>
        {user.registeredTOTP && (
          <Link href="/2fa/totp">Use authenticator apps</Link>
        )}
        {user.registeredPasskey && (
          <Link href="/2fa/passkey">Use passkeys</Link>
        )}
      </CardContent>
    </Card>
  );
}
