import { describe, expect, it } from "vitest";
import { buildNavItems, isNavItemActive } from "@/lib/navigation";

const [home, explore, profile] = buildNavItems("jane");

describe("buildNavItems", () => {
  it("returns Home, Explore and Profile in X order", () => {
    expect(buildNavItems("jane").map((item) => item.label)).toEqual(["Home", "Explore", "Profile"]);
  });
});

describe("isNavItemActive", () => {
  it("matches the exact path", () => {
    expect(isNavItemActive("/home", home)).toBe(true);
    expect(isNavItemActive("/search", explore)).toBe(true);
  });

  it("matches nested paths", () => {
    expect(isNavItemActive("/home/status/1", home)).toBe(true);
  });

  it("does not match paths that only share a prefix", () => {
    expect(isNavItemActive("/homepage", home)).toBe(false);
  });

  it("highlights Profile on the user's own public profile", () => {
    expect(isNavItemActive("/users/jane", profile)).toBe(true);
  });

  it("does not highlight Profile on someone else's profile", () => {
    expect(isNavItemActive("/users/bob", profile)).toBe(false);
  });
});
