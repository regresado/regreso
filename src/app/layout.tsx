import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { GeistSans } from "geist/font/sans";

import { ThemeProvider } from "~/app/providers";

export const metadata: Metadata = {
  title: "Regreso | Dashboard",
  description: "Regreso is an app that helps you find your way back.",
  icons: [
    { rel: "icon", url: "/favicon.ico", sizes: "any" },
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
