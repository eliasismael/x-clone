import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    like: {
      findUnique: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
    },
    tweet: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/session", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { toggleLikeAction, createTweetAction, deleteTweetAction } from "./actions";

const mockGetCurrentUser = vi.mocked(getCurrentUser);
const mockLikeFindUnique = vi.mocked(db.like.findUnique);
const mockLikeDelete = vi.mocked(db.like.delete);
const mockLikeCreate = vi.mocked(db.like.create);
const mockTweetFindUnique = vi.mocked(db.tweet.findUnique);
const mockTweetCreate = vi.mocked(db.tweet.create);
const mockTweetDelete = vi.mocked(db.tweet.delete);

const fakeUser = { id: "user-1", username: "alice", displayName: "Alice", avatarUrl: null };

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── toggleLikeAction ────────────────────────────────────────────────────────

describe("toggleLikeAction", () => {
  it("creates a like when the user has not liked the tweet", async () => {
    mockGetCurrentUser.mockResolvedValue(fakeUser as never);
    mockLikeFindUnique.mockResolvedValue(null);
    mockLikeCreate.mockResolvedValue({} as never);

    await toggleLikeAction("tweet-1");

    expect(mockLikeCreate).toHaveBeenCalledWith({
      data: { userId: "user-1", tweetId: "tweet-1" },
    });
    expect(mockLikeDelete).not.toHaveBeenCalled();
  });

  it("deletes the like when the user has already liked the tweet", async () => {
    mockGetCurrentUser.mockResolvedValue(fakeUser as never);
    mockLikeFindUnique.mockResolvedValue({ userId: "user-1" } as never);
    mockLikeDelete.mockResolvedValue({} as never);

    await toggleLikeAction("tweet-1");

    expect(mockLikeDelete).toHaveBeenCalled();
    expect(mockLikeCreate).not.toHaveBeenCalled();
  });
});

// ─── createTweetAction ───────────────────────────────────────────────────────

describe("createTweetAction", () => {
  it("returns a field error for empty content", async () => {
    mockGetCurrentUser.mockResolvedValue(fakeUser as never);

    const formData = new FormData();
    formData.set("content", "");

    const result = await createTweetAction(null, formData);

    expect(result).toMatchObject({ ok: false, fieldErrors: { content: expect.any(String) } });
    expect(mockTweetCreate).not.toHaveBeenCalled();
  });

  it("returns a field error when content exceeds 280 characters", async () => {
    mockGetCurrentUser.mockResolvedValue(fakeUser as never);

    const formData = new FormData();
    formData.set("content", "a".repeat(281));

    const result = await createTweetAction(null, formData);

    expect(result).toMatchObject({ ok: false, fieldErrors: { content: expect.any(String) } });
  });

  it("creates the tweet and returns ok on valid input", async () => {
    mockGetCurrentUser.mockResolvedValue(fakeUser as never);
    mockTweetCreate.mockResolvedValue({} as never);

    const formData = new FormData();
    formData.set("content", "Hello world!");

    const result = await createTweetAction(null, formData);

    expect(mockTweetCreate).toHaveBeenCalledWith({
      data: { content: "Hello world!", authorId: "user-1" },
    });
    expect(result).toEqual({ ok: true });
  });
});

// ─── deleteTweetAction ───────────────────────────────────────────────────────

describe("deleteTweetAction", () => {
  it("deletes the tweet when the user is the author", async () => {
    mockGetCurrentUser.mockResolvedValue(fakeUser as never);
    mockTweetFindUnique.mockResolvedValue({ authorId: "user-1" } as never);
    mockTweetDelete.mockResolvedValue({} as never);

    await deleteTweetAction("tweet-1");

    expect(mockTweetDelete).toHaveBeenCalledWith({ where: { id: "tweet-1" } });
  });

  it("does not delete when the user is not the author", async () => {
    mockGetCurrentUser.mockResolvedValue(fakeUser as never);
    mockTweetFindUnique.mockResolvedValue({ authorId: "other-user" } as never);

    await deleteTweetAction("tweet-1");

    expect(mockTweetDelete).not.toHaveBeenCalled();
  });

  it("does not delete when tweet does not exist", async () => {
    mockGetCurrentUser.mockResolvedValue(fakeUser as never);
    mockTweetFindUnique.mockResolvedValue(null);

    await deleteTweetAction("tweet-1");

    expect(mockTweetDelete).not.toHaveBeenCalled();
  });
});
