import "server-only";

import { unstable_rethrow } from "next/navigation";
import { cache } from "react";
import type {
  Laureate,
  LaureateResponse,
  NobelCategory,
  NobelPrize,
  PrizeResponse,
} from "./types";

const FALLBACK_PRIZES = "https://api.nobelprize.org/2.1/nobelPrizes";
const FALLBACK_LAUREATES = "https://api.nobelprize.org/2.1/laureates";
const LAUREATE_DETAILS = "http://api.nobelprize.org/2.1/laureate";

type WikipediaSummary = {
  thumbnail?: { source?: string; width?: number; height?: number };
  content_urls?: { desktop?: { page?: string } };
};

export type LaureatePortrait = {
  src: string;
  width: number;
  height: number;
  pageUrl?: string;
};

function apiUrl(
  base: string | undefined,
  params: Record<string, string | undefined>,
) {
  const url = new URL(base || "https://api.nobelprize.org/2.1");

  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  return url;
}

async function request<T>(url: URL): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 60 * 12 },
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch (error) {
    unstable_rethrow(error);
    return null;
  }
}

export async function getPrizes(
  options: {
    limit?: number;
    offset?: number;
    year?: string;
    category?: NobelCategory;
    sort?: "asc" | "desc";
  } = {},
): Promise<NobelPrize[]> {
  const page = await getPrizesPage(options);
  return page.prizes;
}

export async function getPrizesPage(
  options: {
    limit?: number;
    offset?: number;
    year?: string;
    category?: NobelCategory;
    sort?: "asc" | "desc";
  } = {},
) {
  const url = apiUrl(process.env.API_NOBEL_PRIZES || FALLBACK_PRIZES, {
    limit: String(options.limit ?? 24),
    offset: String(options.offset ?? 0),
    nobelPrizeYear: options.year,
    nobelPrizeCategory: options.category,
    sort: options.sort ?? "desc",
  });
  const data = await request<PrizeResponse>(url);
  const prizes = data?.nobelPrizes ?? [];

  return {
    prizes,
    total: data?.meta?.count ?? prizes.length,
    limit: data?.meta?.limit ?? options.limit ?? 24,
    offset: data?.meta?.offset ?? options.offset ?? 0,
  };
}

export async function getLaureates(
  options: {
    limit?: number;
    offset?: number;
    name?: string;
  } = {},
): Promise<Laureate[]> {
  const page = await getLaureatesPage(options);
  return page.laureates;
}

export async function getLaureatesPage(
  options: {
    limit?: number;
    offset?: number;
    name?: string;
  } = {},
) {
  const url = apiUrl(process.env.API_LAUREATES || FALLBACK_LAUREATES, {
    limit: String(options.limit ?? 24),
    offset: String(options.offset ?? 0),
    name: options.name,
  });
  const data = await request<LaureateResponse>(url);
  const laureates = data?.laureates ?? [];

  return {
    laureates,
    total: data?.meta?.count ?? laureates.length,
    limit: data?.meta?.limit ?? options.limit ?? 24,
    offset: data?.meta?.offset ?? options.offset ?? 0,
  };
}

export const getLaureate = cache(
  async (id: string): Promise<Laureate | null> => {
    // Use the compact v2.1 detail endpoint instead of caching the full collection.
    const detailUrl = new URL(`${LAUREATE_DETAILS}/${encodeURIComponent(id)}`);
    const laureates = await request<Laureate[]>(detailUrl);
    return laureates?.[0] ?? null;
  },
);

export const getLaureatePortrait = cache(
  async (slug?: string): Promise<LaureatePortrait | null> => {
    if (!slug) return null;

    try {
      const url = new URL(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`,
      );
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Api-User-Agent": "TheNobelArchive/1.0 (educational archive)",
        },
        next: { revalidate: 60 * 60 * 24 * 7 },
      });

      if (!response.ok) return null;
      const summary = (await response.json()) as WikipediaSummary;
      const image = summary.thumbnail;
      if (!image?.source || !image.width || !image.height) return null;

      return {
        src: image.source,
        width: image.width,
        height: image.height,
        pageUrl: summary.content_urls?.desktop?.page,
      };
    } catch (error) {
      unstable_rethrow(error);
      return null;
    }
  },
);

export function laureateName(laureate: Laureate | PrizeLaureateLike) {
  return (
    laureate.knownName?.en ||
    laureate.orgName?.en ||
    laureate.fullName?.en ||
    "Unknown laureate"
  );
}

type PrizeLaureateLike = Pick<Laureate, "knownName" | "orgName" | "fullName">;

export function categoryCode(name = ""): NobelCategory | undefined {
  const value = name.toLowerCase();
  if (value.includes("chem")) return "che";
  if (value.includes("economic")) return "eco";
  if (value.includes("liter")) return "lit";
  if (value.includes("peace")) return "pea";
  if (value.includes("physiology") || value.includes("medicine")) return "med";
  if (value.includes("phys")) return "phy";
}
