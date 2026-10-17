"use client";

import { useCallback, useRef, useState } from "react";
import { MoreIcon, TrashIcon, UserMinusIcon, UserPlusIcon } from "@/components/ui/icons";
import { useDismiss } from "@/components/ui/use-dismiss";
import { useFollowToggle } from "@/components/user/follow-button";

const itemClass =
  "flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] font-bold transition-colors hover:bg-x-row-hover disabled:opacity-60";

type TweetMenuProps = {
  author: { id: string; username: string };
  isOwnTweet: boolean;
  isFollowing: boolean;
  deleteAction: () => Promise<void>;
};

export function TweetMenu({ author, isOwnTweet, isFollowing, deleteAction }: TweetMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  const follow = useFollowToggle(author.id, isFollowing);

  useDismiss(containerRef, isOpen, closeMenu);

  return (
    <div ref={containerRef} className="relative -my-1.5 -mr-2">
      <button
        type="button"
        aria-label="More"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex size-[34px] items-center justify-center rounded-full text-x-muted transition-colors hover:bg-x-blue/10 hover:text-x-blue"
      >
        <MoreIcon className="size-[18px]" />
      </button>

      {isOpen && (
        <div className="absolute top-0 right-0 z-30 min-w-[260px] overflow-hidden rounded-xl bg-x-bg py-1 shadow-x-popover">
          {isOwnTweet ? (
            <form action={deleteAction}>
              <button type="submit" className={`${itemClass} text-x-red`}>
                <TrashIcon className="size-[18px]" />
                Delete
              </button>
            </form>
          ) : (
            <button
              type="button"
              disabled={follow.isPending}
              onClick={() => {
                follow.toggle();
                closeMenu();
              }}
              className={itemClass}
            >
              {follow.isFollowing ? (
                <UserMinusIcon className="size-[18px]" />
              ) : (
                <UserPlusIcon className="size-[18px]" />
              )}
              {follow.isFollowing ? `Unfollow @${author.username}` : `Follow @${author.username}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
