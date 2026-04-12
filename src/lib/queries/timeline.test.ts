import { describe, expect, it, vi, beforeEach } from "vitest";
import { getTimelinePage, TIMELINE_PAGE_SIZE } from "./timeline";

vi.mock("@/lib/db", () => ({
  db: {
    tweet: {
      findMany: vi.fn(),
    },
  },
}));

import { db } from "@/lib/db";

const mockFindMany = vi.mocked(db.tweet.findMany);

function makeTweet(overrides: Partial<{ id: string; createdAt: Date; updatedAt: Date; authorId: string }> = {}) {
  const now = new Date("2024-01-01T12:00:00Z");
  return {
    id: overrides.id ?? "tweet-1",
    content: "Hello world",
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
    authorId: overrides.authorId ?? "user-1",
    author: {
      id: overrides.authorId ?? "user-1",
      username: "user1",
      displayName: "User One",
      avatarUrl: null,
    },
    _count: { likes: 0 },
    likes: [],
  };
}

describe("getTimelinePage", () => {
  beforeEach(() => {
    mockFindMany.mockReset();
  });

  it("returns tweets and null nextCursor when fewer than page size", async () => {
    const tweets = [makeTweet({ id: "t1" }), makeTweet({ id: "t2" })];
    mockFindMany.mockResolvedValue(tweets);

    const result = await getTimelinePage("user-1");

    expect(result.tweets).toHaveLength(2);
    expect(result.nextCursor).toBeNull();
  });

  it("returns nextCursor when results exceed page size", async () => {
    const tweets = Array.from({ length: TIMELINE_PAGE_SIZE + 1 }, (_, i) =>
      makeTweet({ id: `t${i}`, createdAt: new Date(Date.now() - i * 1000) }),
    );
    mockFindMany.mockResolvedValue(tweets);

    const result = await getTimelinePage("user-1");

    expect(result.tweets).toHaveLength(TIMELINE_PAGE_SIZE);
    expect(result.nextCursor).not.toBeNull();
    expect(result.nextCursor?.id).toBe(tweets[TIMELINE_PAGE_SIZE - 1].id);
  });

  it("passes cursor filter when cursor is provided", async () => {
    mockFindMany.mockResolvedValue([]);
    const cursor = { createdAt: new Date("2024-01-01T00:00:00Z"), id: "cursor-id" };

    await getTimelinePage("user-1", cursor);

    const callArg = mockFindMany.mock.calls[0][0] as { where: unknown };
    expect(JSON.stringify(callArg.where)).toContain("cursor-id");
  });

  it("queries for own tweets and followed users tweets", async () => {
    mockFindMany.mockResolvedValue([]);

    await getTimelinePage("user-42");

    const callArg = mockFindMany.mock.calls[0][0] as { where: { OR: unknown[] } };
    const orClauses = JSON.stringify(callArg.where.OR);
    expect(orClauses).toContain("user-42");
    expect(orClauses).toContain("followers");
  });

  it("returns empty tweets and null cursor for empty result", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getTimelinePage("user-1");

    expect(result.tweets).toHaveLength(0);
    expect(result.nextCursor).toBeNull();
  });
});
