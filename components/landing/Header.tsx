"use client";

import Link from "next/link";
import { useState } from "react";
import { Flame, Menu, X } from "lucide-react";

const nav = [
  { label: "How it works", href: "#how" },
  { label: "Why join", href: "#why" },
  { label: "Trust", href: "#trust" },
  { label: "Directory", href: "#directory" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container mx-auto px-4 pt-4 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-primary/55 shadow-lg shadow-black/10 backdrop-blur-md">
          <nav className="flex h-14 items-center justify-between px-3 sm:px-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary-foreground transition-opacity hover:opacity-90"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-gradient shadow-accent-glow">
                <Flame className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-base font-bold tracking-tight sm:text-lg">
                FireDoor <span className="text-accent">Network</span>
              </span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <a
                href="#"
                className="rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-white/10"
              >
                Sign in
              </a>
              <Link
                href="/apply"
                className="rounded-lg bg-accent-gradient px-4 py-2 text-sm font-semibold text-accent-foreground shadow-accent-glow transition-opacity hover:opacity-95"
              >
                Become an Affiliate
              </Link>
            </div>

            <button
              type="button"
              className="rounded-lg p-2 text-primary-foreground transition-colors hover:bg-white/10 md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </nav>

          {open ? (
            <div className="border-t border-white/10 bg-primary/60 backdrop-blur-md md:hidden">
              <div className="flex flex-col gap-4 px-4 py-4">
                {nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-primary-foreground/80"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <Link
                  href="/apply"
                  className="w-full rounded-lg bg-accent-gradient py-3 text-center text-sm font-semibold text-accent-foreground shadow-accent-glow"
                  onClick={() => setOpen(false)}
                >
                  Become an Affiliate
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
