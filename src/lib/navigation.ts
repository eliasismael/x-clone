export type NavItem = {
  label: "Home" | "Explore" | "Profile";
  href: string;
  // Path prefixes that should highlight this item
  matches: string[];
};

export function buildNavItems(username: string): NavItem[] {
  return [
    { label: "Home", href: "/home", matches: ["/home"] },
    { label: "Explore", href: "/search", matches: ["/search"] },
    { label: "Profile", href: "/profile", matches: ["/profile", `/users/${username}`] },
  ];
}

export function isNavItemActive(pathname: string, item: NavItem) {
  return item.matches.some((match) => pathname === match || pathname.startsWith(`${match}/`));
}
