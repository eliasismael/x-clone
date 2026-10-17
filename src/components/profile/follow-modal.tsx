"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { CloseIcon } from "@/components/ui/icons";

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
      className="m-auto w-full max-w-[600px] overflow-hidden rounded-2xl bg-x-bg p-0 text-x-text backdrop:bg-x-backdrop"
    >
      {/* Header */}
      <div className="flex h-[53px] items-center gap-8 border-b border-x-border px-2">
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-x-hover"
          aria-label="Close"
        >
          <CloseIcon className="size-5" strokeWidth={2} />
        </button>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      {/* User list */}
      <div className="max-h-[70vh] overflow-y-auto">
        {users.length === 0 ? (
          <p className="px-8 py-10 text-center text-[15px] text-x-muted">No users yet.</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <Link
                  href={`/users/${user.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-x-row-hover"
                >
                  <Avatar user={user} size={40} />
                  <div className="min-w-0 leading-5">
                    <p className="truncate text-[15px] font-bold">{user.displayName}</p>
                    <p className="truncate text-[15px] text-x-muted">@{user.username}</p>
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
