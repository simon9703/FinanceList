# FinanceList

FinanceList is now a scenario-driven Next.js app for finance decision demos. It uses the App Router, Tailwind CSS, Recharts, next-intl, mock data, and lightweight API routes to power module-based decision pages.

## Routes

- `/`
- `/category-finance/modules/buy_rent`
- `/category-finance/modules/investment`
- `/category-finance/modules/living_cost`
- `/category-finance/modules/retirement`
- `/category-finance/modules/personal`
- `/api/categories`
- `/api/ai/categories`

## Scenario flow

1. Mock data is the default fallback.
2. AI generation writes final values into `scenario.data`.
3. DB caching stores final `scenario` records.
4. Frontend pages calculate and render from `scenario.data`.

## Development

```bash
pnpm install
pnpm dev
```

## Supabase

Run `supabase/category-schema.sql` to create the `scenarios` cache table.

## Deploy

Deploy the repository root directly to one Vercel project.
