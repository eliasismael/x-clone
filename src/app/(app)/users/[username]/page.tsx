import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { FollowButton } from "@/components/user/follow-button";
import { ProfileEmptyState, ProfileHeader } from "@/components/profile/profile-header";
import { TweetCard } from "@/components/tweet/tweet-card";

const userSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} as const;

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const currentUser = await getCurrentUser();

  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
      _count: { select: { followers: true, following: true, tweets: true } },
      // Full follower list for modal + isFollowing check
      followers: {
        select: { follower: { select: userSelect } },
      },
      // Full following list for modal
      following: {
        select: { following: { select: userSelect } },
      },
    },
  });

  if (!user) notFound();

  const tweets = await db.tweet.findMany({
    where: { authorId: user.id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          followers: currentUser
            ? { where: { followerId: currentUser.id }, select: { followerId: true } }
            : false,
        },
      },
      _count: { select: { likes: true } },
      likes: currentUser
        ? { where: { userId: currentUser.id }, select: { userId: true } }
        : false,
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const isSelf = currentUser?.id === user.id;
  const isFollowing = user.followers.some((f) => f.follower.id === currentUser?.id);

  const followerUsers = user.followers.map((f) => f.follower);
  const followingUsers = user.following.map((f) => f.following);

  let action = null;
  if (isSelf) {
    action = (
      <Link
        href="/profile"
        className="flex h-9 shrink-0 items-center rounded-full border border-x-banner px-4 text-[15px] font-bold transition-colors hover:bg-x-hover"
      >
        Edit profile
      </Link>
    );
  } else if (currentUser) {
    action = <FollowButton targetUserId={user.id} isFollowing={isFollowing} />;
  }

  return (
    <>
      <ProfileHeader
        user={user}
        tweetCount={user._count.tweets}
        followerCount={user._count.followers}
        followingCount={user._count.following}
        followers={followerUsers}
        following={followingUsers}
        action={action}
      />

      {tweets.length === 0 ? (
        <ProfileEmptyState
          title={`@${user.username} hasn't posted`}
          description="When they do, their posts will show up here."
        />
      ) : (
        <ul>
          {tweets.map((tweet) => (
            <li key={tweet.id}>
              <TweetCard tweet={tweet} currentUserId={currentUser?.id ?? ""} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
