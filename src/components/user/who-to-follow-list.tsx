"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { buildAvatarUrl } from "@/lib/avatar";
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
    <ul className="mt-4 space-y-4">
      {users.map((user) => (
        <li key={user.id} className="flex items-center gap-3">
          <Link href={`/users/${user.username}`} className="shrink-0">
            <Image
              src={user.avatarUrl ?? buildAvatarUrl(user.username)}
              alt={`${user.displayName} avatar`}
              width={36}
              height={36}
              className="size-9 rounded-full border border-slate-200 bg-slate-50"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              href={`/users/${user.username}`}
              className="block truncate text-sm font-semibold text-slate-950 hover:underline"
            >
              {user.displayName}
            </Link>
            <p className="truncate text-xs text-slate-500">@{user.username}</p>
          </div>
          <FollowButton targetUserId={user.id} isFollowing={false} />
        </li>
      ))}
    </ul>
  );
}
