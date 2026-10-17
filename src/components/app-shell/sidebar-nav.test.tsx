import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MobileNav, SidebarNav } from "./sidebar-nav";

const mockUsePathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

beforeEach(() => {
  mockUsePathname.mockReturnValue("/home");
});

describe("SidebarNav", () => {
  it("renders Home, Explore and Profile links", () => {
    render(<SidebarNav username="jane" />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/home");
    expect(screen.getByRole("link", { name: "Explore" })).toHaveAttribute("href", "/search");
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/profile");
  });

  it("marks only the current section as the active page", () => {
    mockUsePathname.mockReturnValue("/search");
    render(<SidebarNav username="jane" />);

    expect(screen.getByRole("link", { name: "Explore" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Profile" })).not.toHaveAttribute("aria-current");
  });

  it("marks Profile as active on the user's own public profile", () => {
    mockUsePathname.mockReturnValue("/users/jane");
    render(<SidebarNav username="jane" />);

    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("aria-current", "page");
  });
});

describe("MobileNav", () => {
  it("renders icon-only links labelled for screen readers", () => {
    mockUsePathname.mockReturnValue("/profile");
    render(<MobileNav username="jane" />);

    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("aria-current", "page");
  });
});
