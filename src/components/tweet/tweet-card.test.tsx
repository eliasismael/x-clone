import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TweetCard, type TweetCardData } from "./tweet-card";

vi.mock("@/app/(app)/home/actions", () => ({
  deleteTweetAction: vi.fn(),
  toggleLikeAction: vi.fn(),
}));

vi.mock("@/app/(app)/actions", () => ({
  toggleFollowAction: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

import { toggleFollowAction } from "@/app/(app)/actions";
const mockToggleFollow = vi.mocked(toggleFollowAction);

beforeEach(() => {
  mockToggleFollow.mockReset();
  mockToggleFollow.mockImplementation(() => new Promise(() => {}));
});

function buildTweet(overrides: Partial<TweetCardData> = {}): TweetCardData {
  return {
    id: "t1",
    content: "Hello from X",
    createdAt: new Date("2026-01-01T12:00:00Z"),
    author: { id: "author", username: "bob", displayName: "Bob", avatarUrl: null, followers: [] },
    _count: { likes: 2 },
    likes: [],
    ...overrides,
  };
}

describe("TweetCard", () => {
  it("renders author, handle, timestamp and content in one row", () => {
    render(<TweetCard tweet={buildTweet()} currentUserId="me" />);

    expect(screen.getByRole("link", { name: "Bob" })).toHaveAttribute("href", "/users/bob");
    expect(screen.getByText("@bob")).toBeInTheDocument();
    expect(screen.getByText("Hello from X")).toBeInTheDocument();
    expect(screen.getByRole("article").querySelector("time")).toHaveAttribute(
      "datetime",
      "2026-01-01T12:00:00.000Z",
    );
  });

  it("marks the like button as pressed when the current user liked it", () => {
    render(<TweetCard tweet={buildTweet({ likes: [{ userId: "me" }] })} currentUserId="me" />);
    expect(screen.getByRole("button", { name: "Unlike" })).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps the menu closed until More is clicked", () => {
    render(<TweetCard tweet={buildTweet()} currentUserId="me" />);
    expect(screen.queryByRole("button", { name: /follow @bob/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "More" })).toHaveAttribute("aria-expanded", "false");
  });

  it("offers Delete, and not Follow, on the user's own tweet", () => {
    const tweet = buildTweet({
      author: { id: "me", username: "me", displayName: "Me", avatarUrl: null },
    });
    render(<TweetCard tweet={tweet} currentUserId="me" />);
    fireEvent.click(screen.getByRole("button", { name: "More" }));

    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /follow @me/i })).not.toBeInTheDocument();
  });

  it("offers Follow on someone else's tweet and follows optimistically", () => {
    render(<TweetCard tweet={buildTweet()} currentUserId="me" />);
    fireEvent.click(screen.getByRole("button", { name: "More" }));
    fireEvent.click(screen.getByRole("button", { name: "Follow @bob" }));

    expect(mockToggleFollow).toHaveBeenCalledWith("author");
    // The menu closes after acting; reopening shows the new state
    fireEvent.click(screen.getByRole("button", { name: "More" }));
    expect(screen.getByRole("button", { name: "Unfollow @bob" })).toBeInTheDocument();
  });

  it("offers Unfollow when the current user already follows the author", () => {
    const tweet = buildTweet({
      author: { id: "author", username: "bob", displayName: "Bob", avatarUrl: null, followers: [{ followerId: "me" }] },
    });
    render(<TweetCard tweet={tweet} currentUserId="me" />);
    fireEvent.click(screen.getByRole("button", { name: "More" }));

    expect(screen.getByRole("button", { name: "Unfollow @bob" })).toBeInTheDocument();
  });

  it("closes the menu with Escape", () => {
    render(<TweetCard tweet={buildTweet()} currentUserId="me" />);
    fireEvent.click(screen.getByRole("button", { name: "More" }));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("button", { name: "Follow @bob" })).not.toBeInTheDocument();
  });

  it("hides the menu for signed-out viewers", () => {
    render(<TweetCard tweet={buildTweet()} currentUserId="" />);
    expect(screen.queryByRole("button", { name: "More" })).not.toBeInTheDocument();
  });
});
