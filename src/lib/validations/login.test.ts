import { describe, expect, it } from "vitest";
import { loginSchema } from "@/lib/validations/auth";

describe("loginSchema", () => {
  it("normalizes email", () => {
    const result = loginSchema.parse({
      email: "Jane@Example.com",
      password: "Password123!",
    });

    expect(result.email).toBe("jane@example.com");
  });

  it("rejects passwords that are too short", () => {
    const result = loginSchema.safeParse({
      email: "jane@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);
  });
});
