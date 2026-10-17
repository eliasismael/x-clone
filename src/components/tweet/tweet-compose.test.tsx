import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TweetCompose } from "./tweet-compose";

vi.mock("@/app/(app)/home/actions", () => ({
  createTweetAction: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

import { createTweetAction } from "@/app/(app)/home/actions";
const mockCreateTweet = vi.mocked(createTweetAction);

const user = { username: "jane", displayName: "Jane", avatarUrl: null };

beforeEach(() => {
  mockCreateTweet.mockReset();
  mockCreateTweet.mockResolvedValue({ ok: true });
});

function type(value: string) {
  fireEvent.change(screen.getByRole("textbox", { name: "Post text" }), { target: { value } });
}

describe("TweetCompose", () => {
  it("disables Post while the composer is empty or whitespace", () => {
    render(<TweetCompose user={user} />);
    expect(screen.getByRole("button", { name: "Post" })).toBeDisabled();

    type("   ");
    expect(screen.getByRole("button", { name: "Post" })).toBeDisabled();
  });

  it("hides the character counter until the user types", () => {
    render(<TweetCompose user={user} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    type("hello");
    expect(screen.getByRole("status")).toHaveAccessibleName("275 characters remaining");
    expect(screen.getByRole("button", { name: "Post" })).toBeEnabled();
  });

  it("shows the remaining count near the limit", () => {
    render(<TweetCompose user={user} />);
    type("a".repeat(270));
    expect(screen.getByRole("status")).toHaveTextContent("10");
  });

  it("disables Post once over 280 characters", () => {
    render(<TweetCompose user={user} />);
    type("a".repeat(281));
    expect(screen.getByRole("status")).toHaveTextContent("-1");
    expect(screen.getByRole("button", { name: "Post" })).toBeDisabled();
  });

  it("clears the text and notifies the parent after a successful post", async () => {
    const onPosted = vi.fn();
    render(<TweetCompose user={user} onPosted={onPosted} />);
    type("hello world");
    fireEvent.click(screen.getByRole("button", { name: "Post" }));

    await waitFor(() => expect(onPosted).toHaveBeenCalledOnce());
    expect(screen.getByRole("textbox", { name: "Post text" })).toHaveValue("");
    expect(mockCreateTweet.mock.calls[0][1].get("content")).toBe("hello world");
  });

  it("shows the server's validation error and keeps the text", async () => {
    mockCreateTweet.mockResolvedValue({ ok: false, fieldErrors: { content: "Tweet cannot be empty." } });
    const onPosted = vi.fn();
    render(<TweetCompose user={user} onPosted={onPosted} />);
    type("hello");
    fireEvent.click(screen.getByRole("button", { name: "Post" }));

    expect(await screen.findByText("Tweet cannot be empty.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Post text" })).toHaveValue("hello");
    expect(onPosted).not.toHaveBeenCalled();
  });
});
