import { describe, expect, it } from "vitest";
import { buildAvatarUrl, isLocalAvatarUrl, isVectorAvatarUrl } from "@/lib/avatar";

describe("buildAvatarUrl", () => {
  it("encodes the seed into a DiceBear initials URL", () => {
    expect(buildAvatarUrl("jane doe")).toBe(
      "https://api.dicebear.com/9.x/initials/svg?seed=jane%20doe",
    );
  });
});

describe("isLocalAvatarUrl", () => {
  it("detects uploaded avatars", () => {
    expect(isLocalAvatarUrl("/uploads/avatars/u1.png")).toBe(true);
  });

  it("rejects remote and empty values", () => {
    expect(isLocalAvatarUrl(buildAvatarUrl("jane"))).toBe(false);
    expect(isLocalAvatarUrl(null)).toBe(false);
  });
});

describe("isVectorAvatarUrl", () => {
  it("treats generated DiceBear avatars as vector images", () => {
    expect(isVectorAvatarUrl(buildAvatarUrl("jane"))).toBe(true);
  });

  it("treats .svg files as vector images", () => {
    expect(isVectorAvatarUrl("/uploads/avatars/u1.svg")).toBe(true);
  });

  it("keeps raster uploads optimizable", () => {
    expect(isVectorAvatarUrl("/uploads/avatars/u1.webp")).toBe(false);
  });
});
