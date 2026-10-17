"use client";

import { useFormStatus } from "react-dom";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="w-full px-4 py-3 text-left text-[15px] font-bold transition-colors hover:bg-x-row-hover disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Logging out..." : label}
    </button>
  );
}

export function LogoutButton({ action, label }: { action: () => Promise<void>; label: string }) {
  return (
    <form action={action}>
      <SubmitButton label={label} />
    </form>
  );
}
