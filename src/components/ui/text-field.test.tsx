import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextField } from "./text-field";

describe("TextField", () => {
  it("labels the input with the visible label", () => {
    render(<TextField label="Email" name="email" type="email" />);
    const input = screen.getByLabelText("Email");

    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  it("renders a textarea when multiline", () => {
    render(<TextField label="Bio" name="bio" defaultValue="Hello" multiline />);
    const textarea = screen.getByLabelText("Bio");

    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveValue("Hello");
  });

  it("links the error message to the input", () => {
    render(<TextField label="Username" name="username" error="That username is already taken." />);
    const input = screen.getByLabelText("Username");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("That username is already taken.");
  });

  it("does not render an error message without an error", () => {
    render(<TextField label="Username" name="username" />);
    expect(screen.getByLabelText("Username")).not.toHaveAttribute("aria-describedby");
  });
});
