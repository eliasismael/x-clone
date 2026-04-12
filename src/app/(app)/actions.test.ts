import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    follow: {
      findUnique: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/session", () => ({
  getCurrentUser: vi.fn(),
  clearUserSession: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { toggleFollowAction } from "./actions";

const mockGetCurrentUser = vi.mocked(getCurrentUser);
const mockFollowFindUnique = vi.mocked(db.follow.findUnique);
const mockFollowDelete = vi.mocked(db.follow.delete);
const mockFollowCreate = vi.mocked(db.follow.create);

const fakeUser = { id: "user-1", username: "alice", displayName: "Alice", avatarUrl: null };

beforeEach(() => vi.clearAllMocks());

describe("toggleFollowAction", () => {
  it("creates a follow when not already following", async () => {
    mockGetCurrentUser.mockResolvedValue(fakeUser as never);
    mockFollowFindUnique.mockResolvedValue(null);
    mockFollowCreate.mockResolvedValue({} as never);

    await toggleFollowAction("user-2");

    expect(mockFollowCreate).toHaveBeenCalledWith({
      data: { followerId: "user-1", followingId: "user-2" },
    });
    expect(mockFollowDelete).not.toHaveBeenCalled();
  });

  it("deletes the follow when already following", async () => {
    mockGetCurrentUser.mockResolvedValue(fakeUser as never);
    mockFollowFindUnique.mockResolvedValue({ followerId: "user-1" } as never);
    mockFollowDelete.mockResolvedValue({} as never);

    await toggleFollowAction("user-2");

    expect(mockFollowDelete).toHaveBeenCalled();
    expect(mockFollowCreate).not.toHaveBeenCalled();
  });

  it("does nothing when targetUserId equals currentUser id", async () => {
    mockGetCurrentUser.mockResolvedValue(fakeUser as never);

    await toggleFollowAction("user-1");

    expect(mockFollowFindUnique).not.toHaveBeenCalled();
    expect(mockFollowCreate).not.toHaveBeenCalled();
  });
});
