export const buyRentData = {
  input: {housePrice: 3000000, downPaymentRatio: 0.3, mortgageRate: 0.0385, houseGrowthRate: 0.02, monthlyRent: 6200, rentGrowthRate: 0.025, investmentReturn: 0.06, years: 30},
  output: {
    buy: {totalCost: 2680000, monthlyPayment: 10650, finalPropertyValue: 5120000, remainingLoan: 0, netAssetGrowth: 2440000},
    rent: {totalRentPaid: 2050000, finalInvestmentAsset: 5260000, netAssetGrowth: 3210000},
    winner: 'rent', diff: 820000,
    chart: Array.from({length: 7}, (_, i) => ({year: i * 5, buyNetAsset: Math.round(i * 850000 + (i > 3 ? 200000 : 0)), rentNetAsset: Math.round(i * i * 146000), propertyValue: Math.round(3000000 * Math.pow(1.02, i * 5)), remainingLoan: Math.max(0, Math.round(2100000 - i * 350000)), rentPaid: i * 372000}))
  }
} as const
