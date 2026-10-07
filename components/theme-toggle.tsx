"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const nextTheme = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", nextTheme === "dark");
    root.style.colorScheme = nextTheme;
    localStorage.setItem("nobel-theme", nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="grid size-8 shrink-0 place-items-center rounded-full border border-black/10 bg-white/45 text-foreground transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b78a3d] dark:border-white/12 dark:bg-white/5 dark:hover:bg-white/10 min-[400px]:size-9"
      aria-label="Toggle light and dark mode"
      title="Toggle light and dark mode"
    >
      <Moon className="size-4 dark:hidden" />
      <Sun className="hidden size-4 dark:block" />
    </button>
  );
}
