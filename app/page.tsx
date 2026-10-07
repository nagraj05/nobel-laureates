import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Award, BookOpen, FlaskConical, HeartPulse, Landmark, Search, Scale, Sigma } from "lucide-react";
import { LaureateCard } from "@/components/laureate-card";
import { ArchiveLoader } from "@/components/archive-loader";
import { PrizeCard } from "@/components/prize-card";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLaureates, getPrizes } from "@/lib/nobel/data";
import { cn } from "@/lib/utils";

const categories = [
  { code: "phy", name: "Physics", icon: Sigma },
  { code: "che", name: "Chemistry", icon: FlaskConical },
  { code: "med", name: "Medicine", icon: HeartPulse },
  { code: "lit", name: "Literature", icon: BookOpen },
  { code: "pea", name: "Peace", icon: Landmark },
  { code: "eco", name: "Economic Sciences", icon: Scale },
] as const;

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-black/8 dark:border-white/10">
        <div className="absolute inset-0 nobel-grid opacity-35" />
        <div className="absolute -right-36 top-10 size-[34rem] rounded-full border border-[#b78a3d]/15" />
        <div className="absolute -right-16 top-32 size-[22rem] rounded-full border border-[#b78a3d]/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 min-[400px]:px-5 min-[400px]:py-20 sm:px-8 sm:py-28 lg:py-36">
          <div className="max-w-4xl">
            <p className="mb-6 flex items-center gap-3 font-sans text-xs font-semibold uppercase tracking-[0.24em] text-[#8b6422] dark:text-primary"><Award className="size-4" /> Since 1901</p>
            <h1 className="text-balance font-heading text-4xl font-semibold leading-[1.05] tracking-[-0.035em] min-[400px]:text-5xl sm:text-7xl lg:text-[5.5rem]">
              Ideas that changed <span className="italic text-[#9a7028] dark:text-primary">the world.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground min-[400px]:text-lg min-[400px]:leading-8 sm:mt-7 sm:text-xl">
              Explore the prizes, people, and discoveries honored by the Nobel Prize across more than a century of human achievement.
            </p>
            <form action="/laureates" className="mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-black/10 bg-white/75 p-2 shadow-2xl shadow-black/8 backdrop-blur min-[400px]:gap-3 sm:mt-10 sm:flex-row dark:border-white/12 dark:bg-white/6 dark:shadow-black/30">
              <label className="relative flex-1">
                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <span className="sr-only">Search laureates</span>
                <Input name="q" className="h-12 border-0 bg-transparent pl-11 shadow-none focus:ring-0" placeholder="Search a laureate by name…" />
              </label>
              <button className={cn(buttonVariants({ size: "lg" }), "h-12 bg-[#8b6422] px-6 text-white hover:bg-[#70501a]")}>Search archive</button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 min-[400px]:px-5 min-[400px]:py-16 sm:px-8 sm:py-20">
        <div className="mb-8"><p className="eyebrow">Explore by discipline</p><h2 className="section-title">Six fields of achievement</h2></div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 min-[300px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 dark:border-white/10 dark:bg-white/10">
          {categories.map(({ code, name, icon: Icon }) => (
            <Link key={code} href={`/prizes?category=${code}`} className="group bg-[#fffdf8] p-4 transition hover:bg-[#f2ead8] min-[400px]:p-5 sm:p-6 dark:bg-card dark:hover:bg-muted">
              <Icon className="size-5 text-[#9a7028] dark:text-primary" />
              <span className="mt-8 flex items-end justify-between gap-2 font-heading text-sm font-semibold sm:text-base">{name}<ArrowRight className="size-4 shrink-0 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-black/8 bg-[#efe9dc] dark:border-white/10 dark:bg-muted">
        <div className="mx-auto max-w-7xl px-4 py-12 min-[400px]:px-5 min-[400px]:py-16 sm:px-8 sm:py-24">
          <div className="mb-9 flex items-end justify-between gap-6">
            <div><p className="eyebrow">From the archive</p><h2 className="section-title">Recent Nobel Prizes</h2></div>
            <Link href="/prizes" className="hidden items-center gap-2 font-sans text-sm font-semibold text-[#79571f] sm:flex dark:text-primary">View all prizes <ArrowRight className="size-4" /></Link>
          </div>
          <Suspense fallback={<ArchiveLoader mode="section" label="Gathering recent prizes" count={6} />}>
            <RecentPrizes />
          </Suspense>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 min-[400px]:px-5 min-[400px]:py-16 sm:px-8 sm:py-24">
        <div className="mb-9 flex items-end justify-between gap-6">
          <div><p className="eyebrow">People & organisations</p><h2 className="section-title">Meet the laureates</h2></div>
          <Link href="/laureates" className="hidden items-center gap-2 font-sans text-sm font-semibold text-[#79571f] sm:flex dark:text-primary">Browse all laureates <ArrowRight className="size-4" /></Link>
        </div>
        <Suspense fallback={<ArchiveLoader mode="section" label="Finding featured laureates" count={3} compact />}>
          <FeaturedLaureates />
        </Suspense>
      </section>
    </main>
  );
}

async function RecentPrizes() {
  const prizes = await getPrizes({ limit: 6, sort: "desc" });

  return prizes.length ? (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {prizes.map((prize) => <PrizeCard key={`${prize.awardYear}-${prize.category.en}`} prize={prize} />)}
    </div>
  ) : <DataUnavailable />;
}

async function FeaturedLaureates() {
  const laureates = await getLaureates({ limit: 3 });

  return laureates.length ? (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {laureates.map((laureate) => <LaureateCard key={laureate.id} laureate={laureate} />)}
    </div>
  ) : <DataUnavailable />;
}

function DataUnavailable() {
  return <div className="rounded-2xl border border-dashed border-black/15 p-10 text-center font-sans text-sm text-muted-foreground dark:border-white/15">The Nobel archive is temporarily unavailable. Please try again shortly.</div>;
}
