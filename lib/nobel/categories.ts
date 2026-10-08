import type { NobelCategory } from "./types";

export const categoryStyles: Record<NobelCategory, {
  accent: string;
  filterActive: string;
}> = {
  phy: {
    accent: "bg-amber-600",
    filterActive: "border-amber-600 bg-amber-600 text-white dark:border-amber-500 dark:bg-amber-500 dark:text-amber-950",
  },
  che: {
    accent: "bg-emerald-700",
    filterActive: "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-emerald-950",
  },
  med: {
    accent: "bg-red-800",
    filterActive: "border-red-800 bg-red-800 text-white dark:border-red-500 dark:bg-red-500 dark:text-white",
  },
  lit: {
    accent: "bg-rose-800",
    filterActive: "border-rose-800 bg-rose-800 text-white dark:border-rose-500 dark:bg-rose-500 dark:text-white",
  },
  pea: {
    accent: "bg-blue-700",
    filterActive: "border-blue-700 bg-blue-700 text-white dark:border-blue-500 dark:bg-blue-500 dark:text-white",
  },
  eco: {
    accent: "bg-sky-700",
    filterActive: "border-sky-700 bg-sky-700 text-white dark:border-sky-500 dark:bg-sky-500 dark:text-sky-950",
  },
};
