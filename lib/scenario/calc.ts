import type {
  BuyRentAIData,
  BuyRentInput,
  BuyRentOutput,
  InvestmentAIData,
  InvestmentInput,
  InvestmentOutput,
  LivingCostAIData,
  LivingCostInput,
  LivingCostOutput,
  PersonalInput,
  PersonalOutput,
  RetirementAIData,
  RetirementInput,
  RetirementOutput,
} from './types'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const round = (value: number) => Math.round(value)

function futureValueWithMonthlyContrib(initial: number, monthly: number, annualReturn: number, years: number) {
  let value = initial
  const monthlyReturn = annualReturn / 12
  for (let month = 0; month < years * 12; month += 1) {
    value = value * (1 + monthlyReturn) + monthly
  }
  return value
}

function remainingLoan(principal: number, annualRate: number, loanYears: number, elapsedYears: number, monthlyPayment: number) {
  const monthlyRate = annualRate / 12
  const paidMonths = Math.min(loanYears * 12, elapsedYears * 12)
  let balance = principal
  for (let i = 0; i < paidMonths; i += 1) {
    balance = balance * (1 + monthlyRate) - monthlyPayment
  }
  return Math.max(0, balance)
}

export function calculateBuyRent(data: BuyRentAIData, input: BuyRentInput): BuyRentOutput {
  const years = input.years
  const downPayment = data.house_price * data.down_payment_ratio
  const loanPrincipal = data.house_price - downPayment
  const monthlyRate = data.mortgage_rate / 12
  const loanMonths = data.loan_years * 12
  const monthlyPayment =
    monthlyRate === 0
      ? loanPrincipal / loanMonths
      : (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, loanMonths)) / (Math.pow(1 + monthlyRate, loanMonths) - 1)

  const chart: BuyRentOutput['chart'] = []
  const buyCurve: number[] = []
  const rentCurve: number[] = []
  let cumulativeRent = 0
  let rentInvestment = downPayment
  let totalMaintenance = 0
  let totalMortgagePaid = 0
  let crossoverYear: number | null = null

  for (let year = 0; year <= years; year += 1) {
    if (year > 0) {
      const annualRent = data.rent * 12 * Math.pow(1 + data.rent_growth, year - 1)
      const annualPropertyValue = data.house_price * Math.pow(1 + data.price_growth, year - 1)
      const annualMaintenance = annualPropertyValue * data.maintenance_rate
      const yearlyMortgage = year <= data.loan_years ? monthlyPayment * 12 : 0
      const investableDifference = Math.max(0, yearlyMortgage + annualMaintenance - annualRent)

      cumulativeRent += annualRent
      totalMaintenance += annualMaintenance
      totalMortgagePaid += yearlyMortgage
      rentInvestment = rentInvestment * (1 + data.investment_return) + investableDifference
    }

    const propertyValue = data.house_price * Math.pow(1 + data.price_growth, year)
    const loanLeft = remainingLoan(loanPrincipal, data.mortgage_rate, data.loan_years, year, monthlyPayment)
    const buyNetWorth = propertyValue - loanLeft
    const rentNetWorth = rentInvestment

    if (crossoverYear === null && year > 0 && rentNetWorth > buyNetWorth) {
      crossoverYear = year
    }

    chart.push({year, buy: round(buyNetWorth), rent: round(rentNetWorth)})
    buyCurve.push(round(buyNetWorth))
    rentCurve.push(round(rentNetWorth))
  }

  const finalPoint = chart[chart.length - 1]
  const propertyValue = data.house_price * Math.pow(1 + data.price_growth, years)
  const loanLeft = remainingLoan(loanPrincipal, data.mortgage_rate, data.loan_years, years, monthlyPayment)
  const totalInterest = Math.max(0, totalMortgagePaid - Math.min(loanPrincipal, totalMortgagePaid))
  const buyTotalCost = downPayment + totalMortgagePaid + totalMaintenance
  const firstYearInvestable = Math.max(0, monthlyPayment * 12 + data.house_price * data.maintenance_rate - data.rent * 12)

  return {
    buy: {
      total_cost: round(buyTotalCost),
      net_worth: finalPoint.buy,
      equity_curve: buyCurve,
      property_value: round(propertyValue),
      remaining_loan: round(loanLeft),
      monthly_payment: round(monthlyPayment),
      total_interest: round(totalInterest),
      rent_buy_ratio: data.rent * 12 / data.house_price,
    },
    rent: {
      total_cost: round(cumulativeRent),
      net_worth: finalPoint.rent,
      investment_curve: rentCurve,
      first_year_rent: data.rent,
      first_year_investable: round(firstYearInvestable),
      liquidity_score: finalPoint.rent > finalPoint.buy ? '高' : '中',
    },
    chart,
    summary: {
      winner: finalPoint.buy >= finalPoint.rent ? 'buy' : 'rent',
      diff: Math.abs(finalPoint.buy - finalPoint.rent),
      crossover_year: crossoverYear,
    },
  }
}

