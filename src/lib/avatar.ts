const DEFAULT_AVATAR_HOST = "https://api.dicebear.com/";

export function buildAvatarUrl(seed: string) {
  return `${DEFAULT_AVATAR_HOST}9.x/initials/svg?seed=${encodeURIComponent(seed)}`;
}

export function isLocalAvatarUrl(value: string | null | undefined) {
  return Boolean(value?.startsWith("/uploads/avatars/"));
}

export const BLOB_AVATAR_HOST_SUFFIX = ".public.blob.vercel-storage.com";

export function isBlobAvatarUrl(value: string | null | undefined) {
  if (!value?.startsWith("https://")) return false;
  return new URL(value).hostname.endsWith(BLOB_AVATAR_HOST_SUFFIX);
}

// The Next.js image optimizer rejects SVG responses, so generated avatars
// (DiceBear serves SVG without a .svg extension) must bypass it.
export function isVectorAvatarUrl(value: string) {
  return value.startsWith(DEFAULT_AVATAR_HOST) || new URL(value, "http://local").pathname.endsWith(".svg");
}
