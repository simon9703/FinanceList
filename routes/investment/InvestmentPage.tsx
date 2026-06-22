import {AllocationPie, LineCompareChart} from '@/components/finance/Charts'
import {InsightCard, KpiCard, Panel, ScenarioTabs, Shell} from '@/components/finance/Ui'
import {money, percent} from '@/lib/format'
import {calculateInvestment} from '@/lib/scenario/calc'
import {mockScenario} from '@/lib/scenario/mock'

export function InvestmentPage() {
  const output = calculateInvestment(mockScenario.investment.data, {
    initial_amount: 100000,
    monthly_invest: 3000,
    risk_level: 'medium',
    horizon: 10,
  })

  return (
    <Shell>
      <section className="mb-7">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">投资协助</h1>
        <p className="mt-3 text-lg text-slate-600">展示不同资产配置下的未来收益、风险和资产曲线。</p>
      </section>
      <ScenarioTabs items={['保守型', '平衡型', '进取型']} active="平衡型" />
      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-4 text-xl font-bold">资产配置环形图</h2>
          <AllocationPie data={mockScenario.investment.data.assets.map((asset) => ({name: asset.label, weight: asset.weight}))} />
        </Panel>
        <div className="grid gap-5">
          <KpiCard label="预计年化收益" value={`${percent(output.expected_return)} - 8.4%`} tone="green" />
          <KpiCard label="最终资产 / 累计收益" value={money(output.final_value)} hint={`累计投入 ${money(output.total_invested)}；收益 ${money(output.profit)}`} tone="purple" />
        </div>
      </section>
      <Panel className="mt-5">
        <h2 className="mb-4 text-xl font-bold">未来资产增长曲线</h2>
        <LineCompareChart data={output.portfolio_value_curve} lines={[{key: 'conservative', name: '保守'}, {key: 'value', name: '基准'}, {key: 'optimistic', name: '乐观', color: '#8b5cf6'}]} />
      </Panel>
      <InsightCard>
        <h3 className="text-xl font-bold">风险说明</h3>
        <p className="mt-2 text-slate-600">风险评分 {output.risk_score}/100；平衡配置适合希望长期增值、可承受阶段性回撤的人群。</p>
      </InsightCard>
    </Shell>
  )
}


