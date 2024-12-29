"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { skip2FASetupAction } from "~/app/(auth)/2fa/setup/actions";

const initialState = {
  error: "",
};

export function TwoFactorSetup() {
  const [, action] = useActionState(skip2FASetupAction, initialState);

  return (
    <>
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
      <form action={action} className="mt-4">
        <Button type="submit">Skip Setup</Button>
      </form>
    </>
  );
}
