import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { searchUsers } from "@/lib/queries/search";
import { buildAvatarUrl } from "@/lib/avatar";
import { FollowButton } from "@/components/user/follow-button";
import { UserSearchInput } from "@/components/search/user-search-input";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const currentUser = await getCurrentUser();
  const users = await searchUsers(q, currentUser!.id);

  return (
    <div className="min-h-screen bg-white/70 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-950">Search users</h2>
          <UserSearchInput defaultValue={q} />
        </div>

        {q.trim() === "" ? (
          <p className="py-10 text-center text-sm text-slate-400">
            Type a name or username to search.
          </p>
        ) : users.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            No users found for &ldquo;{q}&rdquo;.
          </p>
        ) : (
          <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {users.map((user) => {
                const avatarSrc = user.avatarUrl ?? buildAvatarUrl(user.username);
                const isFollowing = user.followers.length > 0;

                return (
                  <li key={user.id} className="flex items-center gap-3 px-5 py-4">
                    <Link href={`/users/${user.username}`} className="shrink-0">
                      <Image
                        src={avatarSrc}
                        alt={`${user.displayName} avatar`}
                        width={44}
                        height={44}
                        className="size-11 rounded-full border border-slate-200 bg-slate-50"
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
                    <FollowButton targetUserId={user.id} isFollowing={isFollowing} />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}