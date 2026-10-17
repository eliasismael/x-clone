"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AuthFormError, AuthSubmitButton } from "@/components/auth/auth-card";
import { TextField } from "@/components/ui/text-field";
import { registerAction, type RegisterActionState } from "./actions";

const initialState: RegisterActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return <AuthSubmitButton pending={pending} label="Create account" pendingLabel="Creating account..." />;
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      <TextField
        label="Display name"
        name="displayName"
        autoComplete="name"
        error={state.fieldErrors?.displayName}
      />
      <TextField
        label="Username"
        name="username"
        autoComplete="username"
        error={state.fieldErrors?.username}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        error={state.fieldErrors?.email}
      />
      <TextField
        label="Bio"
        name="bio"
        placeholder="Tell people a little about yourself"
        error={state.fieldErrors?.bio}
        multiline
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        error={state.fieldErrors?.password}
      />
      <TextField
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.confirmPassword}
      />

      <AuthFormError message={state.formError} />

      <SubmitButton />

      <p className="mt-5 text-[15px] text-x-muted">
        Have an account already?{" "}
        <Link href="/login" className="text-x-blue hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
