import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";
import { isBlobAvatarUrl, isLocalAvatarUrl } from "@/lib/avatar";

const localAvatarDir = () => path.join(process.cwd(), "public", "uploads", "avatars");

// Vercel's filesystem is read-only, so deployments keep avatars in Vercel Blob.
// Without a Blob token (local dev, Docker) they are written to public/uploads.
export function usesBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// Stores the file and returns the URL to save as the user's avatarUrl
export async function storeAvatar(fileName: string, file: File): Promise<string> {
  if (usesBlobStorage()) {
    const blob = await put(`avatars/${fileName}`, file, {
      access: "public",
      contentType: file.type,
    });
    return blob.url;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await mkdir(localAvatarDir(), { recursive: true });
  await writeFile(path.join(localAvatarDir(), fileName), buffer);
  return `/uploads/avatars/${fileName}`;
}

// Best-effort cleanup of a replaced avatar; generated (DiceBear) avatars are left alone
export async function deleteStoredAvatar(url: string): Promise<void> {
  if (isLocalAvatarUrl(url)) {
    await unlink(path.join(process.cwd(), "public", url.replace(/^\//, ""))).catch(() => undefined);
  } else if (isBlobAvatarUrl(url) && usesBlobStorage()) {
    await del(url).catch(() => undefined);
  }
}
