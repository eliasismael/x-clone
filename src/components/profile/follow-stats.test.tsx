import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { FollowStats } from "./follow-stats";
import type { FollowUser } from "./follow-modal";

// jsdom does not implement showModal/close — simulate the open attribute so the
// dialog becomes accessible and the native "close" event fires correctly.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.setAttribute("open", "");
  });
  HTMLDialogElement.prototype.close = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  });
});

// next/image and next/link need to be stubbed in jsdom
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}));

const followers: FollowUser[] = [
  { id: "u1", username: "alice", displayName: "Alice", avatarUrl: null },
  { id: "u2", username: "bob", displayName: "Bob", avatarUrl: null },
];

const following: FollowUser[] = [
  { id: "u3", username: "carol", displayName: "Carol", avatarUrl: null },
];

function renderStats(overrides?: Partial<Parameters<typeof FollowStats>[0]>) {
  return render(
    <FollowStats
      followerCount={2}
      followingCount={1}
      followers={followers}
      following={following}
      {...overrides}
    />,
  );
}

describe("FollowStats", () => {
  it("renders follower and following counts", () => {
    renderStats();
    expect(screen.getByRole("button", { name: /followers/i })).toHaveTextContent("2");
    expect(screen.getByRole("button", { name: /following/i })).toHaveTextContent("1");
  });

  it("does not show a modal initially", () => {
    renderStats();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the followers modal when clicking Followers", () => {
    renderStats();
    fireEvent.click(screen.getByRole("button", { name: /followers/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // Heading inside the modal
    expect(screen.getAllByText("Followers").length).toBeGreaterThan(0);
  });

  it("shows the follower users inside the modal", () => {
    renderStats();
    fireEvent.click(screen.getByRole("button", { name: /followers/i }));
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    // Carol is in following, not followers
    expect(screen.queryByText("Carol")).not.toBeInTheDocument();
  });

  it("opens the following modal and shows following users", () => {
    renderStats();
    fireEvent.click(screen.getByRole("button", { name: /following/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Carol")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("closes the modal when the close button is clicked", () => {
    renderStats();
    fireEvent.click(screen.getByRole("button", { name: /followers/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows 'No users yet' when the followers list is empty", () => {
    renderStats({ followers: [], followerCount: 0 });
    fireEvent.click(screen.getByRole("button", { name: /followers/i }));
    expect(screen.getByText(/no users yet/i)).toBeInTheDocument();
  });
});
