export type ModuleKey = 'buy_rent' | 'investment' | 'living_cost' | 'retirement' | 'personal'

export type CityModel = 'cheap' | 'balanced' | 'expensive' | 'auto'

export type ScenarioApiMode = 'mock' | 'ai_cache'

export type ScenarioSource = 'mock' | 'cache' | 'ai'

export type Assumptions = {
  inflation: number
  interest_rate: number
  investment_return: number
  rent_growth?: number
  price_growth?: number
}

export type Scenario<TData = unknown> = {
  id: string
  module: ModuleKey
  city_model: CityModel
  created_at: number
  expire_at: number
  ai_generated: boolean
  confidence?: number
  assumptions: Assumptions
  data: TData
}

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
  risk_mode: 'low' | 'mid' | 'high'
}

export type BuyRentOutput = {
  buy: {
    total_cost: number
    net_worth: number
    equity_curve: number[]
    property_value: number
    remaining_loan: number
    monthly_payment: number
    total_interest: number
    rent_buy_ratio: number
  }
  rent: {
    total_cost: number
    net_worth: number
    investment_curve: number[]
    first_year_rent: number
    first_year_investable: number
    liquidity_score: '低' | '中' | '高'
  }
  chart: {
    year: number
    buy: number
    rent: number
  }[]
  summary: {
    winner: 'buy' | 'rent'
    diff: number
    crossover_year: number | null
  }
}

export type InvestmentAIData = {
  assets: {
    type: 'stocks' | 'gold' | 'bonds' | 'cash'
    label: string
    weight: number
    annual_return: number
    volatility: number
  }[]
  market_regime: 'bull' | 'neutral' | 'bear'
}

export type InvestmentInput = {
  initial_amount: number
  monthly_invest: number
  risk_level: 'low' | 'medium' | 'high'
  horizon: number
}

export type InvestmentOutput = {
  portfolio_value_curve: {year: number; value: number; conservative: number; optimistic: number}[]
  allocation: Record<string, number>
  risk_score: number
  expected_return: number
  final_value: number
  total_invested: number
  profit: number
}

export type LivingCostAIData = {
  cities: {
    city: string
    rent: number
    food: number
    transport: number
    utilities: number
    entertainment: number
    tax_and_insurance: number
  }[]
}

export type LivingCostInput = {
  city: string
  monthly_income: number
  lifestyle: 'frugal' | 'normal' | 'luxury'
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
    tax_and_insurance: number
  }
  chart: {
    city: string
    rent: number
    food: number
    transport: number
    taxAndInsurance: number
    other: number
  }[]
  affordability_score: number
  saving_rate: number
}

export type RetirementAIData = {
  life_expectancy: number
  inflation: number
  return_rate: number
}

export type RetirementInput = {
  current_age: number
  retirement_age: number
  current_asset: number
  monthly_saving: number
  monthly_expense: number
}

export type RetirementOutput = {
  required_fund: number
  projected_asset_at_retirement: number
  depletion_age: number
  yearly_curve: {
    year: number
    age: number
    balance: number
    expense: number
  }[]
  gap: number
}

export type PersonalInput = {
  cash: number
  stocks: number
  funds: number
  gold: number
  property: number
  debt: number
}

export type PersonalOutput = {
  net_worth: number
  total_asset: number
  allocation: Record<string, number>
  projected_curve: {
    year: number
    value: number
  }[]
  risk_score: number
}

export type ScenarioRequest = {
  module: ModuleKey
  request?: Record<string, unknown>
  regenerate?: boolean
  mode?: ScenarioApiMode
}

export type ScenarioResponse<TData = unknown> = {
  scenario: Scenario<TData>
  source: ScenarioSource
}
