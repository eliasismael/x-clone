import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { FollowButton } from "./follow-button";

vi.mock("@/app/(app)/actions", () => ({
  toggleFollowAction: vi.fn().mockResolvedValue(undefined),
}));

import { toggleFollowAction } from "@/app/(app)/actions";
const mockToggle = vi.mocked(toggleFollowAction);

beforeEach(() => {
  mockToggle.mockReset();
  mockToggle.mockResolvedValue(undefined);
});

describe("FollowButton", () => {
  it("renders Follow when isFollowing is false", () => {
    render(<FollowButton targetUserId="user-2" isFollowing={false} />);
    expect(screen.getByRole("button")).toHaveTextContent("Follow");
  });

  it("renders Following when isFollowing is true", () => {
    render(<FollowButton targetUserId="user-2" isFollowing={true} />);
    expect(screen.getByRole("button")).toHaveTextContent("Following");
  });

  it("toggles to Following immediately on click without waiting for the server", async () => {
    // Action never resolves so we can check optimistic state
    mockToggle.mockImplementation(() => new Promise(() => {}));

    render(<FollowButton targetUserId="user-2" isFollowing={false} />);
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).toHaveTextContent("Following");
  });

  it("toggles back to Follow immediately when already following", async () => {
    mockToggle.mockImplementation(() => new Promise(() => {}));

    render(<FollowButton targetUserId="user-2" isFollowing={true} />);
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).toHaveTextContent("Follow");
  });

  it("keeps Following state after the server action resolves", async () => {
    render(<FollowButton targetUserId="user-2" isFollowing={false} />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(mockToggle).toHaveBeenCalledOnce());
    expect(screen.getByRole("button")).toHaveTextContent("Following");
  });

  it("reverts to Follow when the server action throws", async () => {
    mockToggle.mockRejectedValue(new Error("network error"));

    render(<FollowButton targetUserId="user-2" isFollowing={false} />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("Follow"));
  });

  it("does not reset when re-rendered with the same isFollowing prop", async () => {
    const { rerender } = render(<FollowButton targetUserId="user-2" isFollowing={false} />);

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("Following");

    // Simulate a server re-render passing the same prop value
    rerender(<FollowButton targetUserId="user-2" isFollowing={false} />);

    await waitFor(() =>
      expect(screen.getByRole("button")).toHaveTextContent("Following"),
    );
  });

  it("shows Unfollow while hovering a followed user", () => {
    render(<FollowButton targetUserId="user-2" isFollowing={true} />);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);
    expect(button).toHaveTextContent("Unfollow");

    fireEvent.mouseLeave(button);
    expect(button).toHaveTextContent("Following");
  });

  it("keeps showing Follow while hovering a user that is not followed", () => {
    render(<FollowButton targetUserId="user-2" isFollowing={false} />);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);
    expect(button).toHaveTextContent("Follow");
    expect(button).not.toHaveTextContent("Unfollow");
  });

  it("shows Following, not Unfollow, right after following while still hovered", () => {
    mockToggle.mockImplementation(() => new Promise(() => {}));

    render(<FollowButton targetUserId="user-2" isFollowing={false} />);
    const button = screen.getByRole("button");

    fireEvent.mouseEnter(button);
    fireEvent.click(button);

    expect(button).toHaveTextContent("Following");
    expect(button).not.toHaveTextContent("Unfollow");
  });
});
