import { db } from "@/lib/db";
import { WhoToFollowList } from "@/components/user/who-to-follow-list";

type WhoToFollowProps = {
  currentUserId: string;
};

export async function WhoToFollow({ currentUserId }: WhoToFollowProps) {
  const suggestions = await db.user.findMany({
    where: {
      id: { not: currentUserId },
      followers: { none: { followerId: currentUserId } },
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
    },
    take: 3,
    orderBy: { followers: { _count: "desc" } },
  });

  if (suggestions.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-x-border">
      <h2 className="px-4 py-3 text-xl leading-6 font-extrabold">Who to follow</h2>
      <WhoToFollowList initialUsers={suggestions} />
    </section>
  );
}
