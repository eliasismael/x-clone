import Image from "next/image";
import { buildAvatarUrl, isVectorAvatarUrl } from "@/lib/avatar";

type AvatarProps = {
  user: { username: string; displayName: string; avatarUrl: string | null };
  size: number;
  className?: string;
};

export function Avatar({ user, size, className = "" }: AvatarProps) {
  const src = user.avatarUrl ?? buildAvatarUrl(user.username);

  return (
    <Image
      src={src}
      alt={`${user.displayName} avatar`}
      width={size}
      height={size}
      unoptimized={isVectorAvatarUrl(src)}
      className={`shrink-0 rounded-full bg-x-surface object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
