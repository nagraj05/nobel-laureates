import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Building2,
  CalendarDays,
  CircleUserRound,
  Coins,
  ExternalLink,
  Globe2,
  MapPin,
  Share2,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import type { ApiLink, LaureatePrize } from "@/lib/nobel/types";
import {
  getLaureate,
  getLaureatePortrait,
  laureateName,
} from "@/lib/nobel/data";

export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/laureates/[id]">): Promise<Metadata> {
  const { id } = await params;
  const laureate = await getLaureate(id);
  return laureate
    ? {
        title: laureateName(laureate),
        description: laureate.nobelPrizes?.[0]?.motivation?.en,
      }
    : { title: "Laureate not found" };
}

export default async function LaureatePage({
  params,
}: PageProps<"/laureates/[id]">) {
  const { id } = await params;
  const laureate = await getLaureate(id);
  if (!laureate) notFound();

  const name = laureateName(laureate);
  const lifeEvent = laureate.birth ?? laureate.founded;
  const lifeLabel = laureate.birth ? "Born" : "Founded";
  const location = lifeEvent?.place?.locationString?.en;
  const currentCountry = lifeEvent?.place?.countryNow?.en;
  const historicalCountry = lifeEvent?.place?.country?.en;
  const isOrganisation = Boolean(laureate.orgName);
  const officialProfile = externalLink(laureate.links, "laureate facts");
  const portrait = await getLaureatePortrait(laureate.wikipedia?.slug);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-black/10 bg-[#e9e1d1] dark:border-white/10 dark:bg-muted">
        <div className="absolute inset-0 nobel-grid opacity-40" />
        <div className="absolute -right-24 -top-24 size-96 rounded-full border border-[#9a7028]/15" />
        <div className="relative mx-auto max-w-6xl px-5 py-6 sm:px-8">
          <Link
            href="/laureates"
            className="mb-12 inline-flex items-center gap-2 font-sans text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back
          </Link>

          <div className="grid gap-8 sm:grid-cols-[8.5rem_1fr] sm:items-center">
            <div>
              <div className="relative grid size-32 place-items-center overflow-hidden rounded-full border border-[#9a7028]/30 bg-[#f8f4ea] font-heading text-4xl font-semibold text-[#79571f] shadow-xl shadow-black/5 dark:bg-card dark:text-primary dark:shadow-black/30">
                {portrait ? (
                  <Image
                    src={portrait.src}
                    alt={`Portrait of ${name}`}
                    fill
                    priority
                    sizes="128px"
                    className="object-cover object-top"
                  />
                ) : (
                  initials(name)
                )}
              </div>
            </div>
            <div>
              <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                {name}
              </h1>
              {location && (
                <p className="mt-3 flex max-w-3xl items-start gap-2 font-sans text-md leading-6 text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#9a7028] dark:text-primary" />{" "}
                  {location}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <section>
            <dl className="overflow-hidden rounded-2xl border border-black/10 bg-[#fffdf8] dark:border-white/10 dark:bg-card">
              {lifeEvent?.date && (
                <Fact
                  icon={CalendarDays}
                  label={lifeLabel}
                  value={formatDate(lifeEvent.date)}
                />
              )}
              {laureate.death?.date && (
                <Fact
                  icon={CalendarDays}
                  label="Died"
                  value={formatDate(laureate.death.date)}
                />
              )}
              {laureate.gender && (
                <Fact
                  icon={CircleUserRound}
                  label="Gender"
                  value={titleCase(laureate.gender)}
                />
              )}
              {currentCountry && (
                <Fact
                  icon={Globe2}
                  label="Country today"
                  value={currentCountry}
                />
              )}
              {historicalCountry && historicalCountry !== currentCountry && (
                <Fact
                  icon={MapPin}
                  label="At the time"
                  value={historicalCountry}
                />
              )}
              {lifeEvent?.place?.continent?.en && (
                <Fact
                  icon={Globe2}
                  label="Continent"
                  value={lifeEvent.place.continent.en}
                />
              )}
            </dl>
          </section>

          <section>
            <div className="space-y-2 font-sans text-sm">
              {officialProfile && (
                <ReferenceLink
                  href={officialProfile.href}
                  label="Official Nobel profile"
                />
              )}
              {laureate.wikipedia?.english && (
                <ReferenceLink
                  href={laureate.wikipedia.english}
                  label="Wikipedia"
                />
              )}
              {laureate.wikidata?.url && (
                <ReferenceLink
                  href={laureate.wikidata.url}
                  label={`Wikidata · ${laureate.wikidata.id}`}
                />
              )}
            </div>
          </section>
        </aside>

        <div className="min-w-0">
          <section>
            <div className="flex items-center gap-3 text-[#8b6422] dark:text-primary">
              <Award className="size-5" />
              <p className="eyebrow mb-0!">Nobel recognition</p>
            </div>

            <div className="mt-9 space-y-8">
              {laureate.nobelPrizes?.map((prize) => (
                <PrizeDetails
                  key={`${prize.awardYear}-${prize.category.en}`}
                  prize={prize}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function PrizeDetails({ prize }: { prize: LaureatePrize }) {
  const factsLink = externalLink(prize.links, "laureate facts");
  const summaryLink = externalLink(prize.links, "prize summary");

  return (
    <article className="overflow-hidden rounded-3xl border border-black/10 bg-[#fffdf8] shadow-lg shadow-black/[0.03] dark:border-white/10 dark:bg-card dark:shadow-black/30">
      <div className="border-b border-black/8 bg-[#f3ecde] p-6 dark:border-white/10 dark:bg-muted sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <Badge className="border-[#b78a3d]/25 bg-[#b78a3d]/10 text-[#79571f] dark:text-primary">
              {prize.category.en}
            </Badge>
            <h3 className="mt-4 max-w-2xl font-heading text-2xl font-semibold leading-tight sm:text-3xl">
              {prize.categoryFullName.en}
            </h3>
          </div>
          <span className="font-heading text-4xl font-semibold tracking-tight text-[#997029] dark:text-primary sm:text-5xl">
            {prize.awardYear}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {prize.motivation?.en && (
          <blockquote className="border-l-2 border-[#b78a3d] pl-5 font-heading text-xl italic leading-9 text-foreground/80 sm:text-2xl">
            “{prize.motivation.en}”
          </blockquote>
        )}

        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-black/8 bg-black/8 dark:border-white/10 dark:bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {prize.dateAwarded && (
            <PrizeStat
              icon={CalendarDays}
              label="Awarded"
              value={formatDate(prize.dateAwarded)}
            />
          )}
          {prize.portion && (
            <PrizeStat
              icon={Share2}
              label="Prize share"
              value={formatShare(prize.portion)}
            />
          )}
          {prize.prizeStatus && (
            <PrizeStat
              icon={Award}
              label="Status"
              value={titleCase(prize.prizeStatus)}
            />
          )}
          {prize.prizeAmount && (
            <PrizeStat
              icon={Coins}
              label="Prize amount"
              value={formatSek(prize.prizeAmount)}
            />
          )}
        </div>

        {prize.affiliations?.length ? (
          <div className="mt-9">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Affiliation at the time of the award
            </p>
            <div className="mt-4 grid gap-3">
              {prize.affiliations.map((affiliation, index) => (
                <div
                  key={`${affiliation.name?.en}-${index}`}
                  className="flex gap-4 rounded-2xl border border-black/8 bg-[#f8f4ea]/60 p-5 dark:border-white/10 dark:bg-white/5"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#b78a3d]/10 text-[#79571f] dark:text-primary">
                    <Building2 className="size-4" />
                  </span>
                  <div>
                    <p className="font-heading font-semibold">
                      {affiliation.nameNow?.en ||
                        affiliation.name?.en ||
                        "Affiliation not recorded"}
                    </p>
                    {affiliation.locationString?.en && (
                      <p className="mt-1 font-sans text-sm text-muted-foreground">
                        {affiliation.locationString.en}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {(factsLink || summaryLink) && (
          <div className="mt-4 flex flex-wrap gap-3">
            {factsLink && (
              <ActionLink
                href={factsLink.href}
                label="Laureate facts"
                icon={BookOpen}
              />
            )}
            {summaryLink && (
              <ActionLink
                href={summaryLink.href}
                label="Prize summary"
                icon={ExternalLink}
              />
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 border-b border-black/8 p-4 last:border-0 dark:border-white/10">
      <Icon className="mt-0.5 size-4 shrink-0 text-[#9a7028] dark:text-primary" />
      <div>
        <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-1 text-sm leading-5">{value}</dd>
      </div>
    </div>
  );
}

function PrizeStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#f8f4ea] p-4 dark:bg-muted">
      <Icon className="size-4 text-[#9a7028] dark:text-primary" />
      <p className="mt-3 font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-heading text-sm font-semibold">{value}</p>
    </div>
  );
}

function ReferenceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-3 rounded-xl border border-black/8 bg-white/45 px-4 py-3 transition hover:border-[#b78a3d]/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
    >
      {label}
      <ExternalLink className="size-3.5 text-muted-foreground" />
    </a>
  );
}

function ActionLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof BookOpen;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2.5 font-sans text-sm font-semibold transition hover:border-[#b78a3d]/40 hover:bg-[#f3ecde] dark:border-white/10 dark:hover:bg-white/8"
    >
      <Icon className="size-4 text-[#8b6422] dark:text-primary" />
      {label}
    </a>
  );
}

function externalLink(links: ApiLink[] | undefined, className: string) {
  return links?.find(
    (link) => link.rel === "external" && link.class?.includes(className),
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll("_", " ");
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatSek(value: number) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatShare(value: string) {
  if (value === "1") return "Full prize";
  const [part, total] = value.split("/");
  return part && total ? `${part} of ${total}` : value;
}
