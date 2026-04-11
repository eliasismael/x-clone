import { formatCount } from "@/lib/utils";
import { describe, expect, it } from "vitest";

describe("formatCount", () => {
  it("keeps small numbers unchanged", () => {
    expect(formatCount(999)).toBe("999");
  });

  it("formats large numbers compactly", () => {
    expect(formatCount(1200)).toBe("1.2K");
  });
});
