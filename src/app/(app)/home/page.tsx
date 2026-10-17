import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";
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

  return (
    <>
      <PageHeader title="Home" />
      <div className="border-b border-x-border">
        <TweetCompose user={currentUser!} />
      </div>

      {/* Visible below the breakpoint where the right sidebar takes over */}
      <div className="border-b border-x-border p-4 min-[1080px]:hidden">
        <WhoToFollow currentUserId={currentUser!.id} />
      </div>

      <InfiniteTimeline
        initialTweets={tweets}
        initialCursor={nextCursor}
        currentUserId={currentUser!.id}
      />
    </>
  );
}
