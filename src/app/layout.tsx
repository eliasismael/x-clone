import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "X Clone",
    template: "%s / X Clone",
  },
  description: "A Twitter/X clone built with Next.js, Prisma, and Postgres.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-x-bg text-x-text">{children}</body>
    </html>
  );
}
