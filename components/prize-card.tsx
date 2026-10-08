import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { categoryStyles } from "@/lib/nobel/categories";
import { categoryCode, laureateName } from "@/lib/nobel/data";
import type { NobelPrize } from "@/lib/nobel/types";

export function PrizeCard({ prize }: { prize: NobelPrize }) {
  const code = categoryCode(prize.category.en) ?? "phy";
  const motivation = prize.laureates?.find((item) => item.motivation?.en)
    ?.motivation?.en;
  return (
    <Card className="group flex h-full flex-col overflow-hidden border-black/10 bg-[#fffdf8] transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:border-white/10 dark:bg-card dark:hover:shadow-black/30">
      <div className={`h-1 ${categoryStyles[code].accent}`} />
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <Badge className="border-[#b78a3d]/25 bg-[#b78a3d]/8 text-[#79571f] dark:text-white">
            {prize.category.en}
          </Badge>
          <span className="font-heading text-2xl font-semibold text-[#997029] dark:text-primary">
            {prize.awardYear}
          </span>
        </div>
        {/* <h3 className="pt-3 font-heading text-xl font-semibold leading-snug">{prize.categoryFullName.en}</h3> */}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="line-clamp-3 flex-1 text-[15px] leading-7 text-muted-foreground">
          {motivation
            ? `“${motivation}”`
            : "A prize recognizing work of outstanding importance."}
        </p>
        <div className="mt-6 border-t border-black/8 pt-4 dark:border-white/10">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Laureates
          </p>
          <div className="mt-2 space-y-1 font-heading text-sm font-semibold">
            {prize.laureates?.map((laureate) => (
              <Link
                key={laureate.id}
                href={`/laureates/${laureate.id}`}
                className="flex items-center justify-between gap-2 hover:text-[#8b6422] dark:hover:text-primary"
              >
                {laureateName(laureate)}
                <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-60" />
              </Link>
            )) ?? <span>Not awarded</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
