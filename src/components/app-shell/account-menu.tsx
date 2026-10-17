"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { Avatar } from "@/components/ui/avatar";
import { MoreIcon } from "@/components/ui/icons";

type AccountMenuProps = {
  user: { username: string; displayName: string; avatarUrl: string | null };
  logoutAction: () => Promise<void>;
  variant?: "sidebar" | "mobile";
};

export function AccountMenu({ user, logoutAction, variant = "sidebar" }: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const isSidebar = variant === "sidebar";

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      {isOpen && (
        <div
          id={menuId}
          className={`absolute z-40 w-[300px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-x-bg py-3 shadow-x-popover ${
            isSidebar ? "bottom-full left-0 mb-3" : "top-full left-0 mt-2"
          }`}
        >
          <LogoutButton action={logoutAction} label={`Log out @${user.username}`} />
        </div>
      )}

      <button
        type="button"
        aria-label="Account menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => setIsOpen((open) => !open)}
        className={`flex items-center gap-3 rounded-full transition-colors hover:bg-x-hover ${
          isSidebar ? "w-full p-3" : "p-0"
        }`}
      >
        <Avatar user={user} size={isSidebar ? 40 : 32} />
        {isSidebar && (
          <>
            <span className="hidden min-w-0 flex-1 text-left leading-5 xl:block">
              <span className="block truncate text-[15px] font-bold">{user.displayName}</span>
              <span className="block truncate text-[15px] text-x-muted">@{user.username}</span>
            </span>
            <MoreIcon className="hidden size-5 xl:block" />
          </>
        )}
      </button>
    </div>
  );
}
