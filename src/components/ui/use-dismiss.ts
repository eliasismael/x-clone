import { useEffect, type RefObject } from "react";

// Closes a popover on outside click or Escape while it is open
export function useDismiss(ref: RefObject<HTMLElement | null>, isOpen: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) onDismiss();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onDismiss();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, isOpen, onDismiss]);
}
