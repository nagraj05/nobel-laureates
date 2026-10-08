import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getLaureatePortrait, laureateName } from "@/lib/nobel/data";
import type { Laureate } from "@/lib/nobel/types";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export async function LaureateCard({ laureate }: { laureate: Laureate }) {
  const name = laureateName(laureate);
  const prize = laureate.nobelPrizes?.[0];
  const portrait = await getLaureatePortrait(laureate.wikipedia?.slug);
  const place =
    laureate.birth?.place?.countryNow?.en ||
    laureate.birth?.place?.country?.en ||
    laureate.founded?.place?.country?.en;

  return (
    <Card className="group overflow-hidden border-black/8 bg-[#fffdf8] transition-all duration-300 hover:-translate-y-1 hover:border-[#b78a3d]/35 hover:shadow-xl hover:shadow-black/[0.06] dark:border-white/10 dark:bg-card dark:hover:shadow-black/30">
      <CardContent className="flex min-h-72 flex-col p-6 sm:p-7">
        <div className="flex items-center gap-4">
          <div className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border border-[#b78a3d]/20 bg-[#b78a3d]/10 font-heading text-lg font-semibold text-[#79571f] shadow-sm transition-transform duration-300 group-hover:scale-[1.03] dark:text-primary">
            {portrait ? (
              <Image
                src={portrait.src}
                alt={`Portrait of ${name}`}
                fill
                sizes="64px"
                className="object-cover object-top"
              />
            ) : (
              initials(name)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-xl font-semibold leading-tight tracking-[-0.015em]">
              <Link
                href={`/laureates/${laureate.id}`}
                className="decoration-[#b78a3d]/50 underline-offset-4 transition-colors hover:text-[#8b6422] hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b78a3d] dark:hover:text-primary"
              >
                {name}
              </Link>
            </h3>
            <p className="mt-2 font-sans text-sm text-muted-foreground">
              {laureate.birth?.year || laureate.founded?.year || "—"}
              {laureate.death?.year ? `–${laureate.death.year}` : ""}
              {place ? ` · ${place}` : ""}
            </p>
          </div>
        </div>
        <div className="my-6 h-px bg-gradient-to-r from-[#b78a3d]/35 via-black/8 to-transparent dark:via-white/10" />
        <p className="line-clamp-3 flex-1 font-heading text-[15px] italic leading-7 text-foreground/70">
          {prize?.motivation?.en
            ? `“${prize.motivation.en}”`
            : "Explore this laureate’s Nobel Prize story."}
        </p>
        {prize && (
          <div className="mt-6 flex items-center justify-between border-t border-black/8 pt-5 dark:border-white/10">
            <Badge className="border-[#b78a3d]/20 bg-[#b78a3d]/8 text-[#79571f] dark:text-white">
              {prize.category.en}
            </Badge>
            <span className="font-sans text-xs font-semibold tabular-nums tracking-[0.12em] text-muted-foreground">
              {prize.awardYear}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
