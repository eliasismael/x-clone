"use client";

import { usePathname } from "next/navigation";
import { SearchBox } from "@/components/search/search-box";

// X hides the sidebar search on the Explore page, which has its own search bar
export function SidebarSearch() {
  const pathname = usePathname();

  if (pathname === "/search") return null;

  return (
    <div className="sticky top-0 z-10 bg-x-bg py-1.5">
      <SearchBox />
    </div>
  );
}
