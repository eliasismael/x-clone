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
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-950">Who to follow</h2>
      <WhoToFollowList initialUsers={suggestions} />
    </div>
  );
}
