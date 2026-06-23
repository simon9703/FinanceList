import {CheckCircle2, Coins, Landmark, TrendingUp} from 'lucide-react'
import {LineCompareChart} from '@/components/finance/Charts'
import {InsightCard, KpiCard, PageHero, Panel, ScenarioTabs, Shell} from '@/components/finance/Ui'
import {money, percent} from '@/lib/format'
import {calculateInvestment} from '@/lib/scenario/calc'
import {mockScenario} from '@/lib/scenario/mock'

export function InvestmentPage() {
  const input = {
    initial_amount: 100000,
    monthly_invest: 3000,
    risk_level: 'medium' as const,
    horizon: 10,
  }
  const output = calculateInvestment(mockScenario.investment.data, input)

  return (
    <Shell>
      <PageHero title="投资协助" subtitle="输入金额与偏好，快速生成适合你的投资分配方案" />
      <section className="grid gap-5 xl:grid-cols-[0.33fr_0.67fr]">
        <Panel className="p-6">
          <h2 className="text-xl font-black">1. 输入你的投资信息</h2>
          <div className="mt-5">
            <ScenarioTabs items={['简单模式', '复杂模式']} active="简单模式" />
          </div>
          <div className="mt-6 space-y-5">
            <Field label="投资金额" value={money(input.initial_amount)} />
            <div>
              <p className="mb-3 text-sm font-bold text-slate-600">投资方式</p>
              <div className="grid grid-cols-2 gap-3">
                <Option active label="定投（每月投入）" />
                <Option label="一次性买入" />
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold text-slate-600">风险偏好</p>
              <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400">
                <div className="ml-[48%] h-5 w-5 -translate-y-1.5 rounded-full border-4 border-white bg-white shadow-md" />
              </div>
              <div className="mt-3 flex justify-between text-sm text-slate-500">
                <span>保守</span>
                <span>平衡</span>
                <span>进取</span>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold text-slate-600">可投资产</p>
              <div className="flex flex-wrap gap-3">
                {mockScenario.investment.data.assets.map((asset) => (
                  <span className="inline-flex items-center gap-2 rounded-[8px] border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-slate-700" key={asset.label}>
                    <CheckCircle2 className="text-indigo-600" size={16} />
                    {asset.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button className="mt-8 w-full rounded-[8px] bg-indigo-600 px-5 py-4 text-lg font-black text-white shadow-[0_14px_30px_rgba(79,70,229,0.28)]">
            一键分配
          </button>
        </Panel>

        <Panel className="p-6">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <h2 className="text-xl font-black">2. 为你生成的投资分配方案</h2>
            <span className="w-fit rounded-[8px] bg-orange-50 px-4 py-2 text-sm font-bold text-orange-500">风险等级：平衡型</span>
          </div>
          <section className="grid gap-5 xl:grid-cols-[0.42fr_0.58fr]">
            <Panel className="shadow-none">
              <h3 className="mb-4 text-lg font-black">资产配置建议</h3>
              <div className="space-y-4">
                {mockScenario.investment.data.assets.map((asset) => (
                  <div className="grid grid-cols-[88px_1fr_44px] items-center gap-4" key={asset.label}>
                    <span className="flex items-center gap-2 font-bold text-slate-700"><AssetIcon label={asset.label} />{asset.label}</span>
                    <span className="h-2 rounded-full bg-slate-100">
                      <span className="block h-2 rounded-full bg-indigo-500" style={{width: `${asset.weight * 2.4}%`}} />
                    </span>
                    <strong className="text-right">{asset.weight}%</strong>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel className="shadow-none">
              <h3 className="mb-4 text-lg font-black">10年收益推演</h3>
              <LineCompareChart
                data={output.portfolio_value_curve}
                lines={[
                  {key: 'value', name: '定投（每月投入）', color: '#3b82f6'},
                  {key: 'optimistic', name: '一次性买入', color: '#8b5cf6'},
                ]}
              />
            </Panel>
          </section>
          <section className="mt-5 grid gap-5 md:grid-cols-3">
            <KpiCard label="预计年化区间" value={`${percent(output.expected_return)} - 10.5%`} hint="基于历史回测" tone="green" />
            <KpiCard label="最大回撤提示" value="-18% ~ -28%" hint={`${input.horizon} 年历史极端区间`} tone="orange" />
            <KpiCard label="适合人群" value="稳健增值型" hint="能承受中等波动" tone="purple" />
          </section>
        </Panel>
      </section>
      <InsightCard>
        <h3 className="text-xl font-black">AI 总结建议</h3>
        <p className="mt-2 leading-7 text-slate-600">
          在平衡风险偏好下，本组合通过全球分散配置实现长期稳健增值。预计最终资产 {money(output.final_value)}，
          累计收益 {money(output.profit)}，建议坚持定投纪律，长期持有并定期再平衡。
        </p>
      </InsightCard>
    </Shell>
  )
}

function Field({label, value}: {label: string; value: string}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <span className="mt-2 flex items-center justify-between rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-2xl font-black text-slate-950">
        {value}
        <small className="text-sm font-bold text-slate-400">元</small>
      </span>
    </label>
  )
}


function Option({label, active}: {label: string; active?: boolean}) {
  return (
    <button className={`rounded-[8px] border px-4 py-3 text-left text-sm font-bold ${active ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500'}`}>
      {label}
    </button>
  )
}

function AssetIcon({label}: {label: string}) {
  const Icon = label.includes('黄金') ? Coins : label.includes('标普') || label.includes('美债') ? Landmark : TrendingUp
  return <Icon className="text-indigo-500" size={18} />
}
