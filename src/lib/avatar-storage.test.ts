import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@vercel/blob", () => ({
  put: vi.fn(),
  del: vi.fn(),
}));

vi.mock("node:fs/promises", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs/promises")>();
  const mocked = { mkdir: vi.fn(), writeFile: vi.fn(), unlink: vi.fn() };
  return { ...actual, ...mocked, default: { ...actual, ...mocked } };
});

import { del, put } from "@vercel/blob";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { deleteStoredAvatar, storeAvatar, usesBlobStorage } from "@/lib/avatar-storage";

const mockPut = vi.mocked(put);
const mockDel = vi.mocked(del);
const mockWriteFile = vi.mocked(writeFile);
const mockUnlink = vi.mocked(unlink);

const blobUrl = "https://abc123.public.blob.vercel-storage.com/avatars/u1-1.png";
const file = new File(["png-bytes"], "avatar.png", { type: "image/png" });

beforeEach(() => {
  vi.clearAllMocks();
  mockUnlink.mockResolvedValue(undefined);
  mockDel.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("with a Vercel Blob token", () => {
  beforeEach(() => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "vercel_blob_rw_test");
  });

  it("reports Blob storage as enabled", () => {
    expect(usesBlobStorage()).toBe(true);
  });

  it("uploads the avatar publicly and returns the Blob URL", async () => {
    mockPut.mockResolvedValue({ url: blobUrl } as Awaited<ReturnType<typeof put>>);

    await expect(storeAvatar("u1-1.png", file)).resolves.toBe(blobUrl);
    expect(mockPut).toHaveBeenCalledWith("avatars/u1-1.png", file, {
      access: "public",
      contentType: "image/png",
    });
    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it("propagates upload failures so the action can report them", async () => {
    mockPut.mockRejectedValue(new Error("network"));
    await expect(storeAvatar("u1-1.png", file)).rejects.toThrow("network");
  });

  it("deletes a replaced Blob avatar", async () => {
    await deleteStoredAvatar(blobUrl);
    expect(mockDel).toHaveBeenCalledWith(blobUrl);
  });

  it("ignores Blob deletion errors", async () => {
    mockDel.mockRejectedValue(new Error("gone"));
    await expect(deleteStoredAvatar(blobUrl)).resolves.toBeUndefined();
  });
});

describe("without a Vercel Blob token", () => {
  beforeEach(() => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "");
  });

  it("reports Blob storage as disabled", () => {
    expect(usesBlobStorage()).toBe(false);
  });

  it("writes the avatar to public/uploads/avatars", async () => {
    await expect(storeAvatar("u1-1.png", file)).resolves.toBe("/uploads/avatars/u1-1.png");

    expect(vi.mocked(mkdir).mock.calls[0][0]).toMatch(/public[\\/]uploads[\\/]avatars$/);
    const [writtenPath, buffer] = mockWriteFile.mock.calls[0];
    expect(String(writtenPath)).toMatch(/public[\\/]uploads[\\/]avatars[\\/]u1-1\.png$/);
    expect(buffer).toEqual(Buffer.from("png-bytes"));
    expect(mockPut).not.toHaveBeenCalled();
  });

  it("deletes a replaced local avatar", async () => {
    await deleteStoredAvatar("/uploads/avatars/u1-1.png");
    expect(String(mockUnlink.mock.calls[0][0])).toMatch(/public[\\/]uploads[\\/]avatars[\\/]u1-1\.png$/);
  });

  it("does not try to delete Blob avatars without a token", async () => {
    await deleteStoredAvatar(blobUrl);
    expect(mockDel).not.toHaveBeenCalled();
  });
});

it("never deletes generated DiceBear avatars", async () => {
  vi.stubEnv("BLOB_READ_WRITE_TOKEN", "vercel_blob_rw_test");
  await deleteStoredAvatar("https://api.dicebear.com/9.x/initials/svg?seed=jane");

  expect(mockDel).not.toHaveBeenCalled();
  expect(mockUnlink).not.toHaveBeenCalled();
});
