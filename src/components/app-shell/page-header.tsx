import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeftIcon } from "@/components/ui/icons";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  children?: ReactNode;
};

export function PageHeader({ title, subtitle, backHref, children }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-x-border bg-x-header backdrop-blur-md">
      <div className="flex min-h-[53px] items-center gap-8 px-4">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Back"
            className="-ml-2 flex size-9 items-center justify-center rounded-full transition-colors hover:bg-x-hover"
          >
            <ArrowLeftIcon className="size-5" strokeWidth={2} />
          </Link>
        )}
        <div className="min-w-0 py-1">
          <h1 className="truncate text-xl leading-6 font-bold">{title}</h1>
          {subtitle && <p className="truncate text-[13px] leading-4 text-x-muted">{subtitle}</p>}
        </div>
      </div>
      {children}
    </header>
  );
}
