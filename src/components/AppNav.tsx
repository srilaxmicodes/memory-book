"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/home", label: "Home" },
  { href: "/add", label: "Add" },
  { href: "/memories", label: "Memories" },
  { href: "/timeline", label: "Timeline" },
  { href: "/search", label: "Search" },
  { href: "/favorites", label: "Favorites" },
  { href: "/stats", label: "Stats" },
];

export function AppNav() {
  const pathname = usePathname();
  const { data } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/home" className="font-display text-2xl font-semibold text-sree">
          Memory Book
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  active ? "bg-white text-sree shadow-card" : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden sm:inline text-muted">
            Hi, {data?.user?.displayName}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-full bg-ink px-3 py-1.5 text-white"
          >
            Log out
          </button>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-full bg-white px-3 py-1 text-sm text-muted shadow-card"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
