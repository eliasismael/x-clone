import { logoutAction } from "@/app/(app)/actions";
import { AccountMenu } from "@/components/app-shell/account-menu";
import { MobileNav, SidebarNav } from "@/components/app-shell/sidebar-nav";
import { SidebarSearch } from "@/components/search/sidebar-search";
import { XLogo } from "@/components/ui/icons";
import { WhoToFollow } from "@/components/user/who-to-follow";
import Link from "next/link";
import type { User } from "@prisma/client";
import type { ReactNode } from "react";

type AppShellProps = {
  currentUser: Pick<User, "id" | "displayName" | "username" | "bio" | "avatarUrl">;
  children: ReactNode;
};

export function AppShell({ currentUser, children }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1265px] justify-center">
      {/* Left column: collapses to icons below xl, replaced by a bottom bar on mobile */}
      <header className="sticky top-0 hidden h-screen w-[88px] shrink-0 flex-col justify-between overflow-y-auto px-2 sm:flex xl:w-[275px]">
        <div className="flex flex-col items-center xl:items-start">
          <Link
            href="/home"
            aria-label="X Clone"
            className="mt-0.5 flex size-[52px] items-center justify-center rounded-full transition-colors hover:bg-x-hover"
          >
            <XLogo className="size-[30px]" />
          </Link>
          <SidebarNav username={currentUser.username} />
        </div>
        <div className="my-3">
          <AccountMenu user={currentUser} logoutAction={logoutAction} />
        </div>
      </header>

      <main className="min-h-screen w-full max-w-[600px] min-w-0 border-x-border pb-[53px] sm:border-x sm:pb-0">
        <div className="flex h-[53px] items-center justify-between px-4 sm:hidden">
          <AccountMenu user={currentUser} logoutAction={logoutAction} variant="mobile" />
          <Link href="/home" aria-label="X Clone">
            <XLogo className="size-6" />
          </Link>
          <span className="size-8" />
        </div>
        {children}
      </main>

      <aside className="ml-8 hidden w-[350px] shrink-0 min-[1080px]:block">
        <div className="space-y-4 pb-16">
          <SidebarSearch />
          <WhoToFollow currentUserId={currentUser.id} />
        </div>
      </aside>

      <MobileNav username={currentUser.username} />
    </div>
  );
}
