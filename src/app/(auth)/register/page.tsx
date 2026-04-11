export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
          Ready for auth
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">Create account</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          New accounts will use unique email and username validation, password hashing, and local
          session cookies backed by the database.
        </p>
      </div>
    </main>
  );
}
