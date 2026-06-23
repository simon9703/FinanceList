'use client'

import Link from 'next/link'
import {useMemo, useState} from 'react'
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  FileText,
  Home,
  House,
  Landmark,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Umbrella,
} from 'lucide-react'
import {AllocationPie, LineCompareChart, StackedCostChart} from '@/components/finance/Charts'
import {Button} from '@/components/ui/button'
import {pageFrame, panelClass} from '@/components/finance/Ui'
import {cn} from '@/lib/utils'
import {money, percent} from '@/lib/format'
import {calculateBuyRent, calculateInvestment, calculateLivingCost, calculateRetirement} from '@/lib/scenario/calc'
import {mockScenario} from '@/lib/scenario/mock'

const modules = [
  {key: 'buy_rent', title: '生活决策', subtitle: '比较买房租房、居住城市等生活选择', icon: House, href: '/buy-rent'},
  {key: 'investment', title: '投资协助', subtitle: '生成科学资产配置方案，优化投资组合', icon: BarChart3, href: '/investment'},
  {key: 'living_cost', title: '城市成本', subtitle: '对比城市生活成本，选择最优生活地', icon: Building2, href: '/living-cost'},
  {key: 'retirement', title: '退休计划', subtitle: '规划退休目标与现金流，实现安心晚年', icon: Umbrella, href: '/retirement'},
] as const

