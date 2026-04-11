"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerAction, type RegisterActionState } from "./actions";

const initialState: RegisterActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {pending ? "Creating account..." : "Create account"}
    </button>
  );
}

type FieldProps = {
  label: string;
  name: "displayName" | "username" | "email" | "bio" | "password" | "confirmPassword";
  type?: string;
  placeholder: string;
  error?: string;
  multiline?: boolean;
};

function Field({ label, name, type = "text", placeholder, error, multiline = false }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {multiline ? (
        <textarea
          name={name}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          rows={4}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />
      )}
      {error ? (
        <span id={`${name}-error`} className="text-sm font-normal text-rose-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <Field
        label="Display name"
        name="displayName"
        placeholder="Jane Doe"
        error={state.fieldErrors?.displayName}
      />
      <Field
        label="Username"
        name="username"
        placeholder="jane_doe"
        error={state.fieldErrors?.username}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        placeholder="jane@example.com"
        error={state.fieldErrors?.email}
      />
      <Field
        label="Bio"
        name="bio"
        placeholder="Tell people a little about yourself"
        error={state.fieldErrors?.bio}
        multiline
      />
      <Field
        label="Password"
        name="password"
        type="password"
        placeholder="At least 8 characters"
        error={state.fieldErrors?.password}
      />
      <Field
        label="Confirm password"
        name="confirmPassword"
        type="password"
        placeholder="Repeat your password"
        error={state.fieldErrors?.confirmPassword}
      />

      {state.formError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.formError}
        </div>
      ) : null}

      <SubmitButton />

      <p className="text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-slate-900 underline decoration-slate-300">
          Sign in
        </Link>
      </p>
    </form>
  );
}
