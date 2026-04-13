"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { TweetCard, TweetSkeleton, type TweetCardData } from "@/components/tweet/tweet-card";
import { type TimelineCursor } from "@/lib/queries/timeline";
import { loadMoreTweetsAction } from "@/app/(app)/home/actions";

type InfiniteTimelineProps = {
  initialTweets: TweetCardData[];
  initialCursor: TimelineCursor | null;
  currentUserId: string;
};

export function InfiniteTimeline({
  initialTweets,
  initialCursor,
  currentUserId,
}: InfiniteTimelineProps) {
  const [tweets, setTweets] = useState<TweetCardData[]>(initialTweets);
  const [cursor, setCursor] = useState<TimelineCursor | null>(initialCursor);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Sync server-provided data into local state after a revalidation (RSC re-render)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTweets(initialTweets);
    setCursor(initialCursor);
  }, [initialTweets, initialCursor]);

  useEffect(() => {
    if (!cursor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isPending) {
          startTransition(async () => {
            const result = await loadMoreTweetsAction(cursor);
            setTweets((prev) => [...prev, ...result.tweets]);
            setCursor(result.nextCursor);
          });
        }
      },
      { rootMargin: "200px" },
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [cursor, isPending]);

  return (
    <div className="space-y-5">
      {tweets.length === 0 && (
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Your timeline is empty. Follow some users to see their tweets here!
          </p>
        </div>
      )}

      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} currentUserId={currentUserId} />
      ))}

      {cursor && (
        <div ref={sentinelRef} className="space-y-5 py-4">
          {isPending && (
            <>
              <TweetSkeleton />
              <TweetSkeleton />
              <TweetSkeleton />
            </>
          )}
        </div>
      )}

      {!cursor && tweets.length > 0 && (
        <p className="py-4 text-center text-xs text-slate-400">You&apos;ve reached the end</p>
      )}
    </div>
  );
}
