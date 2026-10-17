"use client";

import { useState, useTransition } from "react";
import { toggleFollowAction } from "@/app/(app)/actions";

type FollowButtonProps = {
  targetUserId: string;
  isFollowing: boolean;
};

// Optimistic follow state shared by the follow button and the tweet menu
export function useFollowToggle(targetUserId: string, initialIsFollowing: boolean) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !isFollowing;
    setIsFollowing(next);
    startTransition(async () => {
      try {
        await toggleFollowAction(targetUserId);
      } catch {
        setIsFollowing(!next);
      }
    });
  }

  return { isFollowing, isPending, toggle };
}

export function FollowButton({ targetUserId, isFollowing: initialIsFollowing }: FollowButtonProps) {
  const { isFollowing, isPending, toggle } = useFollowToggle(targetUserId, initialIsFollowing);
  // Like X, "Following" turns into a red "Unfollow" only while hovered
  const [isHovered, setIsHovered] = useState(false);

  function handleClick() {
    setIsHovered(false);
    toggle();
  }

  const showUnfollow = isFollowing && isHovered;

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isPending}
      className={`h-8 shrink-0 rounded-full border px-4 text-[14px] font-bold transition-colors ${
        isFollowing
          ? `min-w-[104px] ${
              showUnfollow
                ? "border-x-red/40 bg-x-red/10 text-x-red"
                : "border-x-banner bg-transparent text-x-text"
            }`
          : "border-transparent bg-x-inverse-bg text-x-inverse-text hover:opacity-90"
      }`}
    >
      {isFollowing ? (showUnfollow ? "Unfollow" : "Following") : "Follow"}
    </button>
  );
}
