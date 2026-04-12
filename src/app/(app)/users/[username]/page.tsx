import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { buildAvatarUrl } from "@/lib/avatar";
import { FollowButton } from "@/components/user/follow-button";
import { FollowStats } from "@/components/profile/follow-stats";
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
      _count: { select: { followers: true, following: true } },
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
  const avatarSrc = user.avatarUrl ?? buildAvatarUrl(user.username);

  const followerUsers = user.followers.map((f) => f.follower);
  const followingUsers = user.following.map((f) => f.following);

  return (
    <div className="min-h-screen bg-white/70 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl space-y-5">
        {/* Profile header */}
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="h-32 bg-[linear-gradient(135deg,#0f172a_0%,#0369a1_100%)]" />
          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <Image
                src={avatarSrc}
                alt={`${user.displayName} avatar`}
                width={96}
                height={96}
                className="size-24 rounded-full border-4 border-white bg-white shadow-sm"
              />
              {!isSelf && currentUser && (
                <FollowButton targetUserId={user.id} isFollowing={isFollowing} />
              )}
            </div>

            <div className="mt-4">
              <h1 className="text-2xl font-semibold text-slate-950">{user.displayName}</h1>
              <p className="mt-1 text-sm text-slate-500">@{user.username}</p>
              {user.bio && (
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">{user.bio}</p>
              )}
            </div>

            <div className="mt-4">
              <FollowStats
                followerCount={user._count.followers}
                followingCount={user._count.following}
                followers={followerUsers}
                following={followingUsers}
              />
            </div>
          </div>
        </section>

        {/* Tweets */}
        {tweets.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">No tweets yet.</p>
        ) : (
          <ul className="space-y-4">
            {tweets.map((tweet) => (
              <li key={tweet.id}>
                <TweetCard tweet={tweet} currentUserId={currentUser?.id ?? ""} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
