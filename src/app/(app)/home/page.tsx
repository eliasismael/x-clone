import { getCurrentUser } from "@/lib/session";
import { buildAvatarUrl } from "@/lib/avatar";
import { getTimelinePage } from "@/lib/queries/timeline";
import { TweetCompose } from "@/components/tweet/tweet-compose";
import { InfiniteTimeline } from "@/components/tweet/infinite-timeline";

export default async function HomePage() {
  const currentUser = await getCurrentUser();

  const { tweets, nextCursor } = await getTimelinePage(currentUser!.id);

  const avatarSrc = currentUser!.avatarUrl ?? buildAvatarUrl(currentUser!.username);

  return (
    <div className="min-h-screen bg-white/70 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl space-y-5">
        <TweetCompose avatarSrc={avatarSrc} displayName={currentUser!.displayName} />

        <InfiniteTimeline
          initialTweets={tweets}
          initialCursor={nextCursor}
          currentUserId={currentUser!.id}
        />
      </div>
    </div>
  );
}
