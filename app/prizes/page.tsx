import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { redirect } from "next/navigation";
import { PrizeCard } from "@/components/prize-card";
import { categoryStyles } from "@/lib/nobel/categories";
import { getPrizesPage } from "@/lib/nobel/data";
import type { NobelCategory } from "@/lib/nobel/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nobel Prizes",
  description: "Browse Nobel Prizes by category and year.",
};
export const instant = false;

const PAGE_SIZE = 18;
const categories: Array<{ value: NobelCategory | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "phy", label: "Physics" },
  { value: "che", label: "Chemistry" },
  { value: "med", label: "Medicine" },
  { value: "lit", label: "Literature" },
  { value: "pea", label: "Peace" },
  { value: "eco", label: "Economics" },
];

export default async function PrizesPage({
  searchParams,
}: PageProps<"/prizes">) {
  const query = await searchParams;
  const requestedCategory =
    typeof query.category === "string" ? query.category : "all";
  const selected = categories.some((item) => item.value === requestedCategory)
    ? requestedCategory
    : "all";
  const category = selected === "all" ? undefined : (selected as NobelCategory);
  const year =
    typeof query.year === "string" && /^\d{4}$/.test(query.year)
      ? query.year
      : undefined;
  const requestedPage =
    typeof query.page === "string" ? Number.parseInt(query.page, 10) : 1;
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const result = await getPrizesPage({
    limit: PAGE_SIZE,
    offset: (currentPage - 1) * PAGE_SIZE,
    category,
    year,
    sort: "desc",
  });
  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));

  if (result.total > 0 && currentPage > totalPages) {
    redirect(prizesHref({ page: totalPages, category, year }));
  }

  const firstResult = result.total ? result.offset + 1 : 0;
  const lastResult = Math.min(
    result.offset + result.prizes.length,
    result.total,
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-5 sm:px-8">
      <div className="max-w-4xl">
        <h1 className="font-heading text-5xl font-semibold tracking-tight sm:text-6xl">
          Nobel Prizes
        </h1>
        <p className="mt-5 text-md leading-8 text-muted-foreground">
          Browse landmark contributions to humanity, from the first awards in
          1901 to the present day.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-y border-black/10 py-5 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          <Filter className="mr-2 size-4 shrink-0 text-muted-foreground" />
          {categories.map((item) => (
            <Link
              key={item.value}
              href={prizesHref({
                category: item.value === "all" ? undefined : item.value,
                year,
              })}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1.5 font-sans text-xs font-semibold transition",
                item.value === "all"
                  ? selected === "all"
                    ? "border-[#8b6422] bg-[#8b6422] text-white"
                    : "border-black/10 bg-white/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  : selected === item.value
                    ? categoryStyles[item.value].filterActive
                    : "border-black/10 bg-white/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <form className="flex items-center gap-2 font-sans text-sm">
          {category && <input type="hidden" name="category" value={category} />}
          <label htmlFor="year" className="text-muted-foreground">
            Year
          </label>
          <input
            id="year"
            name="year"
            defaultValue={year}
            inputMode="numeric"
            pattern="[0-9]{4}"
            placeholder="e.g. 2024"
            className="h-9 w-28 rounded-lg border bg-white/50 px-3 outline-none focus:border-[#8b6422] dark:bg-white/5"
          />
          <button className="h-9 rounded-lg bg-[#292d28] px-4 text-white dark:bg-primary dark:text-primary-foreground">
            Apply
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-col gap-2 font-sans text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          {category
            ? `${categories.find((item) => item.value === category)?.label} prizes`
            : "All Nobel Prizes"}
          {year ? ` awarded in ${year}` : ""}
        </p>
        <p>
          Showing {firstResult}–{lastResult} of{" "}
          {result.total.toLocaleString("en")}
        </p>
      </div>

      {result.prizes.length ? (
        <>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {result.prizes.map((prize) => (
              <PrizeCard
                key={`${prize.awardYear}-${prize.category.en}`}
                prize={prize}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            category={category}
            year={year}
          />
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          No prizes found for these filters.
        </div>
      )}
    </main>
  );
}

function Pagination({
  currentPage,
  totalPages,
  category,
  year,
}: {
  currentPage: number;
  totalPages: number;
  category?: NobelCategory;
  year?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-black/10 pt-8 font-sans dark:border-white/10"
      aria-label="Nobel Prize pages"
    >
      <PageLink
        href={prizesHref({ page: currentPage - 1, category, year })}
        disabled={currentPage === 1}
        label="Previous"
      >
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline">Previous</span>
      </PageLink>

      {paginationItems(currentPage, totalPages).map((item) =>
        typeof item === "number" ? (
          <PageLink
            key={item}
            href={prizesHref({ page: item, category, year })}
            active={item === currentPage}
            label={`Page ${item}`}
          >
            {item}
          </PageLink>
        ) : (
          <span
            key={item}
            className="grid size-9 place-items-center text-muted-foreground"
            aria-hidden="true"
          >
            …
          </span>
        ),
      )}

      <PageLink
        href={prizesHref({ page: currentPage + 1, category, year })}
        disabled={currentPage === totalPages}
        label="Next"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="size-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  label,
  children,
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const classes = cn(
    "inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-sm font-semibold transition",
    active &&
      "border-[#8b6422] bg-[#8b6422] text-white dark:border-primary dark:bg-primary dark:text-primary-foreground",
    !active &&
      !disabled &&
      "border-black/10 bg-white/40 hover:border-[#b78a3d]/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
    disabled &&
      "pointer-events-none border-black/5 text-muted-foreground/40 dark:border-white/5",
  );

  if (disabled)
    return (
      <span className={classes} aria-disabled="true">
        {children}
      </span>
    );
  return (
    <Link
      href={href}
      className={classes}
      aria-label={label}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

function prizesHref({
  page = 1,
  category,
  year,
}: {
  page?: number;
  category?: NobelCategory;
  year?: string;
}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (year) params.set("year", year);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/prizes?${search}` : "/prizes";
}

function paginationItems(
  current: number,
  total: number,
): Array<number | string> {
  const pages = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
  const items: Array<number | string> = [];

  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1)
      items.push(`ellipsis-${page}`);
    items.push(page);
  });

  return items;
}
