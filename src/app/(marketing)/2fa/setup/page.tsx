import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";

import { getCurrentSession } from "~/server/session";
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
  if (user.registered2FA) {
    return redirect("/dashboard");
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          Set up two-factor authentication
        </CardTitle>
        <CardDescription>
          Protect your account with an additional layer of security.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium leading-none">2FA Methods:</p>
        <ul className="my-4 ml-6 list-disc [&>li]:ml-2">
          <li>
            <Button variant="link" asChild>
              <Link href="/2fa/totp/setup">Authenticator apps</Link>
            </Button>
          </li>
          <li>
            <Button variant="link" asChild>
              <Link href="/2fa/passkey/register">Passkeys</Link>
            </Button>
          </li>

          <li>
            <Button variant="link" asChild>
              <Link href="/2fa/security-key/register">Security keys</Link>
            </Button>
          </li>
        </ul>
        <Label htmlFor="skip" className="text-sm text-muted-foreground">
          If you do not wish to set up 2fa right now, you can always do so later
          from your Settings panel!
        </Label>
        <Button id="skip" className="mt-4" asChild>
          <Link href="/dashboard">Skip Setup</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
