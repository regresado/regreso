"use client";

import { useActionState, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  deletePasskeyAction,
  deleteSecurityKeyAction,
  disconnectTOTPAction,
  regenerateRecoveryCodeAction,
  updateEmailAction,
  updatePasswordAction,
} from "~/app/(platform)/dashboard/settings/account/actions";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CardDescription } from "./ui/card";

const initialUpdatePasswordState = {
  message: "",
};

const PasswordFormSchema = z.object({
  password: z.string(),
  new_password: z.string(),
});

export function UpdatePasswordForm() {
  const [state, action] = useActionState(
    updatePasswordAction,
    initialUpdatePasswordState,
  );

  const form = useForm<z.infer<typeof PasswordFormSchema>>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: {
      password: "",
      new_password: "",
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
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  type="password"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update</Button>
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

const initialUpdateFormState = {
  message: "",
};

const EmailFormSchema = z.object({
  email: z.string(),
});

export function UpdateEmailForm() {
  const [state, action] = useActionState(
    updateEmailAction,
    initialUpdateFormState,
  );

  const form = useForm<z.infer<typeof EmailFormSchema>>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email: "",
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
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New email</FormLabel>
              <FormControl>
                <Input
                  placeholder="steve@pelicans.dev"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update</Button>
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

const initialDisconnectTOTPState = {
  message: "",
};

export function DisconnectTOTPButton() {
  const [state, formAction] = useActionState(
    disconnectTOTPAction,
    initialDisconnectTOTPState,
  );
  return (
    <form action={formAction} className="space-y-4">
      <Button variant="destructive">Disconnect</Button>
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
  );
}

const initialPasskeyState = {
  message: "",
};

export function PasskeyCredentialListItem(props: {
  encodedId: string;
  name: string;
}) {
  const [state, formAction] = useActionState(
    deletePasskeyAction,
    initialPasskeyState,
  );
  return (
    <li className="flex justify-between align-middle">
      <p>{props.name}</p>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="credential_id" value={props.encodedId} />

        <Button variant="destructive" type="submit">
          Delete
        </Button>
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
    </li>
  );
}

const initialSecurityKeyState = {
  message: "",
};

export function SecurityKeyCredentialListItem(props: {
  encodedId: string;
  name: string;
}) {
  const [state, formAction] = useActionState(
    deleteSecurityKeyAction,
    initialSecurityKeyState,
  );
  return (
    <li className="flex justify-between align-middle">
      <p>{props.name}</p>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="credential_id" value={props.encodedId} />
        <Button variant="destructive" type="submit">
          Delete
        </Button>
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
    </li>
  );
}

export function RecoveryCodeSection(props: { recoveryCode: string }) {
  const [recoveryCode, setRecoveryCode] = useState(props.recoveryCode);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recovery code</CardTitle>
        <CardDescription>Your recovery code is: {recoveryCode}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={async () => {
            const result = await regenerateRecoveryCodeAction();
            if (result.recoveryCode !== null) {
              setRecoveryCode(result.recoveryCode);
            }
          }}
        >
          Generate new code
        </Button>
      </CardContent>
    </Card>
  );
}
