import { logoutAction } from "@/app/(app)/actions";
import { LogoutButton } from "@/components/auth/logout-button";
import { WhoToFollow } from "@/components/user/who-to-follow";
import Image from "next/image";
import Link from "next/link";
import type { User } from "@prisma/client";
import type { ReactNode } from "react";

type AppShellProps = {
  currentUser: Pick<User, "id" | "displayName" | "username" | "bio" | "avatarUrl">;
  children: ReactNode;
};

const navItems = [
  { label: "Home", href: "/home" },
  { label: "Search", href: "/search" },
  { label: "Profile", href: "/profile" },
];

export function AppShell({ currentUser, children }: AppShellProps) {
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
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Landing
            </Link>
            <LogoutButton action={logoutAction} />
          </div>
        </div>
        <nav className="mt-6 grid gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href={`/users/${currentUser.username}`}
          className="mt-6 flex items-center gap-3 rounded-[28px] border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
        >
          <Image
            src={currentUser.avatarUrl ?? `https://api.dicebear.com/9.x/initials/svg?seed=${currentUser.username}`}
            alt={`${currentUser.displayName} avatar`}
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-full border border-slate-200 bg-white"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">{currentUser.displayName}</p>
            <p className="truncate text-sm text-slate-500">@{currentUser.username}</p>
          </div>
        </Link>
      </aside>
      <main className="flex-1">{children}</main>
      <aside className="hidden w-80 border-l border-slate-200 px-6 py-8 xl:block">
        <WhoToFollow currentUserId={currentUser.id} />
      </aside>
    </div>
  );
}
