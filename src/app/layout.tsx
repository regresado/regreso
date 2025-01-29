import "~/styles/globals.css";

import React, { ReactNode } from "react";
import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { TolgeeStaticData } from "@tolgee/react";
import { TolgeeNextProvider } from "~/tolgee/client";
import { getLanguage } from "~/tolgee/language";
import { getTolgee } from "~/tolgee/server";
import { GeistSans } from "geist/font/sans";

import { ThemeProvider } from "~/app/providers";

import { CSPostHogProvider } from "./providers";

export const metadata: Metadata = {
  title: "Regreso | Dashboard",
  description: "Regreso is an app that helps you find your way back.",
  icons: [
    { rel: "icon", url: "/favicon.ico", sizes: "any" },
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLanguage();
  const tolgee = await getTolgee();
  // serializable data that are passed to client components
  const translations = await tolgee.loadRequired();
  const staticData: TolgeeStaticData = {
    translations: { en: translations as any },
  };

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <CSPostHogProvider>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TolgeeNextProvider language={locale} staticData={staticData}>
              {children}
            </TolgeeNextProvider>
          </ThemeProvider>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
