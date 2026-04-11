import { getCurrentUser } from "@/lib/session";
import { formatCount } from "@/lib/utils";

const mockTweets = [
  {
    id: "1",
    author: "Elena Torres",
    username: "elena",
    content:
      "A small, reliable foundation makes it much easier to grow the timeline without losing momentum.",
    likes: 12,
  },
  {
    id: "2",
    author: "Marco Diaz",
    username: "marcod",
    content:
      "Clean iterations matter. It is much easier to ship social features when each step stays focused.",
    likes: 48,
  },
];

export default async function HomePage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="min-h-screen bg-white/70 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl space-y-5">
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Timeline shell</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This area is ready for protected data fetching once auth and feed actions are wired up.
          </p>
          <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Signed in as <span className="font-semibold text-slate-950">{currentUser?.displayName}</span>{" "}
            <span className="text-slate-500">@{currentUser?.username}</span>
          </div>
        </section>
        {mockTweets.map((tweet) => (
          <article key={tweet.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-950">{tweet.author}</h3>
                <p className="text-sm text-slate-500">@{tweet.username}</p>
              </div>
              <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                Follow
              </button>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-700">{tweet.content}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>{formatCount(tweet.likes)} likes</span>
              <span>Actions will connect once the feed is live</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
