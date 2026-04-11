import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/home");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[32px] bg-slate-950 p-8 text-white shadow-[0_30px_80px_-45px_rgba(15,23,42,0.65)]">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
            Welcome back
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">Sign in to your account</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Continue where you left off and jump right back into the timeline.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              "Credentials are checked against stored password hashes",
              "Successful sign-in creates a fresh database-backed session",
              "Protected routes redirect unauthenticated visitors to this screen",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            Sign in
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">Good to see you</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter your email and password to continue into the app.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
