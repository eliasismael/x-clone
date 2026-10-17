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
    <div>
      {tweets.length === 0 && (
        <div className="mx-auto max-w-[400px] px-8 py-10">
          <h2 className="text-[31px] leading-9 font-extrabold">Welcome to X Clone!</h2>
          <p className="mt-2 text-[15px] leading-5 text-x-muted">
            This is the best place to see what&apos;s happening. Follow some people and their posts
            will show up here.
          </p>
        </div>
      )}

      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} currentUserId={currentUserId} />
      ))}

      {cursor && (
        <div ref={sentinelRef} className="min-h-4">
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
        <p className="py-8 text-center text-[13px] text-x-muted">You&apos;re all caught up</p>
      )}
    </div>
  );
}
