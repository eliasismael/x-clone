"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { createUserSession } from "@/lib/session";
import { registerSchema } from "@/lib/validations/auth";

export type RegisterActionState = {
  fieldErrors?: Partial<Record<"displayName" | "username" | "email" | "password" | "confirmPassword", string>>;
  formError?: string;
};

export async function registerAction(
  _previousState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const parsed = registerSchema.safeParse({
    displayName: formData.get("displayName"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;

    return {
      fieldErrors: {
        displayName: flattened.displayName?.[0],
        username: flattened.username?.[0],
        email: flattened.email?.[0],
        password: flattened.password?.[0],
        confirmPassword: flattened.confirmPassword?.[0],
      },
    };
  }

  const { password, ...valuesWithConfirmation } = parsed.data;
  const { confirmPassword, ...values } = valuesWithConfirmation;
  void confirmPassword;

  try {
    const user = await db.user.create({
      data: {
        ...values,
        passwordHash: await hashPassword(password),
      },
    });

    await createUserSession(user.id);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      Array.isArray(error.meta?.target)
    ) {
      const fieldErrors: RegisterActionState["fieldErrors"] = {};

      if (error.meta.target.includes("email")) {
        fieldErrors.email = "That email is already in use.";
      }

      if (error.meta.target.includes("username")) {
        fieldErrors.username = "That username is already taken.";
      }

      return { fieldErrors };
    }

    return {
      formError: "We could not create your account right now. Please try again.",
    };
  }

  redirect("/home");
}
