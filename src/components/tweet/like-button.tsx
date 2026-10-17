"use client";

import { useOptimistic, useTransition } from "react";
import { toggleLikeAction } from "@/app/(app)/home/actions";
import { HeartIcon } from "@/components/ui/icons";
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
    (current) => ({
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
      aria-pressed={optimisticState.isLiked}
      className={`group -ml-2 flex items-center text-[13px] transition-colors hover:text-x-pink ${
        optimisticState.isLiked ? "text-x-pink" : "text-x-muted"
      }`}
    >
      <span className="flex size-[34px] items-center justify-center rounded-full transition-colors group-hover:bg-x-pink/10">
        <HeartIcon filled={optimisticState.isLiked} className="size-[18px]" />
      </span>
      {/* X leaves the count blank instead of printing 0 */}
      <span className="min-w-[1ch] px-1 tabular-nums">
        {optimisticState.likeCount > 0 ? formatCount(optimisticState.likeCount) : ""}
      </span>
    </button>
  );
}
