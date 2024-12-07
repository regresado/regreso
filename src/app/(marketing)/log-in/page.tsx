import { redirect } from "next/navigation";

import { LoginForm } from "~/components/login-form";

import { loginAction } from "~/app/(marketing)/log-in/actions";

import { getCurrentSession } from "~/server/session";
import { get2FARedirect } from "~/server/2fa";
import { globalGETRateLimit } from "~/server/request";

export default async function LogInPage() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests!!";
  }
  const { session, user } = await getCurrentSession();
  if (session !== null) {
    if (!user.emailVerified && !user.googleId && !user.githubId) {
      return redirect("/verify-email");
    }
    if (user.registered2FA && !session.twoFactorVerified) {
      return redirect("/2fa");
    }

    if (
      typeof window !== "undefined" &&
      !user.registered2FA &&
      !localStorage.getItem("disable2FAReminder")
    ) {
      return redirect("/2fa/setup");
    }

    if (!session.twoFactorVerified) {
      return redirect(get2FARedirect(user));
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
