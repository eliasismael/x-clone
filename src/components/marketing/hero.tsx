const productPoints = [
  "Secure credentials auth backed by Postgres sessions",
  "Timeline, follows, and likes modeled for straightforward queries",
  "Mobile-first foundation for feed, profile, and social interactions",
];

export function Hero() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="space-y-6">
        <span className="inline-flex rounded-full border border-sky-200 bg-sky-100 px-3 py-1 text-sm font-medium text-sky-900">
          Social app starter
        </span>
        <div className="space-y-4">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            A focused foundation for building a modern social app.
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Next.js, Prisma, Postgres, and testing are already wired so we can move straight into
            product features instead of setup chores.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white! transition hover:bg-slate-800"
            href="/register"
          >
            Start with registration
          </a>
          <a
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
            href="/home"
          >
            See app shell
          </a>
        </div>
      </div>
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.4)]">
        <div className="rounded-[24px] bg-slate-950 p-5 text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-sm text-slate-300">Project status</p>
              <p className="text-xl font-semibold">Core foundations in place</p>
            </div>
            <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-medium text-emerald-300">
              Ready to build
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {productPoints.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
