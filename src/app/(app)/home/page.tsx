import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { buildAvatarUrl } from "@/lib/avatar";
import { TweetCard } from "@/components/tweet/tweet-card";
import { TweetCompose } from "@/components/tweet/tweet-compose";

export default async function HomePage() {
  const currentUser = await getCurrentUser();

  const tweets = await db.tweet.findMany({
    where: {
      authorId: currentUser!.id,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: { likes: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const avatarSrc =
    currentUser!.avatarUrl ?? buildAvatarUrl(currentUser!.username);

  return (
    <div className="min-h-screen bg-white/70 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl space-y-5">
        <TweetCompose avatarSrc={avatarSrc} displayName={currentUser!.displayName} />

        {tweets.length === 0 && (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              Nothing here yet. Post your first tweet above!
            </p>
          </div>
        )}

        {tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            currentUserId={currentUser!.id}
          />
        ))}
      </div>
    </div>
  );
}
