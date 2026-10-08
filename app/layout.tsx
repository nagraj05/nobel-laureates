import type { Metadata } from "next";
import { Noto_Sans, Roboto_Slab } from "next/font/google";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import { cn } from "@/lib/utils";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
});
const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
});

export const metadata: Metadata = {
  title: { default: "The Nobel Prize", template: "%s · The Nobel Prize" },
  description:
    "Explore Nobel Prizes, laureates, and more than a century of world-changing achievement.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        notoSans.variable,
        robotoSlab.variable,
      )}
    >
      <body className="flex min-h-full flex-col bg-[#f8f4ea] transition-colors dark:bg-background">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <Script id="theme-initializer" strategy="beforeInteractive">
          {`(()=>{try{const saved=localStorage.getItem("nobel-theme");const dark=saved==="dark"||(!saved&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark);document.documentElement.style.colorScheme=dark?"dark":"light"}catch{}})()`}
        </Script>
      </body>
    </html>
  );
}
