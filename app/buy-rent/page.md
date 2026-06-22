# 买房 vs 租房

## UI Reference

Reference image: `ui/买房.png`

This page implements the full Buy vs Rent decision workflow: parameter controls, local recalculation, KPI cards, comparison chart, summary recommendation, and secondary actions.

## Page Purpose

Compare buying a home against renting and investing the remaining cash.

AI only provides market assumptions and base scenario data. The frontend calculates all costs, curves, net worth values, chart data, and recommendation text.

## Route

```txt
/buy-rent
```

Module key:

```ts
"buy_rent"
```

## Visible Sections

### 1. Header

Fields:

```ts
type HeaderData = {
  product_name: "财富侦探"
  tagline: "看清财富，做好选择"
  active_nav: "投资协助"
}
```

Behavior:

```txt
click nav item -> route change
active item -> purple underline
```

### 2. Page Hero

Fields:

```ts
type BuyRentHero = {
  title: "买房 vs 租房"
  subtitle: "比较住房成本、资产增长与资金灵活性"
}
```

### 3. Parameter Bar

The parameter bar is the main local input surface. Slider changes must not call the API.

Fields:

```ts
type BuyRentParameterState = {
  house_price: number
  down_payment_ratio: number
  mortgage_rate: number
  loan_years: number
  price_growth: number
  rent: number
  rent_growth: number
  investment_return: number
  years: 10 | 20 | 30
}
```

Visible controls:

```txt
房子总价
首付比例
贷款利率
贷款年限
房价涨幅
月租金
租金涨幅
投资收益率
对比年限
```

Behavior:

```txt
slider/input change -> update local state
local state change -> run calculateBuyRent
no network request
```

### 4. Buy Asset Card

Fields:

```ts
type BuyAssetCard = {
  property_value: number
  remaining_loan: number
  net_worth: number
  monthly_payment: number
  total_interest: number
  rent_buy_ratio: string
}
```

Displayed labels:

```txt
买房资产
房产价值（估算）
剩余贷款
买房净资产
月供（含税费）
总利息支出
租售比
```

### 5. Rent Investment Card

Fields:

```ts
type RentInvestmentCard = {
  rent_total_cost: number
  investment_asset: number
  liquidity_score: "低" | "中" | "高"
  first_year_rent: number
  investable_cash_first_year: number
  liquidity_percent: number
}
```

Displayed labels:

```txt
租房投资
累计租房支出
投资资产（估算）
资金灵活性评分
月租金（首年）
可投资金额（首年）
流动性
```

### 6. Net Worth Comparison Chart

Fields:

```ts
type BuyRentChartPoint = {
  year: number
  buy: number
  rent: number
}
```

Chart requirements:

```txt
green line -> 买房净资产
purple line -> 租房投资资产
x-axis -> year
y-axis -> CNY amount
tooltip -> selected year, buy value, rent value
annotation -> year when rent exceeds buy, if present
```

Behavior:

```txt
chart updates immediately after parameter change
dropdown can switch price basis if implemented
```

### 7. Comparison Summary

Fields:

```ts
type BuyRentSummaryPanel = {
  years: number
  buy_total_cost: number
  rent_total_cost: number
  cost_diff: number
  buy_final_net_worth: number
  rent_final_net_worth: number
  net_worth_diff: number
  recommendation: "买房" | "租房 + 投资"
  reason: string
}
```

Displayed blocks:

```txt
成本对比
最终资产对比
建议
```

### 8. Bottom Action Cards

Fields:

```ts
type BuyRentActions = {
  adjust_params: boolean
  switch_scenario: boolean
  view_cases: boolean
}
```

Required actions:

```txt
参数调整
场景切换
查看案例
```

Behavior:

```txt
参数调整 -> focus/open parameter controls
场景切换 -> change local scenario preset or call API if regenerate is requested
查看案例 -> route to case list
```

## Scenario Data

### AI Generated Data

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
```

### UI Input

```ts
export type BuyRentInput = {
  years: 10 | 20 | 30
  risk_mode: "low" | "mid" | "high"
}
```

### Calculation Output

```ts
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

## Frontend Calculation Rules

```txt
monthly mortgage payment is calculated from principal, rate, and loan years
property value grows by price_growth
rent grows by rent_growth
maintenance cost grows with property value and maintenance_rate
renting invests down payment plus monthly payment difference when positive
investment asset grows by investment_return
winner is decided by final net worth
```

The calculation function should be pure:

```ts
function calculateBuyRent(
  data: BuyRentAIData,
  input: BuyRentInput
): BuyRentOutput
```

## API Contract

Request:

```ts
type BuyRentScenarioRequest = {
  module: "buy_rent"
  request: {
    city?: string
    city_model?: "cheap" | "balanced" | "expensive" | "auto"
    budget?: number
  }
  regenerate?: boolean
  mode?: "mock" | "ai_cache"
}
```

Response:

```ts
type BuyRentScenarioResponse = {
  scenario: Scenario & {
    module: "buy_rent"
    data: BuyRentAIData
  }
  source: "mock" | "cache" | "ai"
}
```

Mode behavior:

```txt
mock:
  return mockScenario.buy_rent

ai_cache:
  regenerate=false -> read cache first
  regenerate=true -> skip cache and call AI
  AI success -> write cache for 7 days
  AI failure -> return mockScenario.buy_rent
```

Implemented endpoint:

```txt
POST /api/scenarios
```

Current behavior:

```txt
mock mode returns mockScenario.buy_rent
ai_cache mode falls back to mock when OPENAI_API_KEY or DB adapter is unavailable
```

## Interaction Rules

```txt
first load:
  call BuyRent scenario API by selected mode

regenerate:
  call API with regenerate=true

slider changes:
  local recalculation only

tab or scenario preset changes:
  local state switch first
  only call API when a new AI scenario is explicitly requested

cache hit:
  render cached scenario.data

AI miss failure:
  render mock scenario.data
```

## Mock Fallback

```ts
export const mockScenario = {
  buy_rent: {
    id: "mock-buy-rent",
    module: "buy_rent",
    city_model: "balanced",
    created_at: 0,
    expire_at: 0,
    ai_generated: false,
    confidence: 0.8,
    assumptions: {
      inflation: 0.02,
      interest_rate: 0.0385,
      investment_return: 0.06,
      rent_growth: 0.02,
      price_growth: 0.025,
    },
    data: {
      house_price: 3000000,
      rent: 8000,
      down_payment_ratio: 0.3,
      mortgage_rate: 0.0385,
      loan_years: 30,
      price_growth: 0.025,
      rent_growth: 0.02,
      maintenance_rate: 0.01,
      investment_return: 0.06,
    },
  },
}
```
