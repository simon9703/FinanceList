import {LineCompareChart} from '@/components/finance/Charts'
import {DataTable, KpiCard, Panel, ScenarioTabs, Shell} from '@/components/finance/Ui'
import {money} from '@/lib/format'
import {calculateRetirement} from '@/lib/scenario/calc'
import {mockScenario} from '@/lib/scenario/mock'

export function RetirementPage() {
  const input = {
    current_age: 30,
    retirement_age: 60,
    current_asset: 300000,
    monthly_saving: 8000,
    monthly_expense: 15000,
  }
  const output = calculateRetirement(mockScenario.retirement.data, input)

  return (
    <Shell>
      <section className="mb-7">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">退休计划</h1>
        <p className="mt-3 text-lg text-slate-600">估算退休所需资产、退休后资金变化和耗尽年龄。</p>
      </section>
      <ScenarioTabs items={['55岁退休', '60岁退休', '65岁退休']} active={`${input.retirement_age}岁退休`} />
      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <KpiCard label="退休所需资金" value={money(output.required_fund)} tone="green" />
        <KpiCard label="资金耗尽年龄" value={`${Math.round(output.depletion_age)} 岁`} hint={`预期寿命 ${mockScenario.retirement.data.life_expectancy} 岁`} tone="orange" />
      </section>
      <Panel className="mt-5">
        <h2 className="mb-4 text-xl font-bold">退休资产增长 / 消耗曲线</h2>
        <LineCompareChart data={output.yearly_curve.map((item) => ({year: item.age, value: item.balance, expense: item.expense}))} lines={[{key: 'value', name: '资产'}, {key: 'expense', name: '年度支出', color: '#f97316'}]} />
      </Panel>
      <Panel className="mt-5">
        <DataTable
          headers={['项目', '数值']}
          rows={[
            ['当前年龄', `${input.current_age} 岁`],
            ['退休年龄', `${input.retirement_age} 岁`],
            ['当前资产', money(input.current_asset)],
            ['每月储蓄', money(input.monthly_saving)],
            ['退休后月支出', money(input.monthly_expense)],
            ['退休缺口', money(output.gap)],
          ]}
        />
      </Panel>
    </Shell>
  )
}


