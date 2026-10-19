import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ComposePostButton } from "./compose-post-button";

const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

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

// jsdom does not implement showModal/close — mirror the open attribute and close event
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  });
});

beforeEach(() => {
  mockRefresh.mockReset();
  mockCreateTweet.mockReset();
  mockCreateTweet.mockResolvedValue({ ok: true });
});

const user = { username: "jane", displayName: "Jane", avatarUrl: null };

function getDialog() {
  return document.querySelector("dialog") as HTMLDialogElement;
}

describe("ComposePostButton", () => {
  it("keeps the dialog mounted but closed so it can animate in", () => {
    render(<ComposePostButton user={user} variant="sidebar" />);

    expect(getDialog()).toBeInTheDocument();
    expect(getDialog()).not.toHaveAttribute("open");
    expect(getDialog()).toHaveClass("x-modal");
  });

  it("opens the composer as a modal and focuses the text box", () => {
    render(<ComposePostButton user={user} variant="sidebar" />);
    fireEvent.click(screen.getByRole("button", { name: "Post" }));

    expect(getDialog()).toHaveAttribute("open");
    expect(screen.getByRole("textbox", { name: "Post text" })).toHaveFocus();
  });

  it("closes with the close button without unmounting, so it can animate out", () => {
    render(<ComposePostButton user={user} variant="floating" />);
    fireEvent.click(screen.getByRole("button", { name: "Post" }));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(getDialog()).toBeInTheDocument();
    expect(getDialog()).not.toHaveAttribute("open");
  });

  it("closes when clicking the backdrop but not inside the modal", () => {
    render(<ComposePostButton user={user} variant="sidebar" />);
    fireEvent.click(screen.getByRole("button", { name: "Post" }));

    fireEvent.click(screen.getByRole("textbox", { name: "Post text" }));
    expect(getDialog()).toHaveAttribute("open");

    fireEvent.click(getDialog());
    expect(getDialog()).not.toHaveAttribute("open");
  });

  it("closes and refreshes the page after posting", async () => {
    render(<ComposePostButton user={user} variant="sidebar" />);
    fireEvent.click(screen.getByRole("button", { name: "Post" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Post text" }), {
      target: { value: "hello" },
    });
    // The submit button inside the modal shares the "Post" label with the trigger
    fireEvent.click(screen.getAllByRole("button", { name: "Post" })[1]);

    await waitFor(() => expect(mockRefresh).toHaveBeenCalledOnce());
    expect(getDialog()).not.toHaveAttribute("open");
  });
});
