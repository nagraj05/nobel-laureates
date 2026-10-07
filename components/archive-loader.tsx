import { Award, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type ArchiveLoaderProps = {
  mode?: "page" | "section";
  label?: string;
  count?: number;
  compact?: boolean;
};

export function ArchiveLoader({
  mode = "page",
  label = "Opening the Nobel Archive",
  count = 6,
  compact = false,
}: ArchiveLoaderProps) {
  const isPage = mode === "page";

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isPage ? "min-h-[calc(100vh-4rem)] px-5 py-16 sm:px-8 sm:py-24" : "py-2",
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {isPage && <div className="pointer-events-none absolute inset-0 nobel-grid opacity-25" />}
      <div className={cn("relative mx-auto", isPage && "max-w-7xl")}>
        <div className={cn("flex items-center", isPage ? "flex-col text-center" : "mb-6 gap-4")}>
          <NobelSeal small={!isPage} />
          <div className={cn(isPage && "mt-6")}>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8b6422] dark:text-primary">
              Nobel Prize archive
            </p>
            <p className={cn("font-heading font-semibold", isPage ? "mt-2 text-2xl sm:text-3xl" : "mt-1 text-base")}>
              {label}
            </p>
          </div>
        </div>

        {isPage && (
          <div className="mx-auto mt-5 h-1 w-36 overflow-hidden rounded-full bg-black/8 dark:bg-white/10">
            <div className="h-full w-1/2 animate-[archive-progress_1.4s_ease-in-out_infinite] rounded-full bg-[#9a7028] dark:bg-primary" />
          </div>
        )}

        <div className={cn("grid gap-5 md:grid-cols-2 lg:grid-cols-3", isPage ? "mt-14" : "mt-0")} aria-hidden="true">
          {Array.from({ length: count }, (_, index) => (
            <LoaderCard key={index} compact={compact} delay={index * 90} />
          ))}
        </div>
      </div>
      <span className="sr-only">{label}. Please wait.</span>
    </div>
  );
}

function NobelSeal({ small }: { small: boolean }) {
  return (
    <div className={cn("relative grid shrink-0 place-items-center", small ? "size-12" : "size-20")} aria-hidden="true">
      <div className="absolute inset-0 animate-[spin_7s_linear_infinite] rounded-full border border-dashed border-[#9a7028]/55 dark:border-primary/60" />
      <div className="absolute inset-[5px] rounded-full border border-[#9a7028]/20 bg-[#b78a3d]/8 dark:border-primary/20 dark:bg-primary/8" />
      <div className="absolute inset-[10px] grid place-items-center rounded-full bg-[#fffdf8] text-[#8b6422] shadow-sm dark:bg-card dark:text-primary">
        <Award className={small ? "size-4" : "size-6"} />
      </div>
      <Sparkles className={cn("absolute -right-1 -top-1 animate-pulse text-[#9a7028] dark:text-primary", small ? "size-3" : "size-4")} />
    </div>
  );
}

function LoaderCard({ compact, delay }: { compact: boolean; delay: number }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/8 bg-white/45 p-6 dark:border-white/10 dark:bg-card/60",
        compact ? "h-64" : "h-80",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className="size-14 animate-pulse rounded-full bg-black/8 dark:bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-2/3 animate-pulse rounded-md bg-black/8 dark:bg-white/10" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-black/6 dark:bg-white/8" />
        </div>
      </div>
      <div className="my-6 h-px bg-black/6 dark:bg-white/8" />
      <div className="space-y-3">
        <div className="h-3 w-full animate-pulse rounded bg-black/6 dark:bg-white/8" />
        <div className="h-3 w-11/12 animate-pulse rounded bg-black/6 dark:bg-white/8" />
        <div className="h-3 w-3/5 animate-pulse rounded bg-black/6 dark:bg-white/8" />
      </div>
      <div className="mt-8 flex items-center justify-between">
        <div className="h-6 w-24 animate-pulse rounded-full bg-black/7 dark:bg-white/9" />
        <div className="h-3 w-10 animate-pulse rounded bg-black/6 dark:bg-white/8" />
      </div>
    </div>
  );
}
