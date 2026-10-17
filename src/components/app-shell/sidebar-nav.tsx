"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, SearchIcon, UserIcon } from "@/components/ui/icons";
import { buildNavItems, isNavItemActive, type NavItem } from "@/lib/navigation";

const icons: Record<NavItem["label"], typeof HomeIcon> = {
  Home: HomeIcon,
  Explore: SearchIcon,
  Profile: UserIcon,
};

type NavProps = {
  username: string;
};

export function SidebarNav({ username }: NavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="mt-0.5 mb-1 flex flex-col items-center xl:items-start">
      {buildNavItems(username).map((item) => {
        const Icon = icons[item.label];
        const isActive = isNavItemActive(pathname, item);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className="group py-1"
          >
            <span className="flex items-center gap-5 rounded-full p-3 transition-colors group-hover:bg-x-hover xl:pr-6">
              <Icon className="size-[26px]" strokeWidth={isActive ? 2.5 : 1.75} />
              <span className={`hidden text-xl leading-6 xl:inline ${isActive ? "font-bold" : ""}`}>
                {item.label}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav({ username }: NavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 flex h-[53px] items-center justify-around border-t border-x-border bg-x-bg sm:hidden"
    >
      {buildNavItems(username).map((item) => {
        const Icon = icons[item.label];
        const isActive = isNavItemActive(pathname, item);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className="flex flex-1 justify-center py-3"
          >
            <Icon className="size-[26px]" strokeWidth={isActive ? 2.5 : 1.75} />
          </Link>
        );
      })}
    </nav>
  );
}
