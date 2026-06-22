# 首页

## UI Reference

Reference image: `ui/首页.png`

The home page is the first dashboard. It must immediately show the product identity, top navigation, scenario module entry points, four decision previews, AI summary, and bottom actions.

## Page Purpose

Home summarizes the user's financial decision scenarios and gives entry points to each module.

It does not perform heavy calculations itself. It displays summary values derived from mock data or cached scenarios.

## Navigation

Top navigation items:

```txt
首页
投资协助
城市成本
退休计划
案例库
知识库
```

Route mapping:

```ts
const nav = [
  { label: "首页", href: "/" },
  { label: "投资协助", href: "/investment" },
  { label: "城市成本", href: "/living-cost" },
  { label: "退休计划", href: "/retirement" },
  { label: "案例库", href: "/cases" },
  { label: "知识库", href: "/knowledge" },
]
```

## Visible Sections

### 1. Header

Fields:

```ts
type HeaderData = {
  logo: string
  product_name: "财富侦探"
  tagline: "看清选择，掌控未来"
  active_nav: "首页"
}
```

Behavior:

```txt
click nav item -> route change
active item -> purple underline
```

### 2. Hero

Fields:

```ts
type HomeHero = {
  title: "把复杂决策，变成清晰方案。"
  subtitle: "多维度数据分析，帮你做出更明智的财务决策。"
  quick_tags: string[]
  visual: "finance-dashboard-illustration"
}
```

Required quick tags:

```txt
买房还是租房
10 万怎么配置
深圳还是新加坡
几岁可以退休
```

Behavior:

```txt
click quick tag -> open matching module or prefilled scenario
```

### 3. Module Entry Strip

Fields:

```ts
type HomeModuleCard = {
  key: "buy_rent" | "investment" | "living_cost" | "retirement"
  title: string
  subtitle: string
  icon: string
  href: string
}
```

Required cards:

```txt
生活决策 -> /buy-rent
投资协助 -> /investment
城市成本 -> /living-cost
退休计划 -> /retirement
```

Behavior:

```txt
click card -> route to module
```

### 4. Decision Preview Cards

Home must display four preview cards:

```txt
买房 vs 租房
投资组合预览
城市生活成本对比
退休资产增长预览
```

Fields:

```ts
type HomePreview = {
  module: "buy_rent" | "investment" | "living_cost" | "retirement"
  title: string
  subtitle?: string
  metrics: {
    label: string
    value: string | number
    tone?: "default" | "green" | "purple" | "orange"
  }[]
  chart?: unknown
  recommendation: string
}
```

Behavior:

```txt
preview chart is read-only
click card title or CTA -> module page
```

### 5. AI Summary

Fields:

```ts
type HomeAISummary = {
  sections: {
    module: "buy_rent" | "investment" | "living_cost" | "retirement"
    title: string
    content: string
  }[]
  profile_badge: {
    label: string
    value: string
    risk_level: "low" | "medium" | "high"
  }
}
```

Required summary blocks:

```txt
生活决策
投资建议
城市选择
退休规划
```

Behavior:

```txt
summary uses scenario.data plus frontend-calculated outputs
summary must not depend on AI-calculated final results
```

### 6. Bottom Actions

Fields:

```ts
type HomeActions = {
  data_updated_at: string
  primary_action: "一键生成个性化方案"
  secondary_actions: ["参数调整", "查看案例"]
}
```

Behavior:

```txt
参数调整 -> open parameter panel or route to current primary scenario settings
一键生成个性化方案 -> call scenario APIs in selected mode
查看案例 -> route to case list
```

## Scenario API

Home can fetch all module scenarios through a dashboard API or by calling module APIs in parallel.

Recommended request:

```ts
type HomeScenarioRequest = {
  modules: ["buy_rent", "investment", "living_cost", "retirement"]
  mode?: "mock" | "ai_cache"
  regenerate?: boolean
}
```

Recommended response:

```ts
type HomeScenarioResponse = {
  scenarios: {
    buy_rent: Scenario
    investment: Scenario
    living_cost: Scenario
    retirement: Scenario
  }
  source: "mock" | "cache" | "ai" | "mixed"
}
```

Mode behavior:

```txt
mock:
  return local mockScenario for all modules

ai_cache:
  cache hit -> return cached scenarios
  cache miss -> call AI for missing modules
  AI failure -> fallback to mock for failed module only
```

Implemented endpoints:

```txt
POST /api/scenarios/dashboard
POST /api/scenarios
```

Current behavior:

```txt
mock mode is available end to end
ai_cache mode falls back to mock until AI and Postgres adapters are connected
```

## Frontend Calculations

Home displays summary outputs calculated by the frontend:

```ts
type HomeCalculatedOutput = {
  buy_rent: BuyRentOutput
  investment: InvestmentOutput
  living_cost: LivingCostOutput
  retirement: RetirementOutput
}
```

Rules:

```txt
AI does not calculate KPI values
DB does not store output values
frontend derives all card metrics and chart values from scenario.data
```

## Mock Fallback

```ts
export const mockScenario = {
  buy_rent: {},
  investment: {},
  living_cost: {},
  retirement: {},
  personal: {},
}
```

Home should remain fully usable when only mock data exists.
