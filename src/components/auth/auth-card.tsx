import Link from "next/link";
import type { ReactNode } from "react";
import { CloseIcon, XLogo } from "@/components/ui/icons";

type AuthCardProps = {
  title: string;
  children: ReactNode;
};

// X's sign-in flow: a modal over a dimmed backdrop on desktop, full screen on mobile
export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <main className="flex min-h-screen justify-center bg-x-bg sm:items-center sm:bg-x-backdrop sm:py-10">
      <div className="w-full max-w-[600px] bg-x-bg pb-12 sm:rounded-2xl">
        <div className="relative flex h-[53px] items-center justify-center px-2">
          <Link
            href="/"
            aria-label="Close"
            className="absolute left-2 flex size-9 items-center justify-center rounded-full transition-colors hover:bg-x-hover"
          >
            <CloseIcon className="size-5" strokeWidth={2} />
          </Link>
          <XLogo className="size-8" />
        </div>
        <div className="mx-auto max-w-[440px] px-8">
          <h1 className="my-5 text-[31px] leading-9 font-extrabold">{title}</h1>
          {children}
        </div>
      </div>
    </main>
  );
}

export function AuthSubmitButton({ pending, label, pendingLabel }: { pending: boolean; label: string; pendingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 h-[52px] w-full rounded-full bg-x-inverse-bg text-[17px] font-bold text-x-inverse-text transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function AuthFormError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p role="alert" className="rounded-[4px] bg-x-red/10 px-3 py-2 text-[15px] text-x-red">
      {message}
    </p>
  );
}
