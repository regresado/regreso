import Link from "next/link";
import { redirect } from "next/navigation";

import { get2FARedirect } from "~/server/2fa";
import { globalGETRateLimit } from "~/server/request";
import { getCurrentSession } from "~/server/session";
import { getUserRecoveryCode } from "~/server/user";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

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
  if (!session.twoFactorVerified) {
    return redirect(get2FARedirect(user));
  }
  const recoveryCode = getUserRecoveryCode(user.id);
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Recovery code</CardTitle>
        <CardDescription>
          You can use this recovery code if you lose access to your second
          factors. Save it in a safe place.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-sm leading-none">
          Your recovery code is: {recoveryCode}
        </p>
        <Button asChild>
          <Link href="/dashboard">My Dashboard</Link>
        </Button>{" "}
      </CardContent>
    </Card>
  );
}
