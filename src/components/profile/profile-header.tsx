import type { ReactNode } from "react";
import { PageHeader } from "@/components/app-shell/page-header";
import { FollowStats } from "@/components/profile/follow-stats";
import type { FollowUser } from "@/components/profile/follow-modal";
import { Avatar } from "@/components/ui/avatar";
import { CalendarIcon } from "@/components/ui/icons";
import { formatCount, formatJoinedDate } from "@/lib/utils";

type ProfileHeaderProps = {
  user: {
    username: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: Date;
  };
  tweetCount: number;
  followerCount: number;
  followingCount: number;
  followers: FollowUser[];
  following: FollowUser[];
  // Edit profile or Follow, rendered opposite the avatar
  action?: ReactNode;
};

export function ProfileHeader({
  user,
  tweetCount,
  followerCount,
  followingCount,
  followers,
  following,
  action,
}: ProfileHeaderProps) {
  return (
    <>
      <PageHeader
        title={user.displayName}
        subtitle={`${formatCount(tweetCount)} ${tweetCount === 1 ? "post" : "posts"}`}
        backHref="/home"
      />

      <section>
        <div className="aspect-[3/1] bg-x-banner" />
        <div className="px-4 pt-3 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="-mt-[15%] w-1/4 min-w-12 max-w-[142px] rounded-full border-4 border-x-bg bg-x-bg">
              <Avatar user={user} size={134} fluid />
            </div>
            {action}
          </div>

          <div className="mt-1">
            <h2 className="text-xl leading-6 font-extrabold break-words">{user.displayName}</h2>
            <p className="text-[15px] leading-5 text-x-muted">@{user.username}</p>
          </div>

          {user.bio && <p className="mt-3 text-[15px] leading-5 break-words whitespace-pre-wrap">{user.bio}</p>}

          <p className="mt-3 flex items-center gap-1 text-[15px] leading-5 text-x-muted">
            <CalendarIcon className="size-[18px]" />
            Joined {formatJoinedDate(user.createdAt)}
          </p>

          <div className="mt-3">
            <FollowStats
              followerCount={followerCount}
              followingCount={followingCount}
              followers={followers}
              following={following}
            />
          </div>
        </div>

        <div className="flex border-b border-x-border">
          <span className="relative flex-1 py-4 text-center text-[15px] font-bold">
            Posts
            <span className="absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-x-blue" />
          </span>
        </div>
      </section>
    </>
  );
}

export function ProfileEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-[400px] px-8 py-10">
      <h2 className="text-[31px] leading-9 font-extrabold break-words">{title}</h2>
      <p className="mt-2 text-[15px] leading-5 text-x-muted">{description}</p>
    </div>
  );
}
