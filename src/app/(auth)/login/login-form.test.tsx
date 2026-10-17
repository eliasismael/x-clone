import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "./login-form";

vi.mock("./actions", () => ({
  loginAction: vi.fn(),
}));

import { loginAction } from "./actions";
const mockLogin = vi.mocked(loginAction);

beforeEach(() => {
  mockLogin.mockReset();
});

describe("LoginForm", () => {
  it("renders labelled email and password fields", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled();
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/register");
  });

  it("submits the credentials and shows field errors returned by the server", async () => {
    mockLogin.mockResolvedValue({ fieldErrors: { email: "No account uses that email." } });
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("No account uses that email.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    const formData = mockLogin.mock.calls[0][1];
    expect(formData.get("email")).toBe("jane@example.com");
    expect(formData.get("password")).toBe("secret");
  });

  it("shows form-level errors as an alert", async () => {
    mockLogin.mockResolvedValue({ formError: "Invalid email or password." });
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid email or password.");
  });
});
