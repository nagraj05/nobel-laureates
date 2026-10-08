export type LocalizedText = {
  en?: string;
  no?: string;
  se?: string;
};

export type LinkedLocalizedText = LocalizedText & {
  sameAs?: string[];
  latitude?: string;
  longitude?: string;
};

export type ApiLink = {
  rel?: string;
  href: string;
  title?: string;
  action?: string;
  types?: string;
  class?: string[];
};

export type NobelCategory = "che" | "eco" | "lit" | "pea" | "phy" | "med";

export type PrizeLaureate = {
  id: string;
  knownName?: LocalizedText;
  orgName?: LocalizedText;
  fullName?: LocalizedText;
  motivation?: LocalizedText;
  portion?: string;
};

export type NobelPrize = {
  awardYear: string;
  category: LocalizedText;
  categoryFullName: LocalizedText;
  dateAwarded?: string;
  prizeAmount?: number;
  prizeAmountAdjusted?: number;
  laureates?: PrizeLaureate[];
};

export type Place = {
  city?: LocalizedText;
  country?: LocalizedText;
  cityNow?: LinkedLocalizedText;
  countryNow?: LinkedLocalizedText;
  continent?: LocalizedText;
  locationString?: LocalizedText;
};

export type Affiliation = {
  name?: LocalizedText;
  nameNow?: LocalizedText;
  city?: LocalizedText;
  country?: LocalizedText;
  cityNow?: LinkedLocalizedText;
  countryNow?: LinkedLocalizedText;
  continent?: LocalizedText;
  locationString?: LocalizedText;
};

export type LaureatePrize = {
  awardYear: string;
  category: LocalizedText;
  categoryFullName: LocalizedText;
  motivation?: LocalizedText;
  portion?: string;
  sortOrder?: string;
  dateAwarded?: string;
  prizeStatus?: string;
  prizeAmount?: number;
  prizeAmountAdjusted?: number;
  affiliations?: Affiliation[];
  links?: ApiLink[];
};

export type Laureate = {
  id: string;
  knownName?: LocalizedText;
  givenName?: LocalizedText;
  familyName?: LocalizedText;
  fullName?: LocalizedText;
  orgName?: LocalizedText;
  fileName?: string;
  gender?: string;
  birth?: { date?: string; year?: string; place?: Place };
  death?: { date?: string; year?: string; place?: Place };
  founded?: { date?: string; year?: string; place?: Place };
  nobelPrizes?: LaureatePrize[];
  wikipedia?: { slug?: string; english?: string };
  wikidata?: { id?: string; url?: string };
  sameAs?: string[];
  links?: ApiLink[];
  meta?: { terms?: string; license?: string; disclaimer?: string };
};

export type ApiMeta = {
  offset?: number;
  limit?: number;
  count?: number;
};

export type PrizeResponse = { nobelPrizes?: NobelPrize[]; meta?: ApiMeta };
export type LaureateResponse = { laureates?: Laureate[]; meta?: ApiMeta };
