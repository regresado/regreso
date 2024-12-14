import { redirect } from "next/navigation";

import { encodeBase64 } from "@oslojs/encoding";
import { createTOTPKeyURI } from "@oslojs/otp";

import { renderSVG } from "uqr";

import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";
import { TOTPSetUpForm } from "~/components/totp-setup";

import { getCurrentSession } from "~/server/session";
import { get2FARedirect } from "~/server/2fa";
import { globalGETRateLimit } from "~/server/request";

export default async function Page() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { session, user } = await getCurrentSession();
  if (session === null) {
    return redirect("/log-in");
  }
  if (!user.emailVerified) {
    return redirect("/verify-email");
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    return redirect(get2FARedirect(user));
  }

  const totpKey = new Uint8Array(20);
  crypto.getRandomValues(totpKey);
  const encodedTOTPKey = encodeBase64(totpKey);
  const keyURI = createTOTPKeyURI("Regreso", user.name, totpKey, 30, 6);
  const qrcode = renderSVG(keyURI);
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Set up authenticator app</CardTitle>
        <CardDescription>
          Enable 2FA by scanning/entering this code with a TOTP authenticator
          app.{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="mb-2"
          style={{
            width: "200px",
            height: "200px",
          }}
          dangerouslySetInnerHTML={{
            __html: qrcode,
          }}
        ></div>
        <TOTPSetUpForm encodedTOTPKey={encodedTOTPKey} />
      </CardContent>
    </Card>
  );
}
