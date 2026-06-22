# FinanceList Agent Notes

## Product Target

FinanceList is a scenario-driven finance decision app. The implementation must follow this boundary:

```txt
AI generates scenario.data
DB caches Scenario
Mock is fallback
Frontend is the only calculation source
UI only displays and controls state
```

## Reference Screens

- `ui/首页.png`: Home dashboard UI and feature set.
- `ui/买房.png`: Buy vs Rent page UI and feature set.

Use these screenshots as the visual source of truth for spacing, hierarchy, cards, controls, charts, summary panels, and primary actions.

## Routes

```txt
/
/buy-rent
/investment
/living-cost
/retirement
/personal-asset
```

Module keys:

```ts
type ModuleKey =
  | "buy_rent"
  | "investment"
  | "living_cost"
  | "retirement"
  | "personal"
```

Route mapping:

```ts
const moduleRoutes = {
  buy_rent: "/buy-rent",
  investment: "/investment",
  living_cost: "/living-cost",
  retirement: "/retirement",
  personal: "/personal-asset",
}
```

## Scenario Model

```ts
export type Scenario = {
  id: string

  module: "buy_rent" | "investment" | "living_cost" | "retirement" | "personal"

  city_model: "cheap" | "balanced" | "expensive" | "auto"

  created_at: number
  expire_at: number

  ai_generated: boolean
  confidence?: number

  assumptions: Assumptions
  data: any
}

export type Assumptions = {
  inflation: number
  interest_rate: number
  investment_return: number

  rent_growth?: number
  price_growth?: number
}
```

## Module Data Contracts

### Buy vs Rent

```ts
export type BuyRentAIData = {
  house_price: number
  rent: number
  down_payment_ratio: number
  mortgage_rate: number
  loan_years: number
  price_growth: number
  rent_growth: number
  maintenance_rate: number
  investment_return: number
}

export type BuyRentInput = {
  years: 10 | 20 | 30
  risk_mode: "low" | "mid" | "high"
}

export type BuyRentOutput = {
  buy: {
    total_cost: number
    net_worth: number
    equity_curve: number[]
  }

  rent: {
    total_cost: number
    net_worth: number
    investment_curve: number[]
  }

  chart: {
    year: number
    buy: number
    rent: number
  }[]

  summary: {
    winner: "buy" | "rent"
    diff: number
  }
}
```

### Investment

```ts
export type InvestmentAIData = {
  assets: {
    type: "stocks" | "gold" | "bonds" | "cash"
    weight: number
    annual_return: number
    volatility: number
  }[]

  market_regime: "bull" | "neutral" | "bear"
}

export type InvestmentInput = {
  risk_level: "low" | "medium" | "high"
  horizon: number
}

export type InvestmentOutput = {
  portfolio_value_curve: number[]
  allocation: Record<string, number>
  risk_score: number
  expected_return: number
}
```

### Living Cost

```ts
export type LivingCostAIData = {
  rent: number
  food: number
  transport: number
  utilities: number
  entertainment: number
}

export type LivingCostInput = {
  lifestyle: "frugal" | "normal" | "luxury"
}

export type LivingCostOutput = {
  monthly_total: number
  yearly_total: number
  breakdown: {
    rent: number
    food: number
    transport: number
    utilities: number
    entertainment: number
  }
  affordability_score: number
}
```

### Retirement

```ts
export type RetirementAIData = {
  life_expectancy: number
  inflation: number
  return_rate: number
}

export type RetirementInput = {
  current_age: number
  retirement_age: number
  monthly_expense: number
}

export type RetirementOutput = {
  required_fund: number
  depletion_age: number
  yearly_curve: {
    year: number
    balance: number
  }[]
  gap: number
}
```

### Personal Asset

```ts
export type PersonalInput = {
  cash: number
  stocks: number
  property: number
}

export type PersonalOutput = {
  net_worth: number
  allocation: Record<string, number>
  projected_curve: {
    year: number
    value: number
  }[]
  risk_score: number
}
```

## API Mode Switching

Every scenario API must support two modes:

```ts
type ScenarioApiMode = "mock" | "ai_cache"
```

Mode can be selected by:

```txt
NEXT_PUBLIC_SCENARIO_MODE=mock
NEXT_PUBLIC_SCENARIO_MODE=ai_cache
```

Request shape:

```ts
type ScenarioRequest = {
  module: ModuleKey
  request: Record<string, unknown>
  regenerate?: boolean
  mode?: "mock" | "ai_cache"
}
```

Response shape:

```ts
type ScenarioResponse = {
  scenario: Scenario
  source: "mock" | "cache" | "ai"
}
```

Mode behavior:

```txt
mock:
  return mockScenario[module]
  do not call AI
  do not require DB

ai_cache:
  if regenerate=true, skip cache and call AI
  otherwise read DB by module + request hash
  if cache hit and not expired, return cached Scenario
  if cache miss, call AI
  if AI succeeds, write Scenario to DB for 7 days
  if AI fails, return mockScenario[module]
```

Current implementation note:

```txt
mock mode is fully implemented
ai_cache mode has the service boundary in place
without OPENAI_API_KEY or a Postgres driver, ai_cache falls back to mock
```

## Cache Table

SQL file:

```txt
supabase/scenarios.sql
```

```sql
CREATE TABLE scenarios (
  id TEXT PRIMARY KEY,
  module TEXT,
  city_model TEXT,

  assumptions JSONB,
  data JSONB,

  ai_generated BOOLEAN,

  created_at TIMESTAMP,
  expire_at TIMESTAMP
);
```

Recommended index:

```sql
CREATE INDEX scenarios_module_expire_idx
ON scenarios (module, expire_at);
```

If request hash is added:

```sql
ALTER TABLE scenarios ADD COLUMN hash TEXT;

CREATE UNIQUE INDEX scenarios_module_hash_idx
ON scenarios (module, hash);
```

## Interaction Rules

```txt
first load:
  fetch scenario from API according to mode

regenerate:
  call API with regenerate=true

slider changes:
  do not call API
  recalculate on frontend

tab changes:
  do not call API
  switch local view state

AI failure:
  return mock
  keep UI usable
```

## Page Documentation Rule

Each page must maintain its own `page.md` next to the route file.

The page markdown must include:

```txt
1. UI reference
2. page purpose
3. visible sections
4. fields
5. interactions
6. API contract
7. frontend calculation outputs
8. mock fallback shape
```

For example:

```txt
app/page.md
app/buy-rent/page.md
```
