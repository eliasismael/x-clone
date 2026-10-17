"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AuthFormError, AuthSubmitButton } from "@/components/auth/auth-card";
import { TextField } from "@/components/ui/text-field";
import { loginAction, type LoginActionState } from "./actions";

const initialState: LoginActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return <AuthSubmitButton pending={pending} label="Sign in" pendingLabel="Signing in..." />;
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        error={state.fieldErrors?.email}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        error={state.fieldErrors?.password}
      />

      <AuthFormError message={state.formError} />

      <SubmitButton />

      <p className="mt-5 text-[15px] text-x-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-x-blue hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
