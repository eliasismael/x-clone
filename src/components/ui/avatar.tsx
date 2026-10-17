"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { buildAvatarUrl, isVectorAvatarUrl } from "@/lib/avatar";

type AvatarProps = {
  user: { username: string; displayName: string; avatarUrl: string | null };
  size: number;
  // Fill the parent's width instead of rendering at a fixed size
  fluid?: boolean;
  className?: string;
};

export function Avatar({ user, size, fluid = false, className = "" }: AvatarProps) {
  const src = user.avatarUrl ?? buildAvatarUrl(user.username);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const style = fluid ? { width: "100%", height: "auto" } : { width: size, height: size };
  const shapeClass = `aspect-square shrink-0 overflow-hidden rounded-full ${className}`;

  // The image can fail before hydration, when onError is not attached yet
  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailedSrc(src);
    }
  }, [src]);

  if (failedSrc === src) {
    return (
      <span
        role="img"
        aria-label={`${user.displayName} avatar`}
        className={`flex items-center justify-center bg-x-banner font-bold text-x-muted uppercase ${shapeClass}`}
        style={{ ...style, fontSize: size * 0.4 }}
      >
        {user.displayName.trim().charAt(0) || user.username.charAt(0)}
      </span>
    );
  }

  return (
    <Image
      ref={imageRef}
      src={src}
      alt={`${user.displayName} avatar`}
      width={size}
      height={size}
      unoptimized={isVectorAvatarUrl(src)}
      onError={() => setFailedSrc(src)}
      className={`bg-x-surface object-cover ${shapeClass}`}
      style={style}
    />
  );
}
