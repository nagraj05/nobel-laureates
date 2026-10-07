import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-[#1f2420] text-[#f8f4ea]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 font-sans text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>Celebrating the people and ideas that changed our world.</p>
        <div className="flex gap-5"><Link href="/prizes">Prize archive</Link><Link href="/laureates">Laureate index</Link></div>
      </div>
    </footer>
  );
}
