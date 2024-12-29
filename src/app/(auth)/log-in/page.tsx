import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { get2FARedirect } from "~/server/2fa";
import { globalGETRateLimit } from "~/server/request";
import { getCurrentSession } from "~/server/session";

import { LoginForm } from "~/components/login-form";

import { loginAction } from "~/app/(auth)/log-in/actions";

export default async function LogInPage() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests!!";
  }

  const cookieStore = await cookies();

  const { session, user } = await getCurrentSession();
  if (session !== null) {
    if (!user.emailVerified && !user.googleId && !user.githubId) {
      return redirect("/verify-email");
    }
    if (user.registered2FA && !session.twoFactorVerified) {
      return redirect("/2fa");
    }

    if (
      !user.registered2FA &&
      cookieStore.get("disable2FAReminder")?.value != "yes"
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
