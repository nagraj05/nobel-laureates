<div align="center">

```text
███╗   ██╗ ██████╗ ██████╗ ███████╗██╗     
████╗  ██║██╔═══██╗██╔══██╗██╔════╝██║     
██╔██╗ ██║██║   ██║██████╔╝█████╗  ██║     
██║╚██╗██║██║   ██║██╔══██╗██╔══╝  ██║     
██║ ╚████║╚██████╔╝██████╔╝███████╗███████╗
╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝

██████╗ ██████╗ ██╗███████╗███████╗
██╔══██╗██╔══██╗██║╚══███╔╝██╔════╝
██████╔╝██████╔╝██║  ███╔╝ █████╗  
██╔═══╝ ██╔══██╗██║ ███╔╝  ██╔══╝  
██║     ██║  ██║██║███████╗███████╗
╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝
        ✦ ═══════ ★ ═══════ ✦
```

**An interactive archive of Nobel Prizes and the people and organisations behind them.**<br>
Browse the prizes. Meet the laureates. Explore more than a century of achievement.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Nobel Prize API](https://img.shields.io/badge/Data-Nobel_Prize_API-B08A45?style=flat-square)

</div>

---

## ✦ What is The Nobel Archive?

The Nobel Archive is a responsive, browser-based guide to Nobel Prizes and Nobel Laureates. It presents official Nobel Prize data in an editorial interface designed for discovery rather than as a raw dataset.

Explore prizes by category and year, search for individual laureates, and open detailed profiles containing biographies, award motivations, affiliations, prize shares, monetary values, reference links, and portraits.

---

## ✦ Features

| | |
|---|---|
| 🏅 **Browse prizes** | Explore every Nobel Prize with category and year filters, exact result counts, and pagination |
| 👤 **Discover laureates** | Browse and search the complete laureate archive with paginated results |
| 📖 **Detailed profiles** | View life details, birthplace, award motivation, prize share, status, value, and affiliation |
| 🖼️ **Laureate portraits** | Wikipedia and Wikimedia portraits with an initials fallback when no image is available |
| 🔍 **Search and filter** | Search laureates by name and filter prizes by discipline or award year |
| 🌗 **Light and dark modes** | System-aware theme selection with a persistent manual toggle |
| ⚡ **Streaming UI** | Route-level and section-level Suspense loaders for responsive data loading |
| 📱 **Responsive design** | Mobile-first layouts for the homepage, cards, archives, profiles, filters, and pagination |

---

## ✦ Data Sources

- [Nobel Prize API](https://www.nobelprize.org/about/developer-zone-2/) — prizes, laureates, motivations, affiliations, and award metadata
- [Wikimedia REST API](https://www.mediawiki.org/wiki/Wikimedia_REST_API/en) — laureate portrait thumbnails
- Wikipedia and Wikidata — external biographical references linked from each profile

API requests are made from Server Components. The Nobel API URLs in `.env` are never exposed to the browser.

---

## ✦ Requirements

- **Bun 1.3+** → [bun.sh](https://bun.sh/)
- **Node.js 20+** → [nodejs.org](https://nodejs.org/) if you prefer npm

---

## ✦ Environment Variables

Create a `.env` file in the project root:

```env
API_LAUREATES=http://api.nobelprize.org/2.1/laureates
API_NOBEL_PRIZES=http://api.nobelprize.org/2.1/nobelPrizes
```

These variables intentionally do not use the `NEXT_PUBLIC_` prefix because API access happens on the server.

---

## ✦ Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/nagraj05/nobel-laureates.git
cd nobel-laureates

# 2. Install dependencies
bun install

# 3. Add the environment variables shown above

# 4. Start the development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Using npm instead:

```bash
npm install
npm run dev
```

---

## ✦ Build for Production

```bash
bun run build
bun run start
```

Run the code-quality checks separately:

```bash
bun run lint
bunx tsc --noEmit
```

---

## ✦ Routes

| Route | Description |
|---|---|
| `/` | Editorial homepage with categories, recent prizes, and featured laureates |
| `/prizes` | Paginated prize archive with category and year filters |
| `/laureates` | Paginated and searchable laureate directory |
| `/laureates/[id]` | Complete profile for an individual or organisation |

Filter and pagination state is stored in the URL, so archive views can be bookmarked and shared.

---

## ✦ Project Structure

```text
nobel-laureates/
├── app/
│   ├── laureates/
│   │   ├── [id]/page.tsx       ← detailed laureate profile
│   │   └── page.tsx            ← searchable, paginated directory
│   ├── prizes/page.tsx         ← filtered, paginated prize archive
│   ├── globals.css             ← Tailwind theme and global styling
│   ├── layout.tsx              ← metadata, fonts, theme initialization
│   ├── loading.tsx             ← route-level loading state
│   └── page.tsx                ← homepage
├── components/
│   ├── ui/                     ← shadcn-style UI primitives
│   ├── archive-loader.tsx      ← page and section loading states
│   ├── laureate-card.tsx       ← portrait-enabled laureate card
│   ├── prize-card.tsx          ← reusable prize card
│   ├── site-header.tsx         ← navigation and theme toggle
│   └── site-footer.tsx
├── lib/
│   ├── nobel/
│   │   ├── data.ts             ← server-side API and portrait retrieval
│   │   └── types.ts            ← Nobel API TypeScript models
│   └── utils.ts
├── components.json            ← shadcn configuration
├── next.config.ts             ← Next.js and remote-image configuration
└── package.json
```

---

## ✦ How Data Loading Works

```text
Nobel Prize API ──────┐
                     ├── Server Components ── Normalized TypeScript data ── UI
Wikimedia REST API ──┘
```

- Nobel Prize requests are cached and revalidated every 12 hours.
- Wikipedia portrait metadata is cached and revalidated every seven days.
- The homepage streams prizes and laureates through independent Suspense boundaries.
- Initials are displayed when a portrait is unavailable.

---

## ✦ Troubleshooting

**The application shows no Nobel data**<br>
→ Confirm that both variables exist in `.env`, restart the development server, and verify that the Nobel Prize API is reachable.

**A laureate profile returns 404**<br>
→ Confirm that the ID exists in the Nobel API and restart the development server if the route was previously cached during development.

**A portrait does not appear**<br>
→ Not every laureate has a Wikipedia lead image. The application intentionally falls back to initials.

**Next.js reports uncached data during prerendering**<br>
→ Keep asynchronous data access inside the existing Suspense boundaries or explicitly configure the route as blocking.

**The page fails to compile**<br>
→ Run `bun run lint` and `bunx tsc --noEmit` to locate linting and TypeScript errors.

---

## ✦ Credits

Built with [Next.js](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), and [shadcn](https://ui.shadcn.com/).

Prize and laureate information is provided by the [Nobel Prize API](https://www.nobelprize.org/about/developer-zone-2/). Portraits are provided through Wikipedia and Wikimedia.

---

<div align="center">

Made with ♥ and curiosity by Nagraj.

</div>
