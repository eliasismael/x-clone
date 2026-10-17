import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AccountMenu } from "./account-menu";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const user = { username: "jane", displayName: "Jane Doe", avatarUrl: null };

function renderMenu() {
  return render(<AccountMenu user={user} logoutAction={vi.fn()} />);
}

describe("AccountMenu", () => {
  it("shows the account name and handle in the trigger", () => {
    renderMenu();
    const trigger = screen.getByRole("button", { name: "Account menu" });
    expect(trigger).toHaveTextContent("Jane Doe");
    expect(trigger).toHaveTextContent("@jane");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("does not render the logout option until opened", () => {
    renderMenu();
    expect(screen.queryByRole("button", { name: "Log out @jane" })).not.toBeInTheDocument();
  });

  it("opens the menu with a logout option for the current user", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Account menu" }));

    expect(screen.getByRole("button", { name: "Log out @jane" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Account menu" })).toHaveAttribute("aria-expanded", "true");
  });

  it("closes when Escape is pressed", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Account menu" }));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("button", { name: "Log out @jane" })).not.toBeInTheDocument();
  });

  it("closes when clicking outside", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Account menu" }));
    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole("button", { name: "Log out @jane" })).not.toBeInTheDocument();
  });

  it("stays open when clicking inside the menu", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Account menu" }));
    fireEvent.mouseDown(screen.getByRole("button", { name: "Log out @jane" }));

    expect(screen.getByRole("button", { name: "Log out @jane" })).toBeInTheDocument();
  });
});
