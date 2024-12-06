import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { TwoFactorResetForm } from "~/components/2fa-reset";

import { getCurrentSession } from "~/server/session";
import { globalGETRateLimit } from "~/server/request";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { session, user } = await getCurrentSession();
  if (session === null) {
    return redirect("/log-in");
  }
  if (!user.emailVerified) {
    return redirect("/verify-email");
  }
  if (!user.registered2FA) {
    return redirect("/2fa/setup");
  }
  if (session.twoFactorVerified) {
    return redirect("/dashboard");
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Recover your accoun</CardTitle>
        <CardDescription>
          Regain access to your account using 2FA methods.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TwoFactorResetForm />
      </CardContent>
    </Card>
  );
}
