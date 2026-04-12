import { describe, expect, it } from "vitest";
import { tweetSchema } from "./tweet";

describe("tweetSchema", () => {
  it("accepts valid content", () => {
    const result = tweetSchema.safeParse({ content: "Hello world!" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.content).toBe("Hello world!");
    }
  });

  it("trims whitespace", () => {
    const result = tweetSchema.safeParse({ content: "  hello  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.content).toBe("hello");
    }
  });

  it("rejects empty string", () => {
    const result = tweetSchema.safeParse({ content: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.content?.[0]).toBe("Tweet cannot be empty.");
    }
  });

  it("rejects whitespace-only string", () => {
    const result = tweetSchema.safeParse({ content: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.content?.[0]).toBe("Tweet cannot be empty.");
    }
  });

  it("rejects content over 280 characters", () => {
    const result = tweetSchema.safeParse({ content: "a".repeat(281) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.content?.[0]).toBe(
        "Tweet must be at most 280 characters.",
      );
    }
  });

  it("accepts content at exactly 280 characters", () => {
    const result = tweetSchema.safeParse({ content: "a".repeat(280) });
    expect(result.success).toBe(true);
  });
});
