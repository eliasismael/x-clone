export function buildAvatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}`;
}

export function isLocalAvatarUrl(value: string | null | undefined) {
  return Boolean(value?.startsWith("/uploads/avatars/"));
}
