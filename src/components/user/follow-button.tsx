"use client";

import { useState, useTransition } from "react";
import { toggleFollowAction } from "@/app/(app)/actions";

type FollowButtonProps = {
  targetUserId: string;
  isFollowing: boolean;
};

export function FollowButton({ targetUserId, isFollowing: initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
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

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed ${
        isFollowing
          ? "border-slate-300 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
          : "border-slate-950 bg-slate-950 text-white hover:bg-slate-800"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
