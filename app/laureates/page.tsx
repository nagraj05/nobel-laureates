import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { redirect } from "next/navigation";
import { LaureateCard } from "@/components/laureate-card";
import { Input } from "@/components/ui/input";
import { getLaureatesPage } from "@/lib/nobel/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Nobel Laureates", description: "Discover the people and organisations awarded a Nobel Prize." };
export const instant = false;

const PAGE_SIZE = 24;

export default async function LaureatesPage({ searchParams }: PageProps<"/laureates">) {
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q.trim() : "";
  const requestedPage = typeof query.page === "string" ? Number.parseInt(query.page, 10) : 1;
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const result = await getLaureatesPage({
    limit: PAGE_SIZE,
    offset: (currentPage - 1) * PAGE_SIZE,
    name: q || undefined,
  });
  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));

  if (result.total > 0 && currentPage > totalPages) {
    redirect(laureatesHref(totalPages, q));
  }

  const firstResult = result.total ? result.offset + 1 : 0;
  const lastResult = Math.min(result.offset + result.laureates.length, result.total);

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="grid items-end gap-8 lg:grid-cols-[1fr_28rem]">
        <div className="max-w-3xl">
          <p className="eyebrow">People & organisations</p>
          <h1 className="font-heading text-5xl font-semibold tracking-tight sm:text-6xl">Nobel Laureates</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">Meet the minds, voices, and institutions whose work has shaped our shared world.</p>
        </div>
        <form className="relative">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Search by name…" className="h-12 bg-white/60 pl-11 pr-24 dark:bg-white/5" />
          <button className="absolute right-2 top-2 h-8 rounded-lg bg-[#292d28] px-4 font-sans text-xs font-semibold text-white dark:bg-primary dark:text-primary-foreground">Search</button>
        </form>
      </div>

      <div className="mt-12 flex flex-col gap-2 border-t border-black/10 pt-7 font-sans text-sm text-muted-foreground dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <p>{q ? `Results for “${q}”` : "All Nobel laureates"}</p>
        <p>Showing {firstResult}–{lastResult} of {result.total.toLocaleString("en")}</p>
      </div>

      {result.laureates.length ? (
        <>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {result.laureates.map((laureate) => <LaureateCard key={laureate.id} laureate={laureate} />)}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} query={q} />
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No laureates matched your search.</div>
      )}
    </main>
  );
}

function Pagination({ currentPage, totalPages, query }: { currentPage: number; totalPages: number; query: string }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-black/10 pt-8 font-sans dark:border-white/10" aria-label="Laureate pages">
      <PageLink href={laureatesHref(currentPage - 1, query)} disabled={currentPage === 1} label="Previous">
        <ChevronLeft className="size-4" /><span className="hidden sm:inline">Previous</span>
      </PageLink>

      {paginationItems(currentPage, totalPages).map((item) =>
        typeof item === "number" ? (
          <PageLink key={item} href={laureatesHref(item, query)} active={item === currentPage} label={`Page ${item}`}>
            {item}
          </PageLink>
        ) : <span key={item} className="grid size-9 place-items-center text-muted-foreground" aria-hidden="true">…</span>
      )}

      <PageLink href={laureatesHref(currentPage + 1, query)} disabled={currentPage === totalPages} label="Next">
        <span className="hidden sm:inline">Next</span><ChevronRight className="size-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({ href, active, disabled, label, children }: { href: string; active?: boolean; disabled?: boolean; label: string; children: React.ReactNode }) {
  const classes = cn(
    "inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-sm font-semibold transition",
    active && "border-[#8b6422] bg-[#8b6422] text-white dark:border-primary dark:bg-primary dark:text-primary-foreground",
    !active && !disabled && "border-black/10 bg-white/40 hover:border-[#b78a3d]/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
    disabled && "pointer-events-none border-black/5 text-muted-foreground/40 dark:border-white/5",
  );

  if (disabled) return <span className={classes} aria-disabled="true">{children}</span>;
  return <Link href={href} className={classes} aria-label={label} aria-current={active ? "page" : undefined}>{children}</Link>;
}

function laureatesHref(page: number, query: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/laureates?${search}` : "/laureates";
}

function paginationItems(current: number, total: number): Array<number | string> {
  const pages = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
  const items: Array<number | string> = [];

  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) items.push(`ellipsis-${page}`);
    items.push(page);
  });

  return items;
}
