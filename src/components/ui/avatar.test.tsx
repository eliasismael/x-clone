import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";

const user = { username: "jane", displayName: "Jane Doe", avatarUrl: null };

describe("Avatar", () => {
  it("falls back to the generated avatar when the user has none", () => {
    render(<Avatar user={user} size={40} />);
    expect(screen.getByRole("img", { name: "Jane Doe avatar" })).toHaveAttribute(
      "src",
      "https://api.dicebear.com/9.x/initials/svg?seed=jane",
    );
  });

  it("renders the uploaded avatar", () => {
    render(<Avatar user={{ ...user, avatarUrl: "/uploads/avatars/jane.png" }} size={40} />);
    expect(screen.getByRole("img", { name: "Jane Doe avatar" }).getAttribute("src")).toContain(
      "jane.png",
    );
  });

  it("shows the user's initial when the image fails to load", () => {
    render(<Avatar user={user} size={40} />);
    fireEvent.error(screen.getByRole("img", { name: "Jane Doe avatar" }));

    const fallback = screen.getByRole("img", { name: "Jane Doe avatar" });
    expect(fallback.tagName).toBe("SPAN");
    expect(fallback).toHaveTextContent("J");
  });
});
