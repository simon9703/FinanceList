import {StackedCostChart} from '@/components/finance/Charts'
import {DataTable, KpiCard, Panel, ScenarioTabs, Shell} from '@/components/finance/Ui'
import {money} from '@/lib/format'
import {calculateLivingCost} from '@/lib/scenario/calc'
import {mockScenario} from '@/lib/scenario/mock'

export function LivingCostPage() {
  const output = calculateLivingCost(mockScenario.living_cost.data, {
    city: '广州',
    monthly_income: 18000,
    lifestyle: 'normal',
  })

  return (
    <Shell>
      <section className="mb-7">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">城市生活成本</h1>
        <p className="mt-3 text-lg text-slate-600">对比不同城市的居住、饮食、交通、税费成本，并计算可负担程度。</p>
      </section>
      <ScenarioTabs items={mockScenario.living_cost.data.cities.map((city) => city.city)} active="广州" />
      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <KpiCard label="月度总成本" value={money(output.monthly_total)} hint="当前城市：广州" />
        <KpiCard label="可负担指数" value={`${output.affordability_score} / 100`} hint={`储蓄率 ${output.saving_rate}%`} tone="green" />
      </section>
      <Panel className="mt-5">
        <h2 className="mb-4 text-xl font-bold">居住 / 饮食 / 交通 / 税费 / 其他</h2>
        <StackedCostChart data={output.chart} />
      </Panel>
      <Panel className="mt-5">
        <DataTable
          headers={['城市', '居住', '饮食', '交通', '税费', '其他', '月总成本']}
          rows={mockScenario.living_cost.data.cities.map((city) => [
            city.city,
            money(city.rent),
            money(city.food),
            money(city.transport),
            money(city.tax_and_insurance),
            money(city.utilities + city.entertainment),
            money(city.rent + city.food + city.transport + city.tax_and_insurance + city.utilities + city.entertainment),
          ])}
        />
      </Panel>
    </Shell>
  )
}


