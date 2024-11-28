import { redirect } from "next/navigation";

import { SignupForm } from "~/components/signup-form";
import { getCurrentSession } from "~/server/session";

import { globalGETRateLimit } from "~/server/request";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests!!";
  }
  const { session, user } = await getCurrentSession();
  if (session !== null) {
    // TODO: Redirect to the correct page based on the user's state
    if (!user.emailVerified) {
      return redirect("/verify-email");
    }
    if (!user.registered2FA) {
      return redirect("/2fa/setup");
    }
    if (!session.twoFactorVerified) {
      return redirect("/2fa");
    }
    return redirect("/dashboard");
  }

  return <SignupForm />;
}
