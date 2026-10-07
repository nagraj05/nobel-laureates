import Link from "next/link";
import { Landmark } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/8 bg-[#f8f4ea]/90 backdrop-blur-xl dark:border-white/10 dark:bg-background/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 min-[400px]:px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 min-[400px]:gap-3" aria-label="The Nobel Archive home">
          <span className="grid size-8 place-items-center rounded-full border border-[#aa7c2c]/30 bg-[#b78a3d]/10 text-[#815d20] dark:text-primary min-[400px]:size-9">
            <Landmark className="size-4" />
          </span>
          <span className="hidden font-heading text-sm font-semibold uppercase tracking-[0.18em] min-[390px]:inline">The Nobel Archive</span>
        </Link>
        <nav className="flex min-w-0 items-center gap-0.5 font-sans text-xs min-[400px]:gap-1 min-[400px]:text-sm" aria-label="Primary navigation">
          <Link href="/prizes" className="rounded-lg px-2 py-2 text-muted-foreground transition hover:bg-black/5 hover:text-foreground dark:hover:bg-white/8 min-[400px]:px-3">Prizes</Link>
          <Link href="/laureates" className="rounded-lg px-2 py-2 text-muted-foreground transition hover:bg-black/5 hover:text-foreground dark:hover:bg-white/8 min-[400px]:px-3"><span className="min-[420px]:hidden">People</span><span className="hidden min-[420px]:inline">Laureates</span></Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
