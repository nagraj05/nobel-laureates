import Link from "next/link";
import { Landmark } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/8 bg-[#f8f4ea]/90 backdrop-blur-xl dark:border-white/10 dark:bg-background/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="The Nobel Archive home">
          <span className="grid size-9 place-items-center rounded-full border border-[#aa7c2c]/30 bg-[#b78a3d]/10 text-[#815d20] dark:text-primary">
            <Landmark className="size-4" />
          </span>
          <span className="font-heading text-sm font-semibold uppercase tracking-[0.18em]">The Nobel Archive</span>
        </Link>
        <nav className="flex items-center gap-1 font-sans text-sm" aria-label="Primary navigation">
          <Link href="/prizes" className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-black/5 hover:text-foreground dark:hover:bg-white/8">Prizes</Link>
          <Link href="/laureates" className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-black/5 hover:text-foreground dark:hover:bg-white/8">Laureates</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
