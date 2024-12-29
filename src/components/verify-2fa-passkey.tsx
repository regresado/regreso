"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

import { decodeBase64, encodeBase64 } from "@oslojs/encoding";
import { verify2FAWithPasskeyAction } from "~/app/(auth)/2fa/passkey/actions";
import { logoutAction } from "~/app/(platform)/actions";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { createChallenge } from "~/lib/client/webauthn";
import { AlertCircle } from "lucide-react";

const logoutState = {
  message: "",
};

export function Verify2FAWithPasskeyButton(props: {
  encodedCredentialIds: string[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const [, outAction] = useActionState(logoutAction, logoutState);

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Button
          onClick={async () => {
            try {
              const challenge = await createChallenge();

              const credential = await navigator.credentials.get({
                publicKey: {
                  challenge,
                  userVerification: "discouraged",
                  allowCredentials: props.encodedCredentialIds.map(
                    (encoded) => {
                      return {
                        id: decodeBase64(encoded),
                        type: "public-key",
                      };
                    },
                  ),
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
            } catch (e) {
              if (e instanceof Error) {
                setMessage(e.message);
              } else {
                setMessage("An unknown error occurred");
              }
            }
          }}
        >
          Authenticate
        </Button>
        <form action={outAction}>
          <Button variant="destructive" type="submit">
            Log out
          </Button>
        </form>
      </div>

      {message.length > 0 ? (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message ?? "An error occurred"}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
