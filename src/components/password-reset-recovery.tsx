"use client";

import { useActionState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AlertCircle } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { verifyPasswordReset2FAWithRecoveryCodeAction } from "~/app/(auth)/reset-password/2fa/recovery-code/actions";

const FormSchema = z.object({
  code: z
    .string()
    .min(16, {
      message: "Your one-time password must be 16 characters.",
    })
    .max(16, {
      message: "Your one-time password must be 16 characters.",
    }),
});

const initialPasswordResetRecoveryCodeState = {
  message: "",
};

export function PasswordResetRecoveryCodeForm() {
  const [state, action] = useActionState(
    verifyPasswordReset2FAWithRecoveryCodeAction,
    initialPasswordResetRecoveryCodeState,
  );

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
              <FormLabel>Recovery code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Please enter your recovery code</FormDescription>
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
  );
}
