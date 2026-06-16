# FinanceList

FinanceList is now a single Next.js full-stack app. It uses the App Router for pages and API routes, Tailwind CSS plus shadcn/ui-style components for the mobile-first UI, next-intl for `zh-CN` and `en`, and Supabase PostgreSQL/Auth for production data.

## Routes

- `/profiles`
- `/profiles/[id]`
- `/en/profiles`
- `/en/profiles/[id]`
- `/api/profiles`
- `/api/profiles/[id]`
- `/api/clues`
- `/api/ai/parse-clue`

## Development

```bash
pnpm install
pnpm dev

before run dev, if you want to get postgres config. use vercel command update environment config
vercel link
vercel env pull .env.development.local
```

Create `.env.local` from `.env.example` and set Supabase values. Without Supabase env vars, the app falls back to demo data so the UI and API can run locally.

## Supabase

Run `supabase/schema.sql` in the Supabase SQL editor. The schema enables row-level security and scopes profile, money item, clue, and snapshot tables to the authenticated user.

## Deploy

Deploy the repository root directly to one Vercel project. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel environment variables.
