import type * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return <input type={type} className={cn("h-11 w-full rounded-xl border bg-background px-4 font-sans text-sm shadow-xs outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/10", className)} {...props} />;
}
