import Link from "next/link";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

const navItems = ["Home", "Explore", "Notifications", "Profile"];

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col lg:flex-row">
      <aside className="border-b border-slate-200 bg-white/85 px-4 py-5 backdrop-blur lg:min-h-screen lg:w-72 lg:border-r lg:border-b-0 lg:px-6">
        <div className="flex items-center justify-between lg:block">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              X Clone
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">Builder workspace</h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Landing
          </Link>
        </div>
        <nav className="mt-6 grid gap-2">
          {navItems.map((item) => (
            <div
              key={item}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
      <aside className="hidden w-80 border-l border-slate-200 px-6 py-8 xl:block">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Next up</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Wire credentials auth into the shell, persist sessions in the database, and connect the
            feed to real data.
          </p>
        </div>
      </aside>
    </div>
  );
}
