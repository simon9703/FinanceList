export const livingCostData = {
  input: {selectedCity: '广州', lifestyle: 'basic', monthlyIncome: 18000},
  scenario: {cities: [
    {city: '深圳', rent: 6200, food: 2000, transport: 600, taxAndInsurance: 1280, entertainment: 1200, other: 900},
    {city: '广州', rent: 4200, food: 1800, transport: 500, taxAndInsurance: 1160, entertainment: 1000, other: 800},
    {city: '新加坡', rent: 9000, food: 2800, transport: 1000, taxAndInsurance: 2180, entertainment: 1800, other: 1200}
  ]},
  output: {selectedCityTotalCost: 9460, affordabilityScore: 72, savingRate: 25, chart: [
    {city: '深圳', rent: 6200, food: 2000, transport: 600, taxAndInsurance: 1280, other: 2100},
    {city: '广州', rent: 4200, food: 1800, transport: 500, taxAndInsurance: 1160, other: 1800},
    {city: '新加坡', rent: 9000, food: 2800, transport: 1000, taxAndInsurance: 2180, other: 3000}
  ]}
} as const
