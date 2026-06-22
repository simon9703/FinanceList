export const retirementData = {
  input: {currentAge: 30, retirementAge: 55, currentAsset: 300000, monthlySaving: 8000, monthlyExpenseAfterRetirement: 15000},
  scenario: {inflationRate: 0.02, investmentReturn: 0.06, lifeExpectancy: 90},
  output: {requiredFund: 6120000, projectedAssetAtRetirement: 6120000, gap: 0, depletionAge: 55.3, chart: Array.from({length: 7}, (_, i) => ({age: 30 + i * 5, asset: Math.round(i * i * 240000), expense: Math.round(180000 * Math.pow(1.02, i * 5))}))}
} as const
