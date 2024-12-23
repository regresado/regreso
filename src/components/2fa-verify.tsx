"use client";

import { useActionState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AlertCircle } from "lucide-react";

import { verify2FAAction } from "~/app/(marketing)/2fa/totp/actions";
import { logoutAction } from "~/app/(platform)/actions";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

const FormSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Your one-time password must be 6 characters.",
    })
    .max(6, {
      message: "Your one-time password must be 6 characters.",
    }),
});

const twoFactorVerificationInitialState = {
  message: "",
};

const logoutState = {
  message: "",
};

export function TwoFactorVerificationForm() {
  const [state, action] = useActionState(
    verify2FAAction,
    twoFactorVerificationInitialState,
  );
  const [, outAction] = useActionState(logoutAction, logoutState);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });
  const {
    trigger,
    formState: { isValid },
  } = form;

  return (
    <>
      <Form {...form}>
        <form
          action={action}
          onSubmit={async (e) => {
            if (!isValid) {
              e.preventDefault();
              await trigger();
              return;
            }
            e.currentTarget?.requestSubmit();
          }}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={8}
                    {...field}
                    autoComplete="one-time-code"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the code from the app.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Verify</Button>

          {state.message.length > 0 ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {state.message ?? "An error occurred"}
              </AlertDescription>
            </Alert>
          ) : null}
        </form>
      </Form>
      <div className="mt-4 flex justify-end space-x-4">
        <form action={outAction} className="mt-4">
          <Button variant="destructive" type="submit">
            Log out
          </Button>
        </form>
      </div>
    </>
  );
}