export function calculateInvestment(data: InvestmentAIData, input: InvestmentInput): InvestmentOutput {
  const expectedReturn = data.assets.reduce((sum, asset) => sum + asset.annual_return * (asset.weight / 100), 0)
  const volatility = data.assets.reduce((sum, asset) => sum + asset.volatility * (asset.weight / 100), 0)
  const chart = Array.from({length: input.horizon + 1}, (_, year) => {
    const totalMonthlyInvested = input.monthly_invest * 12 * year
    const value = futureValueWithMonthlyContrib(input.initial_amount, input.monthly_invest, expectedReturn, year)
    const conservative = futureValueWithMonthlyContrib(input.initial_amount, input.monthly_invest, Math.max(0.01, expectedReturn - 0.02), year)
    const optimistic = futureValueWithMonthlyContrib(input.initial_amount, input.monthly_invest, expectedReturn + 0.02, year)
    return {
      year,
      value: round(value),
      conservative: round(Math.max(input.initial_amount + totalMonthlyInvested, conservative)),
      optimistic: round(optimistic),
    }
  })
  const final = chart[chart.length - 1].value
  const totalInvested = input.initial_amount + input.monthly_invest * 12 * input.horizon

  return {
    portfolio_value_curve: chart,
    allocation: Object.fromEntries(data.assets.map((asset) => [asset.label, asset.weight])),
    risk_score: round(clamp(volatility * 320, 1, 100)),
    expected_return: expectedReturn,
    final_value: final,
    total_invested: totalInvested,
    profit: final - totalInvested,
  }
}

export function calculateLivingCost(data: LivingCostAIData, input: LivingCostInput): LivingCostOutput {
  const factor = input.lifestyle === 'frugal' ? 0.88 : input.lifestyle === 'luxury' ? 1.22 : 1
  const city = data.cities.find((item) => item.city === input.city) ?? data.cities[0]
  const breakdown = {
    rent: round(city.rent),
    food: round(city.food * factor),
    transport: round(city.transport * factor),
    utilities: round(city.utilities * factor),
    entertainment: round(city.entertainment * factor),
    tax_and_insurance: round(city.tax_and_insurance),
  }
  const monthlyTotal = Object.values(breakdown).reduce((sum, value) => sum + value, 0)
  const savingRate = round(((input.monthly_income - monthlyTotal) / input.monthly_income) * 100)

  return {
    monthly_total: monthlyTotal,
    yearly_total: monthlyTotal * 12,
    breakdown,
    chart: data.cities.map((item) => ({
      city: item.city,
      rent: item.rent,
      food: item.food,
      transport: item.transport,
      taxAndInsurance: item.tax_and_insurance,
      other: item.utilities + item.entertainment,
    })),
    affordability_score: round(clamp(savingRate + 50, 0, 100)),
    saving_rate: savingRate,
  }
}

export function calculateRetirement(data: RetirementAIData, input: RetirementInput): RetirementOutput {
  const yearsToRetirement = Math.max(0, input.retirement_age - input.current_age)
  const yearsAfterRetirement = Math.max(1, data.life_expectancy - input.retirement_age)
  const annualExpenseAtRetirement = input.monthly_expense * 12 * Math.pow(1 + data.inflation, yearsToRetirement)
  const realReturn = Math.max(0.005, (1 + data.return_rate) / (1 + data.inflation) - 1)
  const requiredFund = annualExpenseAtRetirement * ((1 - Math.pow(1 + realReturn, -yearsAfterRetirement)) / realReturn)
  const projectedAsset = futureValueWithMonthlyContrib(input.current_asset, input.monthly_saving, data.return_rate, yearsToRetirement)
  const gap = Math.max(0, requiredFund - projectedAsset)
  const yearlyCurve: RetirementOutput['yearly_curve'] = []
  let balance = input.current_asset
  let depletionAge = data.life_expectancy

  for (let age = input.current_age; age <= data.life_expectancy; age += 1) {
    const year = age - input.current_age
    if (age < input.retirement_age) {
      balance = balance * (1 + data.return_rate) + input.monthly_saving * 12
    } else {
      const expense = input.monthly_expense * 12 * Math.pow(1 + data.inflation, year)
      balance = balance * (1 + data.return_rate) - expense
      if (balance <= 0 && depletionAge === data.life_expectancy) {
        depletionAge = age
      }
    }
    yearlyCurve.push({
      year,
      age,
      balance: round(Math.max(0, balance)),
      expense: round(input.monthly_expense * 12 * Math.pow(1 + data.inflation, year)),
    })
  }

  return {
    required_fund: round(requiredFund),
    projected_asset_at_retirement: round(projectedAsset),
    depletion_age: depletionAge,
    yearly_curve: yearlyCurve,
    gap: round(gap),
  }
}

export function calculatePersonal(input: PersonalInput, annualReturn = 0.058): PersonalOutput {
  const totalAsset = input.cash + input.stocks + input.funds + input.gold + input.property
  const netWorth = totalAsset - input.debt
  const allocation = {
    现金: round((input.cash / totalAsset) * 100),
    股票: round((input.stocks / totalAsset) * 100),
    基金: round((input.funds / totalAsset) * 100),
    黄金: round((input.gold / totalAsset) * 100),
    房产: round((input.property / totalAsset) * 100),
  }

  return {
    net_worth: netWorth,
    total_asset: totalAsset,
    allocation,
    projected_curve: Array.from({length: 11}, (_, year) => ({
      year,
      value: round(netWorth * Math.pow(1 + annualReturn, year)),
    })),
    risk_score: round(clamp((input.stocks + input.funds + input.gold) / totalAsset * 100, 1, 100)),
  }
}
