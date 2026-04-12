import { formatCount, formatRelativeTime } from "@/lib/utils";
import { describe, expect, it } from "vitest";

describe("formatCount", () => {
  it("keeps small numbers unchanged", () => {
    expect(formatCount(999)).toBe("999");
  });

  it("formats large numbers compactly", () => {
    expect(formatCount(1200)).toBe("1.2K");
  });
});

describe("formatRelativeTime", () => {
  function ago(seconds: number) {
    return new Date(Date.now() - seconds * 1000);
  }

  it("returns seconds for times less than a minute ago", () => {
    expect(formatRelativeTime(ago(30))).toBe("30s");
  });

  it("returns minutes for times between 1 and 60 minutes ago", () => {
    expect(formatRelativeTime(ago(90))).toBe("1m");
    expect(formatRelativeTime(ago(3599))).toBe("59m");
  });

  it("returns hours for times between 1 and 24 hours ago", () => {
    expect(formatRelativeTime(ago(3600))).toBe("1h");
    expect(formatRelativeTime(ago(86399))).toBe("23h");
  });

  it("returns days for times between 1 and 7 days ago", () => {
    expect(formatRelativeTime(ago(86400))).toBe("1d");
    expect(formatRelativeTime(ago(604799))).toBe("6d");
  });

  it("returns a formatted date for times older than 7 days", () => {
    const result = formatRelativeTime(ago(604800));
    // Should contain a month abbreviation (e.g. "Jan", "Feb", etc.)
    expect(result).toMatch(/[A-Z][a-z]{2}/);
  });

  it("accepts a string date", () => {
    const result = formatRelativeTime(ago(45).toISOString());
    expect(result).toBe("45s");
  });
});
