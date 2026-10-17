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
      // Transparent text hides the alt label if the image fails to load
      className={`shrink-0 overflow-hidden rounded-full bg-x-surface object-cover text-transparent ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
