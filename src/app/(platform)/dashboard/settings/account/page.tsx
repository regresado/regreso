import Link from "next/link";
import { redirect } from "next/navigation";

import { encodeBase64 } from "@oslojs/encoding";

import {
  DisconnectTOTPButton,
  PasskeyCredentialListItem,
  RecoveryCodeSection,
  SecurityKeyCredentialListItem,
  UpdateEmailForm,
  UpdatePasswordForm,
} from "~/components/account-settings";

import { getCurrentSession } from "~/server/session";
import { getUserRecoveryCode } from "~/server/user";
import { get2FARedirect } from "~/server/2fa";
import {
  getUserPasskeyCredentials,
  getUserSecurityKeyCredentials,
} from "~/server/webauthn";

import { globalGETRateLimit } from "~/server/request";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { session, user } = await getCurrentSession();
  if (session === null) {
    return redirect("/login");
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    return redirect(get2FARedirect(user));
  }
  let recoveryCode: string | null = null;
  if (user.registered2FA) {
    recoveryCode = await getUserRecoveryCode(user.id);
  }
  const passkeyCredentials = await getUserPasskeyCredentials(user.id);
  const securityKeyCredentials = await getUserSecurityKeyCredentials(user.id);
  return (
    <div className="space-y-4 overflow-y-scroll px-3">
      <Card>
        <CardHeader>
          <CardTitle>Update email</CardTitle>
          <CardDescription>Your email: {user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateEmailForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update password</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdatePasswordForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authenticator app</CardTitle>
        </CardHeader>
        <CardContent>
          {user.registeredTOTP ? (
            <>
              <Link href="/2fa/totp/setup">Update TOTP</Link>
              <DisconnectTOTPButton />
            </>
          ) : (
            <Button asChild variant="link">
              <Link href="/2fa/totp/setup">Set up TOTP</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Passkeys</CardTitle>
          <CardDescription>
            Passkeys are WebAuthn credentials that validate your identity using
            your device.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ul>
            {passkeyCredentials.map((credential) => {
              return (
                <PasskeyCredentialListItem
                  encodedId={encodeBase64(credential.id)}
                  name={credential.name}
                  key={encodeBase64(credential.id)}
                />
              );
            })}
          </ul>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/2fa/passkey/register">Add</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security keys</CardTitle>{" "}
          <CardDescription>
            Security keys are WebAuthn credentials that can only be used for
            two-factor authentication.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ul>
            {securityKeyCredentials.map((credential) => {
              return (
                <SecurityKeyCredentialListItem
                  encodedId={encodeBase64(credential.id)}
                  name={credential.name}
                  key={encodeBase64(credential.id)}
                />
              );
            })}
          </ul>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/2fa/security-key/register">Add</Link>
          </Button>
        </CardFooter>
      </Card>

      {recoveryCode !== null && (
        <RecoveryCodeSection recoveryCode={recoveryCode} />
      )}
    </div>
  );
}
