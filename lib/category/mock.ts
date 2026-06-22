import type {Scenario, ScenarioModule} from '@/lib/category/types'

const now = Date.now()
const day = 24 * 60 * 60 * 1000

export const mockScenario: Record<ScenarioModule, Scenario> = {
  buy_rent: {
    id: 'mock-buy-rent', module: 'buy_rent', city_model: 'balanced', created_at: now, expire_at: now + 7 * day, ai_generated: false, confidence: 0.78,
    assumptions: {inflation: 0.03, interest_rate: 0.045, investment_return: 0.06, rent_growth: 0.03, price_growth: 0.025},
    data: {house_price: 850000, rent: 3200, down_payment_ratio: 0.2, mortgage_rate: 0.045, loan_years: 30, price_growth: 0.025, rent_growth: 0.03, maintenance_rate: 0.012, investment_return: 0.06}
  },
  investment: {
    id: 'mock-investment', module: 'investment', city_model: 'auto', created_at: now, expire_at: now + 7 * day, ai_generated: false, confidence: 0.74,
    assumptions: {inflation: 0.03, interest_rate: 0.04, investment_return: 0.065},
    data: {market_regime: 'neutral', assets: [{type: 'stocks', weight: 0.55, annual_return: 0.08, volatility: 0.18}, {type: 'bonds', weight: 0.25, annual_return: 0.04, volatility: 0.06}, {type: 'gold', weight: 0.1, annual_return: 0.045, volatility: 0.14}, {type: 'cash', weight: 0.1, annual_return: 0.02, volatility: 0.01}]}
  },
  living_cost: {
    id: 'mock-living-cost', module: 'living_cost', city_model: 'balanced', created_at: now, expire_at: now + 7 * day, ai_generated: false, confidence: 0.8,
    assumptions: {inflation: 0.03, interest_rate: 0.04, investment_return: 0.055},
    data: {rent: 3200, food: 850, transport: 320, utilities: 220, entertainment: 500}
  },
  retirement: {
    id: 'mock-retirement', module: 'retirement', city_model: 'auto', created_at: now, expire_at: now + 7 * day, ai_generated: false, confidence: 0.76,
    assumptions: {inflation: 0.03, interest_rate: 0.04, investment_return: 0.055},
    data: {life_expectancy: 90, inflation: 0.03, return_rate: 0.05}
  },
  personal: {
    id: 'mock-personal', module: 'personal', city_model: 'auto', created_at: now, expire_at: now + 7 * day, ai_generated: false, confidence: 0.7,
    assumptions: {inflation: 0.03, interest_rate: 0.04, investment_return: 0.06},
    data: {cash: 45000, stocks: 125000, property: 420000}
  }
}
