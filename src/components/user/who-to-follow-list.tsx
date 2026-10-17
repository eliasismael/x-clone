"use client";

import { useState } from "react";
import { FollowButton } from "@/components/user/follow-button";
import { UserCell } from "@/components/user/user-cell";

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
        <li key={user.id}>
          <UserCell user={user} action={<FollowButton targetUserId={user.id} isFollowing={false} />} />
        </li>
      ))}
    </ul>
  );
}
