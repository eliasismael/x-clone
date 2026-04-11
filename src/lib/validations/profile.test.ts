import { describe, expect, it } from "vitest";
import { editProfileSchema } from "@/lib/validations/auth";

describe("editProfileSchema", () => {
  it("normalizes username and empty bio", () => {
    const result = editProfileSchema.parse({
      displayName: "Elias Pereyra",
      username: "Elias_User",
      bio: "",
    });

    expect(result.username).toBe("elias_user");
    expect(result.bio).toBeNull();
  });

  it("rejects invalid usernames", () => {
    const result = editProfileSchema.safeParse({
      displayName: "Elias Pereyra",
      username: "elias-user",
      bio: "hello",
    });

    expect(result.success).toBe(false);
  });
});
