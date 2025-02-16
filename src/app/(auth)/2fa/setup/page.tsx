import { redirect } from "next/navigation";

import { globalGETRateLimit } from "~/server/request";
import { getCurrentSession } from "~/server/session";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { TwoFactorSetup } from "~/components/2fa-setup";

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
    return redirect("/dashboard?loginState=signedIn");
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
        <TwoFactorSetup />
      </CardContent>
    </Card>
  );
}
