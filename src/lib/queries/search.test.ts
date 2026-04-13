import { describe, expect, it, vi, beforeEach } from "vitest";
import { searchUsers } from "./search";

vi.mock("@/lib/db", () => ({
  db: {
    user: {
      findMany: vi.fn(),
    },
  },
}));

import { db } from "@/lib/db";

const mockFindMany = vi.mocked(db.user.findMany);

function makeUser(overrides: Partial<{ id: string; username: string; displayName: string }> = {}) {
  return {
    id: overrides.id ?? "user-1",
    username: overrides.username ?? "alice",
    displayName: overrides.displayName ?? "Alice",
    avatarUrl: null,
    followers: [],
  };
}

beforeEach(() => {
  mockFindMany.mockReset();
});

describe("searchUsers", () => {
  it("returns empty array for empty query without hitting the database", async () => {
    const result = await searchUsers("", "current-user");

    expect(result).toEqual([]);
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  it("returns empty array for whitespace-only query", async () => {
    const result = await searchUsers("   ", "current-user");

    expect(result).toEqual([]);
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  it("calls findMany with trimmed query and excludes currentUser", async () => {
    mockFindMany.mockResolvedValue([]);

    await searchUsers("  alice  ", "current-user");

    const call = mockFindMany.mock.calls[0][0] as {
      where: { AND: [{ id: { not: string } }, unknown] };
    };
    expect(call.where.AND[0].id.not).toBe("current-user");
    expect(JSON.stringify(call.where)).toContain("alice");
  });

  it("returns matched users from the database", async () => {
    const users = [makeUser({ id: "u1", username: "alice" })];
    mockFindMany.mockResolvedValue(users as never);

    const result = await searchUsers("alice", "current-user");

    expect(result).toHaveLength(1);
    expect(result[0].username).toBe("alice");
  });

  it("uses case-insensitive mode in the query", async () => {
    mockFindMany.mockResolvedValue([]);

    await searchUsers("Alice", "current-user");

    const call = mockFindMany.mock.calls[0][0] as { where: unknown };
    expect(JSON.stringify(call.where)).toContain("insensitive");
  });

  it("includes followers filter scoped to currentUserId", async () => {
    mockFindMany.mockResolvedValue([]);

    await searchUsers("alice", "current-user");

    const call = mockFindMany.mock.calls[0][0] as { select: { followers: { where: { followerId: string } } } };
    expect(call.select.followers.where.followerId).toBe("current-user");
  });
});