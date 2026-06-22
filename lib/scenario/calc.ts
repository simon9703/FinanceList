import type {BuyRentAIData, BuyRentInput, BuyRentOutput, InvestmentAIData, InvestmentInput, InvestmentOutput, LivingCostAIData, LivingCostInput, LivingCostOutput, PersonalInput, PersonalOutput, RetirementAIData, RetirementInput, RetirementOutput} from '@/lib/scenario/types'

const round = (value: number) => Math.round(value)

export function calculateBuyRent(data: BuyRentAIData, input: BuyRentInput = {years: 10, risk_mode: 'mid'}): BuyRentOutput {
  const downPayment = data.house_price * data.down_payment_ratio
  const annualMortgage = ((data.house_price - downPayment) * data.mortgage_rate) / (1 - Math.pow(1 + data.mortgage_rate, -data.loan_years))
  let buyCost = downPayment
  let rentCost = 0
  let investment = downPayment
  const equity_curve: number[] = []
  const investment_curve: number[] = []
  const chart: {year: number; buy: number; rent: number}[] = []

  for (let year = 1; year <= input.years; year++) {
    const houseValue = data.house_price * Math.pow(1 + data.price_growth, year)
    const rent = data.rent * 12 * Math.pow(1 + data.rent_growth, year - 1)
    buyCost += annualMortgage + houseValue * data.maintenance_rate
    rentCost += rent
    investment *= 1 + data.investment_return
    const buyWorth = houseValue - buyCost
    const rentWorth = investment - rentCost
    equity_curve.push(round(buyWorth))
    investment_curve.push(round(rentWorth))
    chart.push({year, buy: round(buyWorth), rent: round(rentWorth)})
  }

  const buyNet = equity_curve.at(-1) ?? 0
  const rentNet = investment_curve.at(-1) ?? 0
  return {buy: {total_cost: round(buyCost), net_worth: buyNet, equity_curve}, rent: {total_cost: round(rentCost), net_worth: rentNet, investment_curve}, chart, summary: {winner: buyNet >= rentNet ? 'buy' : 'rent', diff: Math.abs(buyNet - rentNet)}}
}

export function calculateInvestment(data: InvestmentAIData, input: InvestmentInput = {risk_level: 'medium', horizon: 10}): InvestmentOutput {
  const expected_return = data.assets.reduce((sum, asset) => sum + asset.weight * asset.annual_return, 0)
  const volatility = data.assets.reduce((sum, asset) => sum + asset.weight * asset.volatility, 0)
  const portfolio_value_curve = Array.from({length: input.horizon}, (_, i) => round(100000 * Math.pow(1 + expected_return, i + 1)))
  return {portfolio_value_curve, allocation: Object.fromEntries(data.assets.map((asset) => [asset.type, asset.weight])), risk_score: round(volatility * 100), expected_return: Number(expected_return.toFixed(4))}
}

export function calculateLivingCost(data: LivingCostAIData, input: LivingCostInput = {lifestyle: 'normal'}): LivingCostOutput {
  const multiplier = input.lifestyle === 'frugal' ? 0.82 : input.lifestyle === 'luxury' ? 1.35 : 1
  const breakdown = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, round(value * multiplier)])) as LivingCostAIData
  const monthly_total = Object.values(breakdown).reduce((sum, value) => sum + value, 0)
  return {monthly_total, yearly_total: monthly_total * 12, breakdown, affordability_score: Math.max(1, round(100 - (monthly_total / 9000) * 100))}
}

export function calculateRetirement(data: RetirementAIData, input: RetirementInput = {current_age: 35, retirement_age: 65, monthly_expense: 5500}): RetirementOutput {
  const years = data.life_expectancy - input.retirement_age
  const required_fund = round(input.monthly_expense * 12 * ((1 - Math.pow((1 + data.inflation) / (1 + data.return_rate), years)) / (data.return_rate - data.inflation || 0.01)))
  let balance = required_fund
  const yearly_curve = Array.from({length: years}, (_, index) => {
    balance = balance * (1 + data.return_rate) - input.monthly_expense * 12 * Math.pow(1 + data.inflation, index)
    return {year: input.retirement_age + index + 1, balance: round(Math.max(0, balance))}
  })
  const depletion = yearly_curve.find((point) => point.balance <= 0)?.year ?? data.life_expectancy
  return {required_fund, depletion_age: depletion, yearly_curve, gap: round(required_fund - 250000)}
}

export function calculatePersonal(input: PersonalInput = {cash: 45000, stocks: 125000, property: 420000}): PersonalOutput {
  const net_worth = input.cash + input.stocks + input.property
  const allocation = {cash: input.cash / net_worth, stocks: input.stocks / net_worth, property: input.property / net_worth}
  return {net_worth, allocation, projected_curve: Array.from({length: 10}, (_, i) => ({year: i + 1, value: round(net_worth * Math.pow(1.055, i + 1))})), risk_score: round(allocation.stocks * 70 + allocation.property * 35 + allocation.cash * 10)}
}
