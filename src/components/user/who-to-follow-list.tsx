"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { FollowButton } from "@/components/user/follow-button";

export type WhoToFollowUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

type Props = {
  initialUsers: WhoToFollowUser[];
};

export function WhoToFollowList({ initialUsers }: Props) {
  // useState only uses initialUsers on first mount — server re-renders won't reset this list
  const [users] = useState(initialUsers);

  if (users.length === 0) return null;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-x-row-hover">
          <Link href={`/users/${user.username}`} className="shrink-0">
            <Avatar user={user} size={40} />
          </Link>
          <Link href={`/users/${user.username}`} className="min-w-0 flex-1 leading-5">
            <span className="block truncate text-[15px] font-bold hover:underline">{user.displayName}</span>
            <span className="block truncate text-[15px] text-x-muted">@{user.username}</span>
          </Link>
          <FollowButton targetUserId={user.id} isFollowing={false} />
        </li>
      ))}
    </ul>
  );
}
