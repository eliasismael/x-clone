import Link from "next/link";
import { XLogo } from "@/components/ui/icons";

// X's logged-out landing page
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex p-8 pb-0 lg:flex-1 lg:items-center lg:justify-center lg:p-8">
        <XLogo className="h-12 w-auto lg:h-auto lg:w-full lg:max-w-[380px] lg:p-8" />
      </div>

      <div className="flex flex-col justify-center p-8 lg:flex-1 lg:p-4">
        <h1 className="my-10 text-[40px] leading-[48px] font-extrabold tracking-tight sm:my-12 sm:text-[64px] sm:leading-[84px]">
          Happening now
        </h1>
        <h2 className="mb-8 text-[23px] leading-7 font-extrabold sm:text-[31px] sm:leading-9">Join today.</h2>

        <div className="w-full max-w-[300px]">
          <Link
            href="/register"
            className="flex h-10 items-center justify-center rounded-full bg-x-blue text-[15px] font-bold text-white transition-colors hover:bg-x-blue-hover"
          >
            Create account
          </Link>
          <p className="mt-2 text-[11px] leading-3 text-x-muted">
            A Twitter/X clone built with Next.js, Prisma, and PostgreSQL.
          </p>

          <h3 className="mt-10 mb-5 text-[17px] font-bold">Already have an account?</h3>
          <Link
            href="/login"
            className="flex h-10 items-center justify-center rounded-full border border-x-banner text-[15px] font-bold text-x-blue transition-colors hover:bg-x-blue/10"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
