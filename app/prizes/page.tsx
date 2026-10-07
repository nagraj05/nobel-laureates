import type { Metadata } from "next";
import Link from "next/link";
import { Filter } from "lucide-react";
import { PrizeCard } from "@/components/prize-card";
import { getPrizes } from "@/lib/nobel/data";
import type { NobelCategory } from "@/lib/nobel/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Nobel Prizes", description: "Browse Nobel Prizes by category and year." };
export const instant = false;

const categories: Array<{ value: NobelCategory | "all"; label: string }> = [
  { value: "all", label: "All" }, { value: "phy", label: "Physics" }, { value: "che", label: "Chemistry" },
  { value: "med", label: "Medicine" }, { value: "lit", label: "Literature" }, { value: "pea", label: "Peace" }, { value: "eco", label: "Economics" },
];

export default async function PrizesPage({ searchParams }: PageProps<"/prizes">) {
  const query = await searchParams;
  const selected = typeof query.category === "string" ? query.category : "all";
  const year = typeof query.year === "string" && /^\d{4}$/.test(query.year) ? query.year : undefined;
  const category = categories.some((item) => item.value === selected) && selected !== "all" ? selected as NobelCategory : undefined;
  const prizes = await getPrizes({ limit: 36, category, year, sort: "desc" });

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="max-w-3xl"><p className="eyebrow">The complete record</p><h1 className="font-heading text-5xl font-semibold tracking-tight sm:text-6xl">Nobel Prizes</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">Browse landmark contributions to humanity, from the first awards in 1901 to the present day.</p></div>
      <div className="mt-10 flex flex-col gap-4 border-y border-black/10 py-5 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          <Filter className="mr-2 size-4 shrink-0 text-muted-foreground" />
          {categories.map((item) => <Link key={item.value} href={item.value === "all" ? "/prizes" : `/prizes?category=${item.value}`} className={cn("whitespace-nowrap rounded-full border px-3 py-1.5 font-sans text-xs font-semibold transition", selected === item.value ? "border-[#8b6422] bg-[#8b6422] text-white dark:border-primary dark:bg-primary dark:text-primary-foreground" : "border-black/10 bg-white/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10")}>{item.label}</Link>)}
        </div>
        <form className="flex items-center gap-2 font-sans text-sm"><input type="hidden" name="category" value={selected} /><label htmlFor="year" className="text-muted-foreground">Year</label><input id="year" name="year" defaultValue={year} inputMode="numeric" pattern="[0-9]{4}" placeholder="e.g. 2024" className="h-9 w-28 rounded-lg border bg-white/50 px-3 outline-none focus:border-[#8b6422] dark:bg-white/5" /><button className="h-9 rounded-lg bg-[#292d28] px-4 text-white dark:bg-primary dark:text-primary-foreground">Apply</button></form>
      </div>
      <p className="mt-8 font-sans text-sm text-muted-foreground">Showing {prizes.length} {prizes.length === 1 ? "prize" : "prizes"}{year ? ` from ${year}` : ""}</p>
      {prizes.length ? <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{prizes.map((prize) => <PrizeCard key={`${prize.awardYear}-${prize.category.en}`} prize={prize} />)}</div> : <div className="mt-6 rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No prizes found for these filters.</div>}
    </main>
  );
}
