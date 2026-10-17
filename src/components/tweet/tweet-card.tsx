import Link from "next/link";
import { deleteTweetAction } from "@/app/(app)/home/actions";
import { formatRelativeTime } from "@/lib/utils";
import { LikeButton } from "@/components/tweet/like-button";
import { TweetMenu } from "@/components/tweet/tweet-menu";
import { Avatar } from "@/components/ui/avatar";

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
  const deleteAction = deleteTweetAction.bind(null, tweet.id);
  const createdAt = new Date(tweet.createdAt);
  const profileHref = `/users/${tweet.author.username}`;

  return (
    <article className="flex gap-3 border-b border-x-border px-4 pt-3 pb-1 transition-colors hover:bg-x-row-hover">
      <Link href={profileHref} className="shrink-0">
        <Avatar user={tweet.author} size={40} />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1 text-[15px] leading-5">
            <Link href={profileHref} className="truncate font-bold hover:underline">
              {tweet.author.displayName}
            </Link>
            <Link href={profileHref} className="truncate text-x-muted">
              @{tweet.author.username}
            </Link>
            <span aria-hidden="true" className="text-x-muted">
              ·
            </span>
            <time
              dateTime={createdAt.toISOString()}
              title={createdAt.toLocaleString("en")}
              className="shrink-0 text-x-muted"
            >
              {formatRelativeTime(createdAt)}
            </time>
          </div>

          {currentUserId && (
            <TweetMenu
              author={tweet.author}
              isOwnTweet={isOwnTweet}
              isFollowing={isFollowing}
              deleteAction={deleteAction}
            />
          )}
        </div>

        <p className="text-[15px] leading-5 break-words whitespace-pre-wrap">{tweet.content}</p>

        <div className="mt-1 flex items-center">
          <LikeButton
            tweetId={tweet.id}
            likeCount={tweet._count.likes}
            isLiked={tweet.likes?.some((l) => l.userId === currentUserId) ?? false}
          />
        </div>
      </div>
    </article>
  );
}

export function TweetSkeleton() {
  return (
    <div aria-hidden="true" className="flex animate-pulse gap-3 border-b border-x-border px-4 py-3">
      <div className="size-10 shrink-0 rounded-full bg-x-surface" />
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 rounded-full bg-x-surface" />
          <div className="h-4 w-32 rounded-full bg-x-surface" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded-full bg-x-surface" />
          <div className="h-4 w-2/3 rounded-full bg-x-surface" />
        </div>
      </div>
    </div>
  );
}
