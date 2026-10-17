import { render, screen, fireEvent } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { EditProfileForm } from "./edit-profile-form";

vi.mock("./actions", () => ({
  updateProfileAction: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

// jsdom does not implement object URLs, which the avatar preview relies on
const createObjectURL = vi.fn(() => "blob:preview");
beforeAll(() => {
  URL.createObjectURL = createObjectURL;
  URL.revokeObjectURL = vi.fn();
});

const user = { username: "jane", displayName: "Jane Doe", avatarUrl: null, bio: "Hi there" };

function openModal() {
  render(<EditProfileForm user={user} />);
  fireEvent.click(screen.getByRole("button", { name: "Edit profile" }));
}

describe("EditProfileForm", () => {
  it("keeps the modal closed until Edit profile is clicked", () => {
    render(<EditProfileForm user={user} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens a dialog prefilled with the current profile", () => {
    openModal();

    expect(screen.getByRole("dialog", { name: "Edit profile" })).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Jane Doe");
    expect(screen.getByLabelText("Username")).toHaveValue("jane");
    expect(screen.getByLabelText("Bio")).toHaveValue("Hi there");
    expect(screen.getByLabelText("Change avatar")).toHaveAttribute("type", "file");
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("closes with the close button", () => {
    openModal();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes with Escape", () => {
    openModal();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("previews a newly selected avatar", () => {
    openModal();
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Change avatar"), { target: { files: [file] } });

    expect(createObjectURL).toHaveBeenCalledWith(file);
    expect(screen.getByRole("dialog").querySelector('img[src="blob:preview"]')).toBeInTheDocument();
  });
});
