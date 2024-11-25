import { redirect } from "next/navigation";
import Link from "next/link";

import { LoginForm } from "~/components/login-form";
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
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
      <Link href="/signup">Create an account</Link>
      <Link href="/forgot-password">Forgot password?</Link>
    </div>
  );
}