export function HomeDashboard() {
  const [updatedAt, setUpdatedAt] = useState('2024-05-15')
  const [loading, setLoading] = useState(false)

  const outputs = useMemo(() => {
    const buyRent = calculateBuyRent(mockScenario.buy_rent.data, {years: 30, risk_mode: 'mid'})
    const investment = calculateInvestment(mockScenario.investment.data, {
      initial_amount: 100000,
      monthly_invest: 3000,
      risk_level: 'medium',
      horizon: 10,
    })
    const living = calculateLivingCost(mockScenario.living_cost.data, {
      city: '广州',
      monthly_income: 18000,
      lifestyle: 'normal',
    })
    const retirement = calculateRetirement(mockScenario.retirement.data, {
      current_age: 30,
      retirement_age: 60,
      current_asset: 300000,
      monthly_saving: 8000,
      monthly_expense: 15000,
    })
    return {buyRent, investment, living, retirement}
  }, [])

  async function regenerate() {
    setLoading(true)
    await fetch('/api/scenarios/dashboard', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({mode: 'mock', regenerate: true}),
    }).catch(() => null)
    setUpdatedAt(new Date().toISOString().slice(0, 10))
    setLoading(false)
  }

  const cityChart = outputs.living.chart.map((item) => ({
    ...item,
    total: item.rent + item.food + item.transport + item.taxAndInsurance + item.other,
  }))

  return (
    <main className="min-h-screen bg-[#f7f9ff] text-slate-950">
      <div className={pageFrame}>
        <section className="grid min-h-[270px] items-center gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <h1 className="text-[38px] font-bold leading-tight tracking-normal text-slate-950 md:text-[48px] lg:text-[58px]">
              把复杂决策，
              <br />
              变成<span className="text-indigo-600">清晰方案。</span>
            </h1>
            <p className="mt-5 text-xl text-slate-600">多维度数据分析，帮你做出更明智的财务决策。</p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
              {[
                [Home, '买房还是租房', '/buy-rent'],
                [House, '10 万怎么配置', '/investment'],
                [Landmark, '深圳还是新加坡', '/living-cost'],
                [Umbrella, '几岁可以退休', '/retirement'],
              ].map(([Icon, label, href]) => (
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600"
                  href={href as string}
                  key={label as string}
                >
                  <Icon size={17} />
                  {label as string}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative hidden min-h-[250px] overflow-hidden rounded-[8px] lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_30%,rgba(99,102,241,0.24),transparent_34%),linear-gradient(135deg,#eef4ff,#ffffff_64%)]" />
            <div className="absolute bottom-10 left-28 h-32 w-72 rounded-full border border-indigo-100 bg-indigo-100/50" />
            <div className="absolute right-20 top-8 h-44 w-56 rounded-[8px] border border-indigo-100 bg-white/65 p-5 shadow-[0_24px_70px_rgba(79,70,229,0.18)] backdrop-blur">
              <div className="h-4 w-28 rounded bg-indigo-100" />
              <div className="mt-7 flex items-center gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-full border-[12px] border-indigo-500 border-r-indigo-100" />
                <div className="space-y-3">
                  <div className="h-3 w-20 rounded bg-indigo-100" />
                  <div className="h-3 w-14 rounded bg-indigo-100" />
                  <div className="h-3 w-24 rounded bg-indigo-100" />
                </div>
              </div>
            </div>
            <div className="absolute left-16 top-20 h-40 w-36 rounded-[8px] border border-indigo-100 bg-white/70 p-5 shadow-[0_20px_60px_rgba(79,70,229,0.14)] backdrop-blur">
              <BarChart3 className="text-indigo-500" size={68} />
              <ArrowRight className="mt-4 rotate-[-35deg] text-indigo-500" size={42} />
            </div>
            <div className="absolute bottom-14 right-5 h-32 w-40 rounded-[8px] border border-indigo-100 bg-white/70 p-5 shadow-[0_20px_60px_rgba(79,70,229,0.14)] backdrop-blur">
              <div className="flex h-full items-end gap-3">
                {[40, 72, 55, 95].map((height) => (
                  <span className="w-6 rounded-t bg-indigo-400/70" style={{height}} key={height} />
                ))}
              </div>
            </div>
            <div className="absolute right-16 top-16 grid h-12 w-12 place-items-center rounded-full bg-indigo-500 text-white shadow-lg">
              <CheckCircle2 size={28} />
            </div>
          </div>
        </section>

        <section className={cn(panelClass, 'mt-8 grid gap-0 overflow-hidden lg:grid-cols-4')}>
          {modules.map((item, index) => {
            const Icon = item.icon
            return (
              <Link
                href={item.href}
                className="flex items-center gap-5 border-slate-100 p-6 transition hover:bg-indigo-50/40 lg:border-r lg:last:border-r-0"
                key={item.key}
              >
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[8px] bg-indigo-50 text-indigo-600">
                  <Icon size={34} />
                </span>
                <span>
                  <strong className="block text-lg">{item.title}</strong>
                  <small className="mt-1 block leading-6 text-slate-500">{item.subtitle}</small>
                </span>
              </Link>
            )
          })}
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-4">
          <PreviewCard title="买房 vs 租房（深圳）" href="/buy-rent">
            <div className="grid grid-cols-3 gap-1 rounded-[8px] border bg-slate-50 p-1 text-center text-sm font-bold">
              <span className="rounded-[6px] bg-white py-2 text-indigo-600 shadow-sm">买房</span>
              <span className="col-span-2 py-2 text-slate-500">租房</span>
            </div>
            <MetricRow label="月度成本（元）" valueA={money(outputs.buyRent.buy.monthly_payment)} valueB={money(mockScenario.buy_rent.data.rent)} />
            <MetricRow label="5 年总成本（元）" valueA={money(outputs.buyRent.buy.total_cost / 6)} valueB={money(outputs.buyRent.rent.total_cost / 6)} />
            <MetricRow label="资产增值（估算）" valueA={`+${money(outputs.buyRent.summary.diff, true)}`} valueB="-" green />
            <div className="mt-4 rounded-[8px] bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              租房更优，总成本低约 {money(452000, true)}
            </div>
          </PreviewCard>

          <PreviewCard title="投资组合预览（平衡型）" href="/investment">
            <AllocationPie data={mockScenario.investment.data.assets.map((asset) => ({name: asset.label, weight: asset.weight}))} compact />
            <div className="mt-2 rounded-[8px] bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              风险偏好：平衡型
              <span className="block font-normal text-emerald-600">适合追求长期稳健增长的投资者</span>
            </div>
          </PreviewCard>

          <PreviewCard title="城市生活成本对比（月均，基础版）" href="/living-cost">
            <StackedCostChart data={cityChart} compact />
            <div className="mt-2 rounded-[8px] bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              广州生活成本最低，月均约 {money(outputs.living.monthly_total)}
            </div>
          </PreviewCard>

          <PreviewCard title="退休资产增长预览" href="/retirement">
            <LineCompareChart
              compact
              data={outputs.retirement.yearly_curve.filter((item) => item.age % 10 === 0).map((item) => ({year: item.age, value: item.balance}))}
              lines={[{key: 'value', name: '60岁退休', color: '#6366f1'}]}
            />
            <div className="mt-2 rounded-[8px] bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              建议 60 岁退休，资产更充足
            </div>
          </PreviewCard>
        </section>

        <section className={cn(panelClass, 'mt-6 border-indigo-100 p-5')}>
          <div className="grid items-center gap-5 lg:grid-cols-[84px_1fr_120px]">
            <div className="grid h-20 w-20 place-items-center rounded-[8px] bg-indigo-50 text-indigo-500">
              <Sparkles size={38} />
            </div>
            <div>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-xl font-bold">AI 总结</h2>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">本周推荐</span>
              </div>
              <div className="grid gap-4 text-sm lg:grid-cols-4">
                <SummaryItem title="生活决策" text="租房更优，5 年可节省约 45.2 万，同时保留资金灵活性。" />
                <SummaryItem title="投资建议" text={`平衡型组合预期年化收益 ${percent(outputs.investment.expected_return)}，适合长期稳健增长。`} />
                <SummaryItem title="城市选择" text="广州生活成本最低，性价比更高。" />
                <SummaryItem title="退休规划" text="建议 60 岁退休，可实现更充足的退休资产。" />
              </div>
            </div>
            <div className="rounded-[8px] bg-orange-50 px-4 py-5 text-center">
              <ShieldCheck className="mx-auto text-orange-500" size={24} />
              <p className="mt-2 text-sm font-bold text-orange-600">适合人群</p>
              <p className="mt-2 text-lg font-bold text-indigo-600">稳健增值型</p>
              <p className="mt-1 text-xs text-slate-500">风险等级：中等</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.25fr_0.75fr_1fr_0.9fr]">
          <div className="flex items-center gap-3 rounded-[8px] border bg-white px-5 py-4 text-slate-500 shadow-sm">
            <RefreshCw size={20} />
            数据更新：{updatedAt}
          </div>
          <Button className="h-auto justify-center gap-3 px-5 py-4 font-bold text-slate-700" size="auto" type="button" variant="outline">
            <SlidersHorizontal className="text-indigo-500" size={22} />
            参数调整
          </Button>
          <Button
            className="h-auto justify-center gap-3 px-5 py-4 font-bold disabled:opacity-70"
            disabled={loading}
            onClick={regenerate}
            size="auto"
            type="button"
            variant="finance"
          >
            <Sparkles size={22} />
            {loading ? '生成中...' : '一键生成个性化方案'}
          </Button>
          <Link className="flex items-center justify-center gap-3 rounded-[8px] border bg-white px-5 py-4 font-bold text-slate-700 shadow-sm" href="/buy-rent">
            <FileText className="text-indigo-500" size={22} />
            查看案例
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </main>
  )
}

function PreviewCard({title, href, children}: {title: string; href: string; children: React.ReactNode}) {
  return (
    <Link href={href} className={cn(panelClass, 'p-4 transition hover:border-indigo-300')}>
      <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
        {title}
        <span className="grid h-4 w-4 place-items-center rounded-full border text-[10px] text-slate-400">i</span>
      </h3>
      {children}
    </Link>
  )
}

function MetricRow({label, valueA, valueB, green}: {label: string; valueA: string; valueB: string; green?: boolean}) {
  return (
    <div className="mt-3 grid grid-cols-[1.4fr_1fr_1fr] text-sm">
      <span className="text-slate-500">{label}</span>
      <strong className={green ? 'text-emerald-600' : 'text-slate-950'}>{valueA}</strong>
      <strong className="text-slate-700">{valueB}</strong>
    </div>
  )
}

function SummaryItem({title, text}: {title: string; text: string}) {
  return (
    <div className="border-slate-200 lg:border-r lg:pr-4 lg:last:border-r-0">
      <p className="font-bold text-slate-900">{title}</p>
      <p className="mt-1 leading-6 text-slate-500">{text}</p>
    </div>
  )
}


