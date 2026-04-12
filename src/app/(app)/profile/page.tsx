import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { buildAvatarUrl } from "@/lib/avatar";
import { EditProfileForm } from "./edit-profile-form";
import { FollowStats } from "@/components/profile/follow-stats";
import { TweetCard } from "@/components/tweet/tweet-card";

const userSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} as const;

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  const userWithStats = await db.user.findUnique({
    where: { id: currentUser!.id },
    select: {
      _count: { select: { followers: true, following: true } },
      followers: { select: { follower: { select: userSelect } } },
      following: { select: { following: { select: userSelect } } },
    },
  });

  const tweets = await db.tweet.findMany({
    where: { authorId: currentUser!.id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      _count: { select: { likes: true } },
      likes: { where: { userId: currentUser!.id }, select: { userId: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const avatarSrc =
    currentUser!.avatarUrl ?? buildAvatarUrl(currentUser!.username);

  const followerUsers = userWithStats?.followers.map((f) => f.follower) ?? [];
  const followingUsers = userWithStats?.following.map((f) => f.following) ?? [];

  return (
    <div className="min-h-screen bg-white/70 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl space-y-5">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="h-32 bg-[linear-gradient(135deg,#0f172a_0%,#0369a1_100%)]" />
          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <Image
                src={avatarSrc}
                alt={`${currentUser?.displayName} avatar`}
                width={96}
                height={96}
                className="size-24 rounded-full border-4 border-white bg-white shadow-sm"
              />
              <EditProfileForm
                displayName={currentUser?.displayName ?? ""}
                username={currentUser?.username ?? ""}
                bio={currentUser?.bio ?? null}
              />
            </div>

            <div className="mt-4">
              <h1 className="text-2xl font-semibold text-slate-950">
                {currentUser?.displayName}
              </h1>
              <p className="mt-1 text-sm text-slate-500">@{currentUser?.username}</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
                {currentUser?.bio ?? "This user has not added a bio yet."}
              </p>
            </div>

            <div className="mt-4">
              <FollowStats
                followerCount={userWithStats?._count.followers ?? 0}
                followingCount={userWithStats?._count.following ?? 0}
                followers={followerUsers}
                following={followingUsers}
              />
            </div>
          </div>
        </section>

        {/* Own tweets */}
        {tweets.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            You haven&apos;t posted anything yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {tweets.map((tweet) => (
              <li key={tweet.id}>
                <TweetCard tweet={tweet} currentUserId={currentUser!.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
