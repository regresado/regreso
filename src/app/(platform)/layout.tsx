"use server";
import { redirect } from "next/navigation";

import { HydrateClient } from "~/trpc/server";
import { ClientLayout } from "~/app/(platform)/client-layout";

import { getCurrentSession } from "~/server/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, user } = await getCurrentSession();

  // TODO: Audit this auth logic
  if (user) {
    if (session == null) {
      return redirect("/log-in");
    } else {
      if (!user.emailVerified && !user.githubId && !user.googleId) {
        return redirect("/verify-email");
      }
      if (user.registered2FA && !session.twoFactorVerified) {
        return redirect("/2fa");
      }
      //   return redirect("/dashboard");
    }
  }

  return (
    <HydrateClient>
      <ClientLayout user={user}>{children}</ClientLayout>
    </HydrateClient>
  );
}
