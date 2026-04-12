"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { buildAvatarUrl } from "@/lib/avatar";

export type FollowUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

type FollowModalProps = {
  title: string;
  users: FollowUser[];
  onClose: () => void;
};

export function FollowModal({ title, users, onClose }: FollowModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === ref.current) onClose();
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto w-full max-w-sm rounded-[28px] border border-slate-200 bg-white p-0 shadow-xl backdrop:bg-black/40"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>

      {/* User list */}
      <div className="max-h-80 overflow-y-auto">
        {users.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">No users yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {users.map((user) => (
              <li key={user.id}>
                <Link
                  href={`/users/${user.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50"
                >
                  <Image
                    src={user.avatarUrl ?? buildAvatarUrl(user.username)}
                    alt={`${user.displayName} avatar`}
                    width={36}
                    height={36}
                    className="size-9 shrink-0 rounded-full border border-slate-200 bg-slate-50"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {user.displayName}
                    </p>
                    <p className="truncate text-xs text-slate-500">@{user.username}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </dialog>
  );
}
