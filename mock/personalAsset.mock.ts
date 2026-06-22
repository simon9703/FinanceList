export const personalAssetData = {
  input: {cash: 180000, fund: 320000, stock: 260000, gold: 90000, property: 980000, debt: 330000},
  output: {totalAsset: 1830000, netWorth: 1500000, totalDebt: 330000, allocation: {cash: 10, fund: 17, stock: 14, gold: 5, property: 54}, riskScore: 58, assetCurve: Array.from({length: 11}, (_, year) => ({year, value: Math.round(1500000 * Math.pow(1.058, year))}))},
  linkedScenarios: {buyRent: 'br-001', investment: 'iv-001', retirement: 'rt-001'}
} as const
