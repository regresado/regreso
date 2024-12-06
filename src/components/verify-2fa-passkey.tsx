"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { decodeBase64, encodeBase64 } from "@oslojs/encoding";

import { AlertCircle } from "lucide-react";

import { createChallenge } from "~/lib/client/webauthn";

import { verify2FAWithPasskeyAction } from "~/app/(marketing)/2fa/passkey/actions";

import { Button } from "~/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";

export function Verify2FAWithPasskeyButton(props: {
  encodedCredentialIds: string[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  return (
    <div>
      <Button
        onClick={async () => {
          const challenge = await createChallenge();

          const credential = await navigator.credentials.get({
            publicKey: {
              challenge,
              userVerification: "discouraged",
              allowCredentials: props.encodedCredentialIds.map((encoded) => {
                return {
                  id: decodeBase64(encoded),
                  type: "public-key",
                };
              }),
            },
          });

          if (!(credential instanceof PublicKeyCredential)) {
            throw new Error("Failed to create public key");
          }
          if (
            !(credential.response instanceof AuthenticatorAssertionResponse)
          ) {
            throw new Error("Unexpected error");
          }

          const result = await verify2FAWithPasskeyAction({
            credential_id: encodeBase64(new Uint8Array(credential.rawId)),
            signature: encodeBase64(
              new Uint8Array(credential.response.signature),
            ),
            authenticator_data: encodeBase64(
              new Uint8Array(credential.response.authenticatorData),
            ),
            client_data_json: encodeBase64(
              new Uint8Array(credential.response.clientDataJSON),
            ),
          });
          if (result.error !== null) {
            setMessage(result.error);
          } else {
            router.push("/dashboard");
          }
        }}
      >
        Authenticate
      </Button>
      {message.length > 0 ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message ?? "An error occurred"}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
