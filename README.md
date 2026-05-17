# Campus Closet

A sustainability-focused clothing swap website for Boston University. Features a public site for students and a custom admin portal for non-technical eboard members to manage events, impact data, FAQ, team bios, photos, donation bins, and contact requests.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom brand palette
- **ORM:** Prisma with PostgreSQL
- **Backend:** Supabase (Auth via `@supabase/ssr`, Storage, Database)
- **Hosting:** Vercel

## Prerequisites

- Node.js 18+
- npm
- Supabase credentials (get from the team lead — database is already provisioned)

## Getting Started

```bash
# 1. Clone the repo
git clone <repo-url> && cd campus-closet

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Paste in the shared Supabase credentials (get from team lead)

# 4. Start the dev server
npm run dev
```

> **Note:** The database is already migrated and seeded on the shared Supabase instance.
> Only run `npx prisma migrate dev` if you are making schema changes.
> Only run `npm run db:seed` if you need to reset sample data.

## Project Structure

```text
src/
├── app/
│   ├── (public)/         # Public pages (wrapped in Navbar + Footer)
│   │   ├── page.tsx      # Landing page
│   │   ├── about/
│   │   ├── contact/
│   │   ├── donate/
│   │   ├── events/
│   │   └── faq/
│   ├── admin/            # Admin portal (own layout with sidebar, no Navbar/Footer)
│   │   ├── login/
│   │   └── [sections]/   # events, impact, bins, contact, team, faq, photos, content, users, help
│   ├── api/              # REST API endpoints
│   └── auth/callback/    # OAuth callback route
├── components/
│   ├── ui/               # Shared primitives (Button, Card, Input, Modal, Accordion, Badge, Textarea, ImageUpload)
│   ├── layout/           # Navbar, Footer, AdminSidebar
│   ├── landing/          # Landing page sections
│   └── [feature]/        # Feature-specific components
├── lib/
│   ├── supabase.ts       # Browser Supabase client
│   ├── supabase-server.ts # Server Supabase client (Route Handlers, middleware)
│   ├── auth.ts           # signInWithGoogle(), signOut()
│   ├── prisma.ts         # Prisma singleton
│   ├── cn.ts             # Tailwind class merge utility
│   ├── constants.ts      # NAV_LINKS, IMPACT_FACTORS, SITE_METADATA
│   └── site-content.ts   # getContent(), getContentMap(), getContentJSON() — admin-editable text
└── types/                # Shared TypeScript types
prisma/
├── schema.prisma         # Database schema (9 models incl. SiteContent)
└── seed.ts               # Sample data seeder
prisma.config.ts          # Prisma CLI config (seed command, schema path)
```

## Available Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `npm run dev`        | Start development server       |
| `npm run build`      | Production build               |
| `npm run lint`       | Run ESLint                     |
| `npm run db:migrate` | Run Prisma migrations          |
| `npm run db:seed`    | Seed database with sample data |
| `npm run db:reset`   | Reset database and re-seed     |

## Deployment

- **App:** [Vercel](https://h4-i-campus-closet.vercel.app/) (auto-deploys on merge to `main`)
- **Database:** Supabase PostgreSQL (connection strings in env vars)

## Contributing

- Branch naming: `feature/{dev-letter}/{feature-name}` (e.g., `feature/A/events-page`)
- All branches cut from `main`
- PRs require 1 review from any other dev
- Squash-merge to keep history clean

## Environment Variables

All required vars are in `.env.example`. Real values go in `.env` (gitignored). Also set in Vercel project settings.

| Variable                        | Description                                      |
| ------------------------------- | ------------------------------------------------ |
| `DATABASE_URL`                  | Pooled connection (port 6543, `?pgbouncer=true`) |
| `DIRECT_URL`                    | Direct connection (port 5432, for migrations)    |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key                           |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key (server only)          |
| `NEXT_PUBLIC_SITE_URL`          | Production URL (for OAuth redirects)             |
| `NEXT_PUBLIC_STADIA_MAPS_API_KEY` | Stadia Maps key for donation bin map (optional for localhost) |

## Admin-Editable Content

Most public-facing text is editable by admins via **Admin > Site Content**, organized into page-level tabs (Landing, About, Events, Donate, FAQ, Contact, Global). Content is stored in the `SiteContent` database table as key-value pairs and fetched server-side via `getContentMap()` in `src/lib/site-content.ts`. Each key has a hardcoded fallback default, so the site renders correctly even with an empty `SiteContent` table.

Database-driven content managed through dedicated admin pages: Events, Impact Stats, Team Members, FAQ Items, Gallery Photos, Donation Bins, Contact Requests, and Admin Users.

## Monitoring & Backups

This project does not include a paid error-tracking service. For basic monitoring:

- **Vercel Analytics** — Enable in Vercel dashboard (free tier) for traffic, errors, and performance
- **Uptime monitoring** — Use a free service like [Better Uptime](https://betteruptime.com) or [UptimeRobot](https://uptimerobot.com) to ping the production URL and get alerts if the site goes down
- **Database backups** — Supabase free tier includes daily automatic backups (retained for 7 days). For manual backups: Supabase Dashboard > Database > Backups. Export critical tables periodically via Supabase SQL Editor (`COPY ... TO STDOUT`)

## Known Limitations

- **Security headers** — No CSP, X-Frame-Options, etc. configured in `next.config.mjs`
- **Email validation** — `POST /api/contact` only checks non-empty, no format validation
- **OpenGraph image** — No `og:image` set for social previews
- **Pagination** — Admin list pages fetch all records with no pagination
