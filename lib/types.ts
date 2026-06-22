export type ScenarioModule = 'buy_rent' | 'investment' | 'living_cost' | 'retirement' | 'personal'

export type CityModel = 'cheap' | 'balanced' | 'expensive' | 'auto'

export type Scenario = {
  id: string
  module: ScenarioModule
  city_model: CityModel
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
  years: 10 | 20
  risk_mode: 'low' | 'mid' | 'high'
}

export type BuyRentOutput = {
  buy: {total_cost: number; net_worth: number; equity_curve: number[]}
  rent: {total_cost: number; net_worth: number; investment_curve: number[]}
  chart: {year: number; buy: number; rent: number}[]
  summary: {winner: 'buy' | 'rent'; diff: number}
}

export type InvestmentAIData = {
  assets: {type: 'stocks' | 'gold' | 'bonds' | 'cash'; weight: number; annual_return: number; volatility: number}[]
  market_regime: 'bull' | 'neutral' | 'bear'
}

export type InvestmentInput = {risk_level: 'low' | 'medium' | 'high'; horizon: number}
export type InvestmentOutput = {portfolio_value_curve: number[]; allocation: Record<string, number>; risk_score: number; expected_return: number}

export type LivingCostAIData = {rent: number; food: number; transport: number; utilities: number; entertainment: number}
export type LivingCostInput = {lifestyle: 'frugal' | 'normal' | 'luxury'}
export type LivingCostOutput = {monthly_total: number; yearly_total: number; breakdown: LivingCostAIData; affordability_score: number}

export type RetirementAIData = {life_expectancy: number; inflation: number; return_rate: number}
export type RetirementInput = {current_age: number; retirement_age: number; monthly_expense: number}
export type RetirementOutput = {required_fund: number; depletion_age: number; yearly_curve: {year: number; balance: number}[]; gap: number}

export type PersonalInput = {cash: number; stocks: number; property: number}
export type PersonalOutput = {net_worth: number; allocation: Record<string, number>; projected_curve: {year: number; value: number}[]; risk_score: number}
