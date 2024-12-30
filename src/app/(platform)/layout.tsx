"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { api, HydrateClient } from "~/trpc/server";
import { extractRouterConfig } from "uploadthing/server";

import { getCurrentSession } from "~/server/session";

import { Toaster } from "~/components/ui/toaster";

import { ClientLayout } from "~/app/(platform)/client-layout";
import { ourFileRouter } from "~/app/api/uploadthing/core";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, user } = await getCurrentSession();

  const cookieStore = await cookies();

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
      if (
        !user.registered2FA &&
        cookieStore.get("disable2FAReminder")?.value != "yes"
      ) {
        return redirect("/2fa/setup");
      }
    }
  }

  return (
    <HydrateClient>
      <NextSSRPlugin
        /**
         * The `extractRouterConfig` will extract **only** the route configs
         * from the router to prevent additional information from being
         * leaked to the client. The data passed to the client is the same
         * as if you were to fetch `/api/uploadthing` directly.
         */
        routerConfig={extractRouterConfig(ourFileRouter)}
      />
      <ClientLayout user={user}>{children}</ClientLayout>
      <Toaster />
    </HydrateClient>
  );
}
