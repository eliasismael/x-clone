import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LikeButton } from "./like-button";

vi.mock("@/app/(app)/home/actions", () => ({
  toggleLikeAction: vi.fn(),
}));

import { toggleLikeAction } from "@/app/(app)/home/actions";
const mockToggleLike = vi.mocked(toggleLikeAction);

beforeEach(() => {
  mockToggleLike.mockReset();
  // Never resolves so the optimistic state stays visible
  mockToggleLike.mockImplementation(() => new Promise(() => {}));
});

describe("LikeButton", () => {
  it("shows the like count and an unpressed state", () => {
    render(<LikeButton tweetId="t1" likeCount={3} isLiked={false} />);
    const button = screen.getByRole("button", { name: "Like" });

    expect(button).toHaveTextContent("3");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("leaves the count blank when nobody liked the tweet", () => {
    render(<LikeButton tweetId="t1" likeCount={0} isLiked={false} />);
    expect(screen.getByRole("button", { name: "Like" })).not.toHaveTextContent("0");
  });

  it("likes optimistically before the server responds", async () => {
    render(<LikeButton tweetId="t1" likeCount={3} isLiked={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Like" }));

    const button = await screen.findByRole("button", { name: "Unlike" });
    expect(button).toHaveTextContent("4");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(mockToggleLike).toHaveBeenCalledWith("t1");
  });

  it("unlikes optimistically when already liked", async () => {
    render(<LikeButton tweetId="t1" likeCount={1} isLiked={true} />);
    fireEvent.click(screen.getByRole("button", { name: "Unlike" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Like" })).toHaveAttribute("aria-pressed", "false"),
    );
    expect(screen.getByRole("button", { name: "Like" })).not.toHaveTextContent("0");
  });
});
