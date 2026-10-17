import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RegisterForm } from "./register-form";

vi.mock("./actions", () => ({
  registerAction: vi.fn(),
}));

import { registerAction } from "./actions";
const mockRegister = vi.mocked(registerAction);

beforeEach(() => {
  mockRegister.mockReset();
});

describe("RegisterForm", () => {
  it("renders every registration field with an accessible label", () => {
    render(<RegisterForm />);

    for (const label of ["Display name", "Username", "Email", "Bio", "Password", "Confirm password"]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
    expect(screen.getByLabelText("Bio").tagName).toBe("TEXTAREA");
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login");
  });

  it("shows the server's field errors next to each field", async () => {
    mockRegister.mockResolvedValue({
      fieldErrors: {
        username: "That username is already taken.",
        confirmPassword: "Passwords do not match.",
      },
    });
    render(<RegisterForm />);

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("That username is already taken.")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toHaveAccessibleDescription("That username is already taken.");
    expect(screen.getByLabelText("Confirm password")).toHaveAccessibleDescription("Passwords do not match.");
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "false");
  });
});
