"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Avatar } from "@/components/ui/avatar";
import { CameraIcon, CloseIcon } from "@/components/ui/icons";
import { TextField } from "@/components/ui/text-field";
import { useDismiss } from "@/components/ui/use-dismiss";
import { updateProfileAction, type UpdateProfileActionState } from "./actions";

const initialState: UpdateProfileActionState = {};

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-8 rounded-full bg-x-inverse-bg px-4 text-[14px] font-bold text-x-inverse-text transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

type EditProfileFormProps = {
  user: { username: string; displayName: string; avatarUrl: string | null; bio: string | null };
};

export function EditProfileForm({ user }: EditProfileFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [state, formAction] = useActionState(updateProfileAction, initialState);
  const panelRef = useRef<HTMLFormElement>(null);
  const closeModal = useCallback(() => setIsOpen(false), []);

  useDismiss(panelRef, isOpen, closeModal);

  // Release the object URL of the previous avatar preview
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="h-9 shrink-0 rounded-full border border-x-banner px-4 text-[15px] font-bold transition-colors hover:bg-x-hover"
      >
        Edit profile
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-x-backdrop sm:pt-[5vh]">
          <form
            ref={panelRef}
            action={formAction}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            className="flex h-full w-full max-w-[600px] flex-col overflow-hidden bg-x-bg sm:h-auto sm:max-h-[90vh] sm:rounded-2xl"
          >
            <div className="flex h-[53px] shrink-0 items-center gap-8 px-2">
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-x-hover"
              >
                <CloseIcon className="size-5" strokeWidth={2} />
              </button>
              <h2 id="edit-profile-title" className="flex-1 text-xl font-bold">
                Edit profile
              </h2>
              <div className="pr-2">
                <SaveButton />
              </div>
            </div>

            <div className="overflow-y-auto">
              <div className="aspect-[3/1] bg-x-banner" />

              <div className="px-4">
                <label className="group relative -mt-12 block size-[112px] cursor-pointer overflow-hidden rounded-full border-4 border-x-bg bg-x-bg">
                  <span className="sr-only">Change avatar</span>
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="" className="size-full rounded-full object-cover" />
                  ) : (
                    <Avatar user={user} size={104} fluid />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 text-white transition-colors group-hover:bg-black/40">
                    <CameraIcon className="size-[22px]" />
                  </span>
                  <input
                    name="avatar"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleAvatarChange}
                    className="sr-only"
                  />
                </label>
                <p className="mt-2 text-[13px] text-x-muted">PNG, JPG, or WebP up to 2 MB.</p>
                {state.fieldErrors?.avatar ? (
                  <p className="mt-1 text-[13px] text-x-red">{state.fieldErrors.avatar}</p>
                ) : null}
              </div>

              <div className="grid gap-6 px-4 pt-4 pb-6">
                <TextField
                  label="Name"
                  name="displayName"
                  defaultValue={user.displayName}
                  error={state.fieldErrors?.displayName}
                />
                <TextField
                  label="Username"
                  name="username"
                  defaultValue={user.username}
                  error={state.fieldErrors?.username}
                />
                <TextField
                  label="Bio"
                  name="bio"
                  defaultValue={user.bio ?? ""}
                  error={state.fieldErrors?.bio}
                  multiline
                />

                {state.formError ? (
                  <p role="alert" className="text-[15px] text-x-red">
                    {state.formError}
                  </p>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
