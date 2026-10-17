import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { EditProfileForm } from "./edit-profile-form";
import { ProfileEmptyState, ProfileHeader } from "@/components/profile/profile-header";
import { TweetCard } from "@/components/tweet/tweet-card";

export const metadata: Metadata = {
  title: "Profile",
};

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
      _count: { select: { followers: true, following: true, tweets: true } },
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

  const followerUsers = userWithStats?.followers.map((f) => f.follower) ?? [];
  const followingUsers = userWithStats?.following.map((f) => f.following) ?? [];

  return (
    <>
      <ProfileHeader
        user={currentUser!}
        tweetCount={userWithStats?._count.tweets ?? 0}
        followerCount={userWithStats?._count.followers ?? 0}
        followingCount={userWithStats?._count.following ?? 0}
        followers={followerUsers}
        following={followingUsers}
        action={
          // Remount after a successful save so the modal closes on the redirect back here
          <EditProfileForm key={currentUser!.updatedAt.toISOString()} user={currentUser!} />
        }
      />

      {tweets.length === 0 ? (
        <ProfileEmptyState
          title="You haven't posted yet"
          description="When you post, it will show up here."
        />
      ) : (
        <ul>
          {tweets.map((tweet) => (
            <li key={tweet.id}>
              <TweetCard tweet={tweet} currentUserId={currentUser!.id} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
