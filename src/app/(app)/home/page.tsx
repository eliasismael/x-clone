import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";
import { buildAvatarUrl } from "@/lib/avatar";
import { getTimelinePage } from "@/lib/queries/timeline";
import { PageHeader } from "@/components/app-shell/page-header";
import { TweetCompose } from "@/components/tweet/tweet-compose";
import { InfiniteTimeline } from "@/components/tweet/infinite-timeline";
import { WhoToFollow } from "@/components/user/who-to-follow";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage() {
  const currentUser = await getCurrentUser();

  const { tweets, nextCursor } = await getTimelinePage(currentUser!.id);

  const avatarSrc = currentUser!.avatarUrl ?? buildAvatarUrl(currentUser!.username);

  return (
    <>
      <PageHeader title="Home" />
      <div className="space-y-5 px-4 py-6">
        <TweetCompose avatarSrc={avatarSrc} displayName={currentUser!.displayName} />

        {/* Visible below the breakpoint where the right sidebar takes over */}
        <div className="min-[1080px]:hidden">
          <WhoToFollow currentUserId={currentUser!.id} />
        </div>

        <InfiniteTimeline
          initialTweets={tweets}
          initialCursor={nextCursor}
          currentUserId={currentUser!.id}
        />
      </div>
    </>
  );
}
