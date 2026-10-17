import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Landing page", () => {
  it("shows X's headline and call to action", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1, name: "Happening now" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Join today." })).toBeInTheDocument();
  });

  it("links to registration and sign in", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: "Create account" })).toHaveAttribute("href", "/register");
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login");
  });
});
