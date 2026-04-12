import { db } from "@/lib/db";

export type SearchUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  followers: { followerId: string }[];
};

export async function searchUsers(
  q: string,
  currentUserId: string,
): Promise<SearchUser[]> {
  const trimmed = q.trim();
  if (!trimmed) return [];

  return db.user.findMany({
    where: {
      AND: [
        { id: { not: currentUserId } },
        {
          OR: [
            { username: { contains: trimmed, mode: "insensitive" } },
            { displayName: { contains: trimmed, mode: "insensitive" } },
          ],
        },
      ],
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      followers: {
        where: { followerId: currentUserId },
        select: { followerId: true },
      },
    },
    take: 20,
    orderBy: { followers: { _count: "desc" } },
  });
}