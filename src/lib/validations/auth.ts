import { z } from "zod";

export const registerSchema = z
  .object({
    displayName: z.string().trim().min(2, "Display name must be at least 2 characters.").max(50),
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .max(24)
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores.",
      )
      .transform((value) => value.toLowerCase()),
    email: z.email("Enter a valid email address.").transform((value) => value.trim().toLowerCase()),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(72, "Password must be at most 72 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type RegisterInput = z.infer<typeof registerSchema>;
