export const investmentData = {
  input: {initialAmount: 100000, monthlyInvest: 3000, riskLevel: 'medium', years: 10},
  scenario: {assets: [
    {name: '黄金', weight: 15, expectedReturn: 0.05, risk: 'medium'}, {name: '标普500', weight: 30, expectedReturn: 0.08, risk: 'medium'}, {name: '纳斯达克', weight: 20, expectedReturn: 0.105, risk: 'high'}, {name: '红利', weight: 15, expectedReturn: 0.065, risk: 'medium'}, {name: '美债', weight: 20, expectedReturn: 0.04, risk: 'low'}]},
  output: {expectedAnnualReturn: 0.074, finalAsset: 526000, totalInvested: 460000, profit: 66000, riskScore: 62, chart: Array.from({length: 11}, (_, year) => ({year, value: Math.round(100000 * Math.pow(1.074, year) + year * 36000), conservative: Math.round(100000 * Math.pow(1.055, year) + year * 36000), optimistic: Math.round(100000 * Math.pow(1.095, year) + year * 36000)}))}
} as const
