import type {
  BuyRentAIData,
  InvestmentAIData,
  LivingCostAIData,
  ModuleKey,
  PersonalInput,
  RetirementAIData,
  Scenario,
} from './types'

const now = 1715731200000
const sevenDays = 7 * 24 * 60 * 60 * 1000

export const mockScenario = {
  buy_rent: {
    id: 'mock-buy-rent',
    module: 'buy_rent',
    city_model: 'balanced',
    created_at: now,
    expire_at: now + sevenDays,
    ai_generated: false,
    confidence: 0.84,
    assumptions: {
      inflation: 0.02,
      interest_rate: 0.0385,
      investment_return: 0.04,
      rent_growth: 0.02,
      price_growth: 0.025,
    },
    data: {
      house_price: 1600000,
      rent: 3000,
      down_payment_ratio: 0.3,
      mortgage_rate: 0.0385,
      loan_years: 30,
      price_growth: 0.025,
      rent_growth: 0.02,
      maintenance_rate: 0.006,
      investment_return: 0.04,
    },
  } satisfies Scenario<BuyRentAIData>,

  investment: {
    id: 'mock-investment',
    module: 'investment',
    city_model: 'auto',
    created_at: now,
    expire_at: now + sevenDays,
    ai_generated: false,
    confidence: 0.82,
    assumptions: {
      inflation: 0.02,
      interest_rate: 0.03,
      investment_return: 0.074,
    },
    data: {
      market_regime: 'neutral',
      assets: [
        {type: 'gold', label: '黄金', weight: 15, annual_return: 0.05, volatility: 0.14},
        {type: 'stocks', label: '标普500', weight: 30, annual_return: 0.08, volatility: 0.18},
        {type: 'stocks', label: '纳斯达克', weight: 20, annual_return: 0.105, volatility: 0.24},
        {type: 'bonds', label: '红利', weight: 15, annual_return: 0.055, volatility: 0.12},
        {type: 'cash', label: '美债', weight: 20, annual_return: 0.04, volatility: 0.05},
      ],
    },
  } satisfies Scenario<InvestmentAIData>,

  living_cost: {
    id: 'mock-living-cost',
    module: 'living_cost',
    city_model: 'balanced',
    created_at: now,
    expire_at: now + sevenDays,
    ai_generated: false,
    confidence: 0.8,
    assumptions: {
      inflation: 0.02,
      interest_rate: 0.03,
      investment_return: 0.05,
    },
    data: {
      cities: [
        {city: '深圳', rent: 6200, food: 2000, transport: 600, utilities: 500, entertainment: 1600, tax_and_insurance: 1280},
        {city: '广州', rent: 4200, food: 1800, transport: 500, utilities: 420, entertainment: 1380, tax_and_insurance: 1160},
        {city: '新加坡', rent: 9000, food: 2800, transport: 1000, utilities: 760, entertainment: 2240, tax_and_insurance: 2180},
      ],
    },
  } satisfies Scenario<LivingCostAIData>,

  retirement: {
    id: 'mock-retirement',
    module: 'retirement',
    city_model: 'auto',
    created_at: now,
    expire_at: now + sevenDays,
    ai_generated: false,
    confidence: 0.79,
    assumptions: {
      inflation: 0.02,
      interest_rate: 0.03,
      investment_return: 0.06,
    },
    data: {
      life_expectancy: 90,
      inflation: 0.02,
      return_rate: 0.06,
    },
  } satisfies Scenario<RetirementAIData>,

  personal: {
    id: 'mock-personal',
    module: 'personal',
    city_model: 'auto',
    created_at: now,
    expire_at: now + sevenDays,
    ai_generated: false,
    confidence: 0.78,
    assumptions: {
      inflation: 0.02,
      interest_rate: 0.03,
      investment_return: 0.058,
    },
    data: {
      cash: 180000,
      stocks: 260000,
      funds: 320000,
      gold: 90000,
      property: 980000,
      debt: 330000,
    },
  } satisfies Scenario<PersonalInput>,
} satisfies Record<ModuleKey, Scenario>

export function getMockScenario(module: ModuleKey) {
  const scenario = mockScenario[module]
  return {
    ...scenario,
    created_at: Date.now(),
    expire_at: Date.now() + sevenDays,
  }
}
