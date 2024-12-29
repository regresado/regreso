import { redirect } from "next/navigation";

import ProfileEdit from "~/components/profile-edit";

import { get2FARedirect } from "~/server/2fa";
import { globalGETRateLimit } from "~/server/request";
import { getCurrentSession } from "~/server/session";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { session, user } = await getCurrentSession();
  if (session === null) {
    return redirect("/log-in");
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    return redirect(get2FARedirect(user));
  }

  return <ProfileEdit user={user} />;
}
