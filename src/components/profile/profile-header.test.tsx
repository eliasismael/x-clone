import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProfileHeader } from "./profile-header";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const user = {
  username: "jane",
  displayName: "Jane Doe",
  avatarUrl: null,
  bio: "Building things",
  createdAt: new Date("2024-03-15T10:00:00Z"),
};

function renderHeader(overrides: Partial<Parameters<typeof ProfileHeader>[0]> = {}) {
  return render(
    <ProfileHeader
      user={user}
      tweetCount={12}
      followerCount={1500}
      followingCount={3}
      followers={[]}
      following={[]}
      {...overrides}
    />,
  );
}

describe("ProfileHeader", () => {
  it("shows the name, post count and a back link in the sticky header", () => {
    renderHeader();

    expect(screen.getByRole("heading", { level: 1, name: "Jane Doe" })).toBeInTheDocument();
    expect(screen.getByText("12 posts")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute("href", "/home");
  });

  it("uses the singular for a single post", () => {
    renderHeader({ tweetCount: 1 });
    expect(screen.getByText("1 post")).toBeInTheDocument();
  });

  it("shows handle, bio and join date", () => {
    renderHeader();

    expect(screen.getByText("@jane")).toBeInTheDocument();
    expect(screen.getByText("Building things")).toBeInTheDocument();
    expect(screen.getByText("Joined March 2024")).toBeInTheDocument();
  });

  it("omits the bio when the user has none", () => {
    renderHeader({ user: { ...user, bio: null } });
    expect(screen.queryByText("Building things")).not.toBeInTheDocument();
  });

  it("lists Following before Followers with compact counts, like X", () => {
    renderHeader();
    const [following, followers] = screen.getAllByRole("button");

    expect(following).toHaveTextContent("3Following");
    expect(followers).toHaveTextContent("1.5KFollowers");
  });

  it("renders the action passed for the viewer", () => {
    renderHeader({ action: <button type="button">Follow</button> });
    expect(screen.getByRole("button", { name: "Follow" })).toBeInTheDocument();
  });
});
