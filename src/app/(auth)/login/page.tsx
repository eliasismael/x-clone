export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          Sign in
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">Sign in</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This screen is reserved for the credentials flow, session creation, and redirect into the
          main timeline.
        </p>
      </div>
    </main>
  );
}
