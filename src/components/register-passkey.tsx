"use client";

import { useActionState, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { decodeBase64, encodeBase64 } from "@oslojs/encoding";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { User } from "~/server/models";

import { createChallenge } from "~/lib/client/webauthn";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { registerPasskeyAction } from "~/app/(auth)/2fa/passkey/register/actions";

const initialRegisterPasskeyState = {
  message: "",
};
const FormSchema = z.object({
  name: z.string(),
  client_data_json: z.any(),
  attestation_object: z.any(),
});

export function RegisterPasskeyForm(props: {
  encodedCredentialUserId: string;
  user: User;
  encodedCredentialIds: string[];
}) {
  const [encodedAttestationObject, setEncodedAttestationObject] = useState<
    string | null
  >(null);
  const [encodedClientDataJSON, setEncodedClientDataJSON] = useState<
    string | null
  >(null);
  const [message, setMessage] = useState("");
  const [formState, action] = useActionState(
    registerPasskeyAction,
    initialRegisterPasskeyState,
  );
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      client_data_json: encodedClientDataJSON ?? "",
      attestation_object: encodedAttestationObject ?? "",
    },
    values: {
      name: "",
      attestation_object: encodedAttestationObject ?? "",
      client_data_json: encodedClientDataJSON ?? "",
    },
  });
  useEffect(() => {
    setMessage(formState.message);
  }, [formState.message]);
  return (
    <>
      <Button
        className="mb-4"
        disabled={
          encodedAttestationObject !== null && encodedClientDataJSON !== null
        }
        onClick={async () => {
          try {
            const challenge = await createChallenge();
            const credential = await navigator.credentials.create({
              publicKey: {
                challenge,
                user: {
                  displayName: props.user.name,
                  id: decodeBase64(props.encodedCredentialUserId),
                  name: props.user.email,
                },
                rp: {
                  name: "Regreso",
                },
                pubKeyCredParams: [
                  {
                    alg: -7,
                    type: "public-key",
                  },
                  {
                    alg: -257,
                    type: "public-key",
                  },
                ],
                attestation: "none",
                authenticatorSelection: {
                  userVerification: "required",
                  residentKey: "required",
                  requireResidentKey: true,
                },
                excludeCredentials: props.encodedCredentialIds.map(
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
              !(credential.response instanceof AuthenticatorAttestationResponse)
            ) {
              throw new Error("Unexpected error");
            }

            setEncodedAttestationObject(
              encodeBase64(
                new Uint8Array(credential.response.attestationObject),
              ),
            );
            setEncodedClientDataJSON(
              encodeBase64(new Uint8Array(credential.response.clientDataJSON)),
            );
          } catch (e) {
            if (e instanceof Error) {
              setMessage(e.message);
            } else {
              setMessage("An unknown error occurred");
            }
          }
        }}
      >
        Create credential
      </Button>
      <Form {...form}>
        <form action={action} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credential name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormDescription>
                  Please enter a name for your new credential.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="attestation_object"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="client_data_json"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={
              encodedAttestationObject === null &&
              encodedClientDataJSON === null
            }
            type="submit"
          >
            Continue
          </Button>
          {message.length > 0 ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {message ?? "An error occurred"}
              </AlertDescription>
            </Alert>
          ) : null}
        </form>
      </Form>
    </>
  );
}
