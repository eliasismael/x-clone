"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfileAction, type UpdateProfileActionState } from "./actions";

const initialState: UpdateProfileActionState = {};

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {pending ? "Saving..." : "Save profile"}
    </button>
  );
}

type EditProfileFormProps = {
  displayName: string;
  username: string;
  bio: string | null;
};

export function EditProfileForm({ displayName, username, bio }: EditProfileFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(updateProfileAction, initialState);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        Edit profile
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">Edit profile</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Update your public identity and upload a profile picture for your account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <form action={formAction} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Display name</span>
                <input
                  name="displayName"
                  defaultValue={displayName}
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
                {state.fieldErrors?.displayName ? (
                  <span className="text-sm font-normal text-rose-600">{state.fieldErrors.displayName}</span>
                ) : null}
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Username</span>
                <input
                  name="username"
                  defaultValue={username}
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
                {state.fieldErrors?.username ? (
                  <span className="text-sm font-normal text-rose-600">{state.fieldErrors.username}</span>
                ) : null}
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Bio</span>
                <textarea
                  name="bio"
                  rows={4}
                  defaultValue={bio ?? ""}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
                {state.fieldErrors?.bio ? (
                  <span className="text-sm font-normal text-rose-600">{state.fieldErrors.bio}</span>
                ) : null}
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Avatar</span>
                <input
                  name="avatar"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                />
                <span className="text-xs text-slate-500">PNG, JPG, or WebP up to 2 MB.</span>
                {state.fieldErrors?.avatar ? (
                  <span className="text-sm font-normal text-rose-600">{state.fieldErrors.avatar}</span>
                ) : null}
              </label>

              {state.formError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {state.formError}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <SaveButton />
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
