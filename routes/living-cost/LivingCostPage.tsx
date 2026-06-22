import {Building2, CheckCircle2} from 'lucide-react'
import {StackedCostChart} from '@/components/finance/Charts'
import {PageHero, Panel, ScenarioTabs, Shell} from '@/components/finance/Ui'
import {money} from '@/lib/format'
import {calculateLivingCost} from '@/lib/scenario/calc'
import {mockScenario} from '@/lib/scenario/mock'

export function LivingCostPage() {
  const output = calculateLivingCost(mockScenario.living_cost.data, {
    city: '广州',
    monthly_income: 18000,
    lifestyle: 'normal',
  })
  const cities = mockScenario.living_cost.data.cities
  const bestCity = cities.reduce((best, city) => {
    const total = city.rent + city.food + city.transport + city.tax_and_insurance + city.utilities + city.entertainment
    const bestTotal = best.rent + best.food + best.transport + best.tax_and_insurance + best.utilities + best.entertainment
    return total < bestTotal ? city : best
  }, cities[0])

  return (
    <Shell>
      <PageHero title="不同城市生活成本" subtitle="比较不同城市的居住、饮食、交通与储蓄空间" />
      <section className="grid gap-5 lg:grid-cols-[1fr_0.35fr]">
        <div>
          <p className="mb-3 text-sm font-bold text-slate-600">选择城市（最多选择 3 个）</p>
          <ScenarioTabs items={cities.map((city) => city.city)} active="广州" />
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-slate-600">消费模式</p>
          <ScenarioTabs items={['基础版', '舒适版']} active="基础版" />
        </div>
      </section>

      <Panel className="mt-6 p-6">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.45fr]">
          <section>
            <h2 className="mb-5 text-xl font-black">月度生活成本对比（基础版）</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {cities.map((city) => (
                <CityCard
                  key={city.city}
                  city={city.city}
                  total={city.rent + city.food + city.transport + city.tax_and_insurance + city.utilities + city.entertainment}
                  rent={city.rent}
                  food={city.food}
                  transport={city.transport}
                  tax={city.tax_and_insurance}
                  active={city.city === '广州'}
                />
              ))}
            </div>
          </section>
          <section className="border-slate-200 xl:border-l xl:pl-6">
            <h2 className="mb-5 text-xl font-black">总月度支出结构对比</h2>
            <StackedCostChart data={output.chart} />
          </section>
        </div>
      </Panel>

      <Panel className="mt-6 border-indigo-100 p-6">
        <div className="grid gap-6 xl:grid-cols-[0.55fr_0.45fr]">
          <section className="flex gap-5">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[8px] bg-indigo-600 text-white">
              <CheckCircle2 size={32} />
            </span>
            <div>
              <h2 className="text-xl font-black">AI 结论</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li>综合成本：{bestCity.city} 的月度总支出最低，生活成本最具优势。</li>
                <li>储蓄空间：当前广州储蓄率约 {output.saving_rate}%，适合长期稳健积累。</li>
                <li>平衡之选：深圳收入机会与生活成本之间较为平衡。</li>
              </ul>
            </div>
          </section>
          <section className="grid gap-3 md:grid-cols-3">
            <MiniResult label="成本最低城市" value={bestCity.city} hint={`${money(output.monthly_total)} / 月`} tone="green" />
            <MiniResult label="储蓄潜力最高" value="新加坡" hint="¥3,000 / 月" tone="purple" />
            <MiniResult label="储蓄率最高" value="广州" hint={`${output.saving_rate}%`} tone="blue" />
          </section>
        </div>
      </Panel>
    </Shell>
  )
}

function CityCard({
  city,
  total,
  rent,
  food,
  transport,
  tax,
  active,
}: {
  city: string
  total: number
  rent: number
  food: number
  transport: number
  tax: number
  active?: boolean
}) {
  return (
    <section className={`rounded-[8px] border p-5 ${active ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-white'}`}>
      <div className="mb-5 flex items-center justify-between">
        <span className="flex items-center gap-3 text-lg font-black">
          <Building2 className={active ? 'text-emerald-600' : 'text-indigo-500'} size={24} />
          {city}
        </span>
        <strong className={active ? 'text-emerald-600' : 'text-indigo-600'}>{money(total)} / 月</strong>
      </div>
      <div className="space-y-3 text-sm text-slate-600">
        <Row label="住房（租房）" value={money(rent)} />
        <Row label="饮食" value={money(food)} />
        <Row label="交通" value={money(transport)} />
        <Row label="税费与社保" value={money(tax)} />
      </div>
      <div className="mt-5 rounded-[8px] bg-slate-50 p-3">
        <div className="flex items-center justify-between text-sm font-bold">
          <span>储蓄率</span>
          <span className={active ? 'text-emerald-600' : 'text-indigo-600'}>{active ? '25%' : '17%'}</span>
        </div>
        <span className="mt-3 block h-2 rounded-full bg-slate-200">
          <span className={`block h-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{width: active ? '65%' : '45%'}} />
        </span>
      </div>
    </section>
  )
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <div className="flex justify-between gap-3">
      <span>{label}</span>
      <strong className="text-slate-900">{value}</strong>
    </div>
  )
}

function MiniResult({label, value, hint, tone}: {label: string; value: string; hint: string; tone: 'green' | 'purple' | 'blue'}) {
  const color = tone === 'green' ? 'text-emerald-600' : tone === 'purple' ? 'text-violet-600' : 'text-blue-600'
  return (
    <div className="rounded-[8px] border border-slate-100 bg-white px-4 py-4 text-center">
      <p className={`text-sm font-bold ${color}`}>{label}</p>
      <p className={`mt-2 text-xl font-black ${color}`}>{value}</p>
      <p className="mt-1 text-sm text-slate-500">{hint}</p>
    </div>
  )
}
