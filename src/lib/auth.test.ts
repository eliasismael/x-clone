import { describe, expect, it } from "vitest";
import { generateSessionToken, hashPassword, hashSessionToken, verifyPassword } from "@/lib/auth";

describe("auth helpers", () => {
  it("hashes and verifies passwords", async () => {
    const password = "Password123!";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    await expect(verifyPassword(password, hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong-password", hash)).resolves.toBe(false);
  });

  it("generates stable session token hashes", () => {
    const token = generateSessionToken();

    expect(token).toHaveLength(64);
    expect(hashSessionToken(token)).toHaveLength(64);
    expect(hashSessionToken(token)).toBe(hashSessionToken(token));
  });
});
