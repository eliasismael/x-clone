"use client";

import { useOptimistic, useTransition } from "react";
import { toggleLikeAction } from "@/app/(app)/home/actions";
import { formatCount } from "@/lib/utils";

type LikeButtonProps = {
  tweetId: string;
  likeCount: number;
  isLiked: boolean;
};

export function LikeButton({ tweetId, likeCount, isLiked }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticState, setOptimistic] = useOptimistic(
    { likeCount, isLiked },
    (current, _action: "toggle") => ({
      likeCount: current.isLiked ? current.likeCount - 1 : current.likeCount + 1,
      isLiked: !current.isLiked,
    }),
  );

  function handleClick() {
    startTransition(async () => {
      setOptimistic("toggle");
      await toggleLikeAction(tweetId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={optimisticState.isLiked ? "Unlike" : "Like"}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
        optimisticState.isLiked
          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={optimisticState.isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className="size-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
      {formatCount(optimisticState.likeCount)}
    </button>
  );
}
