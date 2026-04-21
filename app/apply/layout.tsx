import Link from "next/link";
import { Flame } from "lucide-react";

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-90"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gradient shadow-sm">
              <Flame className="h-4 w-4 text-accent-foreground" strokeWidth={2.5} />
            </span>
            <span className="font-display text-base font-bold tracking-tight">
              FireDoor <span className="text-accent">Network</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to home
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
