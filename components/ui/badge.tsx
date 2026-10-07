import type * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em]", className)} {...props} />;
}
