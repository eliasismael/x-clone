"use server";

import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { createUserSession } from "@/lib/session";
import { loginSchema } from "@/lib/validations/auth";

export type LoginActionState = {
  fieldErrors?: Partial<Record<"email" | "password", string>>;
  formError?: string;
};

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;

    return {
      fieldErrors: {
        email: flattened.email?.[0],
        password: flattened.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      formError: "We could not find an account with those credentials.",
    };
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);

  if (!passwordMatches) {
    return {
      formError: "We could not find an account with those credentials.",
    };
  }

  await createUserSession(user.id);

  redirect("/home");
}
