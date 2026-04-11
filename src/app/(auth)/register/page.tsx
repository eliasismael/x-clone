import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/home");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[32px] bg-slate-950 p-8 text-white shadow-[0_30px_80px_-45px_rgba(15,23,42,0.65)]">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
            Join the conversation
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Pick a unique username, set your profile identity, and jump straight into the timeline.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              "Unique email and username validation",
              "Password hashing before anything hits the database",
              "A secure session cookie created right after registration",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Sign up
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">Welcome aboard</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your account will be created with a local session so you can continue directly into the
            app.
          </p>
          <div className="mt-8">
            <RegisterForm />
          </div>
        </section>
      </div>
    </main>
  );
}
