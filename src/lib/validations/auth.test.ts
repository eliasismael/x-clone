import { describe, expect, it } from "vitest";
import { registerSchema } from "@/lib/validations/auth";

describe("registerSchema", () => {
  it("normalizes username and email", () => {
    const result = registerSchema.parse({
      displayName: "Jane Doe",
      username: "Jane_Doe",
      email: "Jane@Example.com",
      bio: "Building things on the internet.",
      password: "Password123!",
      confirmPassword: "Password123!",
    });

    expect(result.username).toBe("jane_doe");
    expect(result.email).toBe("jane@example.com");
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      displayName: "Jane Doe",
      username: "jane_doe",
      email: "jane@example.com",
      bio: "",
      password: "Password123!",
      confirmPassword: "Password123",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword).toContain("Passwords do not match.");
    }
  });

  it("normalizes an empty bio to null", () => {
    const result = registerSchema.parse({
      displayName: "Jane Doe",
      username: "Jane_Doe",
      email: "Jane@Example.com",
      bio: "",
      password: "Password123!",
      confirmPassword: "Password123!",
    });

    expect(result.bio).toBeNull();
  });
});
