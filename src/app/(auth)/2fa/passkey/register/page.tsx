import { redirect } from "next/navigation";

import { bigEndian } from "@oslojs/binary";
import { encodeBase64 } from "@oslojs/encoding";
import { RegisterPasskeyForm } from "~/components/register-passkey";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

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
  if (user.registered2FA && !session.twoFactorVerified) {
    return redirect(get2FARedirect(user));
  }

  const credentials = await getUserPasskeyCredentials(user.id);

  const credentialUserId = new Uint8Array(8);
  bigEndian.putUint64(credentialUserId, BigInt(user.id), 0);
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register passkey</CardTitle>
      </CardHeader>
      <CardContent>
        <RegisterPasskeyForm
          encodedCredentialIds={credentials.map((credential) =>
            encodeBase64(credential.id),
          )}
          user={user}
          encodedCredentialUserId={encodeBase64(credentialUserId)}
        />
      </CardContent>
    </Card>
  );
}
