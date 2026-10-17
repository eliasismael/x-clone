import Link from "next/link";
import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/avatar";

type UserCellProps = {
  user: { username: string; displayName: string; avatarUrl: string | null; bio?: string | null };
  action?: ReactNode;
};

// A row in X's people lists: avatar, name and handle, optional bio, action on the right
export function UserCell({ user, action }: UserCellProps) {
  const href = `/users/${user.username}`;

  return (
    <div className="flex gap-3 px-4 py-3 transition-colors hover:bg-x-row-hover">
      <Link href={href} className="shrink-0">
        <Avatar user={user} size={40} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <Link href={href} className="min-w-0 flex-1 leading-5">
            <span className="block truncate text-[15px] font-bold hover:underline">{user.displayName}</span>
            <span className="block truncate text-[15px] text-x-muted">@{user.username}</span>
          </Link>
          {action}
        </div>
        {user.bio && <p className="mt-1 text-[15px] leading-5 break-words">{user.bio}</p>}
      </div>
    </div>
  );
}
