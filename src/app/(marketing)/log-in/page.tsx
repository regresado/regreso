import { redirect } from "next/navigation";

import { LoginForm } from "~/components/login-form";
import { loginAction } from "~/app/(marketing)/log-in/actions";
import { getCurrentSession } from "~/server/session";

import { globalGETRateLimit } from "~/server/request";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests!!";
  }
  const { session, user } = await getCurrentSession();
  if (session !== null) {
    // TODO: Redirect to the correct page based on the user's state
    if (!user.emailVerified && !user.googleId && !user.githubId) {
      return redirect("/verify-email");
    }
    if (user.registered2FA && !session.twoFactorVerified) {
      return redirect("/2fa");
    }
    return redirect("/dashboard");
  }
  await loginAction(
    {
      message: "",
    },
    new FormData(),
  );
  return <LoginForm />;
}
