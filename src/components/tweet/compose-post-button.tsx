"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { TweetCompose } from "@/components/tweet/tweet-compose";
import { CloseIcon, PlusIcon } from "@/components/ui/icons";

type ComposePostButtonProps = {
  user: { username: string; displayName: string; avatarUrl: string | null };
  variant: "sidebar" | "floating";
};

const triggerClass = {
  sidebar:
    "my-4 flex size-[52px] items-center justify-center rounded-full bg-x-inverse-bg text-x-inverse-text shadow-sm transition-opacity hover:opacity-90 xl:h-[52px] xl:w-[234px]",
  floating:
    "fixed right-4 bottom-[70px] z-30 flex size-14 items-center justify-center rounded-full bg-x-blue text-white shadow-lg transition-colors hover:bg-x-blue-hover sm:hidden",
};

export function ComposePostButton({ user, variant }: ComposePostButtonProps) {
  // The dialog stays mounted so the .x-modal CSS can animate both opening and closing
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  function openDialog() {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    dialog.querySelector("textarea")?.focus();
  }

  const closeDialog = useCallback(() => dialogRef.current?.close(), []);

  const handlePosted = useCallback(() => {
    closeDialog();
    // createTweetAction only revalidates /home; refresh whatever page we posted from
    router.refresh();
  }, [closeDialog, router]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) closeDialog();
  }

  return (
    <>
      <button type="button" aria-label="Post" onClick={openDialog} className={triggerClass[variant]}>
        <PlusIcon className={`size-6 ${variant === "sidebar" ? "xl:hidden" : ""}`} strokeWidth={2.25} />
        {variant === "sidebar" && <span className="hidden text-[17px] font-bold xl:inline">Post</span>}
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Compose post"
        onClick={handleBackdropClick}
        className="x-modal mx-auto mt-[5vh] w-full max-w-[600px] rounded-2xl bg-x-bg p-0 text-x-text max-sm:m-0 max-sm:h-full max-sm:max-h-none max-sm:max-w-none max-sm:rounded-none"
      >
        <div className="flex h-[53px] items-center px-2">
          <button
            type="button"
            aria-label="Close"
            onClick={closeDialog}
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-x-hover"
          >
            <CloseIcon className="size-5" strokeWidth={2} />
          </button>
        </div>
        <TweetCompose user={user} onPosted={handlePosted} />
      </dialog>
    </>
  );
}
