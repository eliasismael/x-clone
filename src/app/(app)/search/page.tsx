import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";
import { searchUsers } from "@/lib/queries/search";
import { SearchBox } from "@/components/search/search-box";
import { FollowButton } from "@/components/user/follow-button";
import { UserCell } from "@/components/user/user-cell";

export const metadata: Metadata = {
  title: "Explore",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const currentUser = await getCurrentUser();
  const users = await searchUsers(q, currentUser!.id);
  const query = q.trim();

  return (
    <>
      <header className="sticky top-0 z-20 bg-x-header px-4 py-1.5 backdrop-blur-md">
        <SearchBox defaultValue={q} autoFocus />
      </header>

      {query === "" ? (
        <EmptyState title="Search for people" description="Find someone by their name or username." />
      ) : users.length === 0 ? (
        <EmptyState title={`No results for "${query}"`} description="Try searching for something else." />
      ) : (
        <section className="border-t border-x-border">
          <h2 className="px-4 py-3 text-xl leading-6 font-extrabold">People</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <UserCell
                  user={user}
                  action={<FollowButton targetUserId={user.id} isFollowing={user.followers.length > 0} />}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-[400px] px-8 py-10">
      <h2 className="text-[31px] leading-9 font-extrabold break-words">{title}</h2>
      <p className="mt-2 text-[15px] leading-5 text-x-muted">{description}</p>
    </div>
  );
}
