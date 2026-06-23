import Link from 'next/link'
import {AllocationPie, AreaTrendChart} from '@/components/finance/Charts'
import {KpiCard, Panel, Shell} from '@/components/finance/Ui'
import {PageBottom} from '@/components/finance/PageBottom'
import {money} from '@/lib/format'
import {calculatePersonal} from '@/lib/scenario/calc'
import {mockScenario} from '@/lib/scenario/mock'

export function PersonalAssetPage() {
  const input = mockScenario.personal.data
  const output = calculatePersonal(input, mockScenario.personal.assumptions.investment_return)

  return (
    <Shell>
      <section className="mb-7">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">个人中心</h1>
        <p className="mt-3 text-lg text-slate-600">展示总资产、资产结构、未来资产动线，并汇总其他模块结果。</p>
      </section>
      <section className="grid gap-5 md:grid-cols-4">
        <KpiCard label="总资产" value={money(output.total_asset)} />
        <KpiCard label="现金" value={money(input.cash)} tone="green" />
        <KpiCard label="投资资产" value={money(input.funds + input.stocks + input.gold)} tone="purple" />
        <KpiCard label="房产资产" value={money(input.property)} tone="orange" />
      </section>
      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-4 text-xl font-bold">资产结构饼图</h2>
          <AllocationPie data={Object.entries(output.allocation).map(([name, weight]) => ({name, weight}))} />
        </Panel>
        <Panel>
          <h2 className="mb-4 text-xl font-bold">风险评分与资产动线</h2>
          <p className="mb-4 rounded-[8px] bg-violet-50 px-4 py-3 font-bold text-violet-700">风险评分：{output.risk_score} / 100</p>
          <AreaTrendChart data={output.projected_curve} />
        </Panel>
      </section>
      <Panel className="mt-6">
        <h3 className="text-xl font-bold">关联方案</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link className="rounded-[8px] border bg-white px-4 py-2 font-bold" href="/buy-rent">买房租房：mock-buy-rent</Link>
          <Link className="rounded-[8px] border bg-white px-4 py-2 font-bold" href="/investment">投资：mock-investment</Link>
          <Link className="rounded-[8px] border bg-white px-4 py-2 font-bold" href="/retirement">退休：mock-retirement</Link>
        </div>
      </Panel>

      <PageBottom
        summaries={[
          {title: '资产总览', text: `当前总资产 ${money(output.total_asset)}，现金与投资资产均已纳入统计。`},
          {title: '风险评分', text: `当前风险评分 ${output.risk_score} / 100，可结合投资与退休计划调整。`},
          {title: '资产结构', text: '房产、现金、基金、股票和黄金共同构成当前资产配置。'},
          {title: '后续建议', text: '建议定期更新资产数据，并联动其他模块复核决策。'},
        ]}
      />
    </Shell>
  )
}


