import { describe, expect, it, vi, beforeEach } from "vitest";

// Hoist cookie mock fns so they're available inside the vi.mock factory
const { mockGet, mockSet, mockDelete } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockSet: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    get: mockGet,
    set: mockSet,
    delete: mockDelete,
  }),
}));

// Mock react cache — return the function as-is so getCurrentUser is directly callable
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock("@/lib/db", () => ({
  db: {
    session: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  generateSessionToken: vi.fn().mockReturnValue("raw-token"),
  hashSessionToken: vi.fn((t: string) => `hashed-${t}`),
}));

import { db } from "@/lib/db";
import { createUserSession, clearUserSession, getCurrentUser } from "@/lib/session";

const mockSessionCreate = vi.mocked(db.session.create);
const mockSessionFindUnique = vi.mocked(db.session.findUnique);
const mockSessionDelete = vi.mocked(db.session.delete);
const mockSessionDeleteMany = vi.mocked(db.session.deleteMany);

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── createUserSession ────────────────────────────────────────────────────────

describe("createUserSession", () => {
  it("creates a session record in the database", async () => {
    mockSessionCreate.mockResolvedValue({} as never);

    await createUserSession("user-1");

    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId: "user-1" }),
      }),
    );
  });

  it("sets the session cookie", async () => {
    mockSessionCreate.mockResolvedValue({} as never);

    await createUserSession("user-1");

    expect(mockSet).toHaveBeenCalledWith(
      "x-clone-session",
      "raw-token",
      expect.objectContaining({ httpOnly: true }),
    );
  });
});

// ─── clearUserSession ─────────────────────────────────────────────────────────

describe("clearUserSession", () => {
  it("deletes the session from the database when cookie is present", async () => {
    mockGet.mockReturnValue({ value: "raw-token" });
    mockSessionDeleteMany.mockResolvedValue({} as never);

    await clearUserSession();

    expect(mockSessionDeleteMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { token: "hashed-raw-token" },
      }),
    );
    expect(mockDelete).toHaveBeenCalledWith("x-clone-session");
  });

  it("only deletes the cookie when no session cookie is present", async () => {
    mockGet.mockReturnValue(undefined);

    await clearUserSession();

    expect(mockSessionDeleteMany).not.toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith("x-clone-session");
  });
});

// ─── getCurrentUser ───────────────────────────────────────────────────────────

describe("getCurrentUser", () => {
  it("returns null when no session cookie is present", async () => {
    mockGet.mockReturnValue(undefined);

    const result = await getCurrentUser();

    expect(result).toBeNull();
    expect(mockSessionFindUnique).not.toHaveBeenCalled();
  });

  it("returns null when session is not found in the database", async () => {
    mockGet.mockReturnValue({ value: "raw-token" });
    mockSessionFindUnique.mockResolvedValue(null);

    const result = await getCurrentUser();

    expect(result).toBeNull();
  });

  it("returns null and cleans up when session is expired", async () => {
    mockGet.mockReturnValue({ value: "raw-token" });
    mockSessionFindUnique.mockResolvedValue({
      token: "hashed-raw-token",
      expiresAt: new Date(Date.now() - 1000),
      user: { id: "user-1" },
    } as never);
    mockSessionDelete.mockResolvedValue({} as never);

    const result = await getCurrentUser();

    expect(result).toBeNull();
    expect(mockSessionDelete).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith("x-clone-session");
  });

  it("returns the user when session is valid and not expired", async () => {
    const fakeUser = { id: "user-1", username: "alice" };
    mockGet.mockReturnValue({ value: "raw-token" });
    mockSessionFindUnique.mockResolvedValue({
      token: "hashed-raw-token",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      user: fakeUser,
    } as never);

    const result = await getCurrentUser();

    expect(result).toEqual(fakeUser);
  });
});