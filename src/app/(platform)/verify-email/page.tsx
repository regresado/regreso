import Link from "next/link";

import { getCurrentSession } from "~/server/session";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "~/server/request";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { session, user } = await getCurrentSession();
  if (session === null || user === null) {
    return redirect("/login");
  }
  if (user.emailVerified) {
    return redirect("/dashboard");
  }
  if (user.registered2FA) {
    return redirect("/dashboard");
  }
  return <></>;
}
