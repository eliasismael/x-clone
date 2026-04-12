import { db } from "@/lib/db";

export const TIMELINE_PAGE_SIZE = 5;

export type TimelineCursor = {
  createdAt: Date;
  id: string;
};

export type TimelineTweet = {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    followers: { followerId: string }[];
  };
  _count: { likes: number };
  likes: { userId: string }[];
};

export type TimelinePage = {
  tweets: TimelineTweet[];
  nextCursor: TimelineCursor | null;
};

export async function getTimelinePage(
  userId: string,
  cursor?: TimelineCursor,
): Promise<TimelinePage> {
  const where = {
    OR: [
      { authorId: userId },
      { author: { followers: { some: { followerId: userId } } } },
    ],
    ...(cursor
      ? {
          AND: [
            {
              OR: [
                { createdAt: { lt: cursor.createdAt } },
                { createdAt: { equals: cursor.createdAt }, id: { lt: cursor.id } },
              ],
            },
          ],
        }
      : {}),
  };

  const tweets = await db.tweet.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          followers: {
            where: { followerId: userId },
            select: { followerId: true },
          },
        },
      },
      _count: { select: { likes: true } },
      likes: {
        where: { userId },
        select: { userId: true },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: TIMELINE_PAGE_SIZE + 1,
  });

  const hasMore = tweets.length > TIMELINE_PAGE_SIZE;
  const page = hasMore ? tweets.slice(0, TIMELINE_PAGE_SIZE) : tweets;
  const last = page[page.length - 1];

  return {
    tweets: page,
    nextCursor: hasMore && last ? { createdAt: last.createdAt, id: last.id } : null,
  };
}
