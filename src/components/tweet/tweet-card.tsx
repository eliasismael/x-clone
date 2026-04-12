import Image from "next/image";
import Link from "next/link";
import { deleteTweetAction } from "@/app/(app)/home/actions";
import { buildAvatarUrl } from "@/lib/avatar";
import { formatRelativeTime } from "@/lib/utils";
import { LikeButton } from "@/components/tweet/like-button";
import { FollowButton } from "@/components/user/follow-button";

export type TweetCardData = {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    followers?: { followerId: string }[];
  };
  _count: {
    likes: number;
  };
  likes?: { userId: string }[];
};

type TweetCardProps = {
  tweet: TweetCardData;
  currentUserId: string;
};

export function TweetCard({ tweet, currentUserId }: TweetCardProps) {
  const isOwnTweet = tweet.author.id === currentUserId;
  const isFollowing = tweet.author.followers?.some((f) => f.followerId === currentUserId) ?? false;
  const avatarSrc = tweet.author.avatarUrl ?? buildAvatarUrl(tweet.author.username);
  const deleteAction = deleteTweetAction.bind(null, tweet.id);

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <Link href={`/users/${tweet.author.username}`} className="shrink-0">
          <Image
            src={avatarSrc}
            alt={`${tweet.author.displayName} avatar`}
            width={44}
            height={44}
            className="size-11 rounded-full border border-slate-200 bg-slate-50"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={`/users/${tweet.author.username}`}
                className="truncate text-sm font-semibold text-slate-950 hover:underline"
              >
                {tweet.author.displayName}
              </Link>
              <p className="truncate text-sm text-slate-500">
                @{tweet.author.username} · {formatRelativeTime(tweet.createdAt)}
              </p>
            </div>

            {isOwnTweet ? (
              <form action={deleteAction}>
                <button
                  type="submit"
                  className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                >
                  Delete
                </button>
              </form>
            ) : (
              <FollowButton targetUserId={tweet.author.id} isFollowing={isFollowing} />
            )}
          </div>

          <p className="mt-2 text-sm leading-7 text-slate-700 whitespace-pre-wrap break-words">
            {tweet.content}
          </p>

          <div className="mt-3 flex items-center gap-4">
            <LikeButton
              tweetId={tweet.id}
              likeCount={tweet._count.likes}
              isLiked={tweet.likes?.some((l) => l.userId === currentUserId) ?? false}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export function TweetSkeleton() {
  return (
    <div className="animate-pulse rounded-[28px] border border-slate-100 bg-white/50 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="size-11 shrink-0 rounded-full bg-slate-200" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-4 w-32 rounded bg-slate-100" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-2/3 rounded bg-slate-100" />
          </div>
          <div className="h-4 w-16 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
