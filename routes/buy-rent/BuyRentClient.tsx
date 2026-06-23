'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import Link from 'next/link'
import {ArrowRight, BadgeInfo, CheckCircle2, Home, Info, Loader2, RefreshCw, SlidersHorizontal} from 'lucide-react'
import {LineCompareChart} from '@/components/finance/Charts'
import {PageBottom} from '@/components/finance/PageBottom'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Slider} from '@/components/ui/slider'
import {pageFrame, panelClass} from '@/components/finance/Ui'
import {cn} from '@/lib/utils'
import {money, percent} from '@/lib/format'
import {calculateBuyRent} from '@/lib/scenario/calc'
import {mockScenario} from '@/lib/scenario/mock'
import type {BuyRentAIData, BuyRentInput, Scenario, ScenarioSource} from '@/lib/scenario/types'

type ParameterConfig = {
  key: keyof BuyRentAIData
  label: string
  min: number
  max: number
  step: number
  format: (value: number) => string
  hint: string
}

const MIN_LOAN_YEARS = 5
const MAX_LOAN_YEARS = 30

const parameters: ParameterConfig[] = [
  {key: 'house_price', label: '房子总价', min: 100000, max: 10000000, step: 100000, format: (v) => money(v), hint: '10万     160万     1000万'},
  {key: 'down_payment_ratio', label: '首付比例', min: 0.1, max: 0.5, step: 0.01, format: (v) => percent(v, 0), hint: '10%       30%       50%'},
  {key: 'mortgage_rate', label: '贷款利率', min: 0, max: 0.05, step: 0.0005, format: (v) => percent(v, 2), hint: '0%       2.5%       5%'},
  {key: 'loan_years', label: '贷款年限', min: MIN_LOAN_YEARS, max: MAX_LOAN_YEARS, step: 1, format: (v) => `${v} 年`, hint: '5年       15年       30年'},
  {key: 'price_growth', label: '房价涨幅', min: -0.1, max: 0.1, step: 0.001, format: (v) => `${percent(v, 1)} / 年`, hint: '-10%       0%       10%'},
  {key: 'rent', label: '月租金', min: 2000, max: 20000, step: 500, format: (v) => money(v), hint: '2千       8千       2万'},
  {key: 'rent_growth', label: '租金涨幅', min: -0.05, max: 0.06, step: 0.001, format: (v) => percent(v, 1), hint: '-5%       0%       6%'},
  {key: 'investment_return', label: '投资收益率', min: -0.12, max: 0.12, step: 0.001, format: (v) => `${percent(v, 1)} / 年`, hint: '-12%      0%      12%'},
]

function normalizeBuyRentData(data: BuyRentAIData): BuyRentAIData {
  return {
    ...data,
    loan_years: Math.min(MAX_LOAN_YEARS, Math.max(MIN_LOAN_YEARS, data.loan_years)),
  }
}

export function BuyRentClient() {
  const paramRef = useRef<HTMLDivElement>(null)
  const [scenario, setScenario] = useState<Scenario<BuyRentAIData>>(mockScenario.buy_rent)
  const [source, setSource] = useState<ScenarioSource>('mock')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<BuyRentAIData>(mockScenario.buy_rent.data)
  const [input, setInput] = useState<BuyRentInput>({years: 30, risk_mode: 'mid'})

  const output = useMemo(() => calculateBuyRent(data, input), [data, input])
  const finalChartPoint = output.chart[output.chart.length - 1]

  async function loadScenario(regenerate = false) {
    setLoading(true)
    try {
      const response = await fetch('/api/scenarios', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          module: 'buy_rent',
          mode: process.env.NEXT_PUBLIC_SCENARIO_MODE === 'ai_cache' ? 'ai_cache' : 'mock',
          regenerate,
        }),
      })
      const json = await response.json()
      const nextScenario = json.scenario as Scenario<BuyRentAIData>
      const nextData = normalizeBuyRentData(nextScenario.data)
      setScenario({...nextScenario, data: nextData})
      setSource(json.source ?? 'mock')
      setData(nextData)
      setInput((current) => ({...current, years: nextData.loan_years}))
    } catch {
      setScenario(mockScenario.buy_rent)
      setSource('mock')
      const fallbackData = normalizeBuyRentData(mockScenario.buy_rent.data)
      setData(fallbackData)
      setInput((current) => ({...current, years: fallbackData.loan_years}))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadScenario(false)
  }, [])

  function setParameter(key: ParameterConfig['key'], value: number) {
    setData((current) => ({...current, [key]: value}))
    if (key === 'loan_years') {
      setInput((current) => ({...current, years: value}))
    }
  }

  function scrollToParams() {
    paramRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'})
  }

  return (
    <main className="min-h-screen bg-[#f7f9ff] text-slate-950">
      <div className={pageFrame}>
        <section className="mb-7">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-[42px] font-bold tracking-normal lg:text-[52px]">
                买房 <span className="text-indigo-600">vs</span> 租房
              </h1>
              <p className="mt-3 text-xl text-slate-600">比较住房成本、资产增长与资金灵活性</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge className="rounded-full border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-500">
                数据源：{source === 'mock' ? 'Mock' : source === 'cache' ? 'Cache' : 'AI'}
              </Badge>
              <Button
                variant="outline"
                className="rounded-[8px] bg-white px-4 py-2 font-bold text-slate-700 shadow-sm"
                disabled={loading}
                onClick={() => loadScenario(true)}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                重新生成
              </Button>
            </div>
          </div>
        </section>

        <section ref={paramRef} className={cn(panelClass, 'p-5')}>
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-8">
            {parameters.map((item) => {
              const value = Number(data[item.key])
              return (
                <label className="border-slate-100 md:border-r md:pr-4 md:last:border-r-0" key={item.key}>
                  <span className="block text-sm font-bold text-slate-600">{item.label}</span>
                  <span className="mt-3 block text-lg font-bold">{item.format(value)}</span>
                  <Slider
                    className="mt-4"
                    max={item.max}
                    min={item.min}
                    step={item.step}
                    value={value}
                    onChange={(event) => setParameter(item.key, Number(event.target.value))}
                  />
                  <span className="mt-2 block whitespace-pre text-xs text-slate-400">{item.hint}</span>
                </label>
              )
            })}
          </div>
        </section>

        <div className="mt-4 flex flex-col justify-between gap-3 text-sm text-slate-400 lg:flex-row">
          <span className="inline-flex items-center gap-2">
            <BadgeInfo size={16} />
            基于当前市场平均水平的估算，实际结果可能因个人情况和市场变化而有所不同。
          </span>
          <span>所有金额均为当前价格（人民币）</span>
        </div>

        <section className="mt-6 grid gap-5 xl:grid-cols-[0.78fr_0.78fr_1.4fr_0.95fr]">
          <AssetPanel
            color="green"
            icon={<Home size={34} />}
            title="买房资产"
            rows={[
              ['房产价值（估算）', money(output.buy.property_value)],
              ['剩余贷款', money(output.buy.remaining_loan)],
              ['买房净资产', money(output.buy.net_worth)],
            ]}
            footer={[
              ['月供（含税费）', money(output.buy.monthly_payment)],
              ['总利息支出', money(output.buy.total_interest)],
              ['租售比', `1 : ${Math.max(1, Math.round(1 / output.buy.rent_buy_ratio))}`],
            ]}
          />

          <AssetPanel
            color="purple"
            icon={<SlidersHorizontal size={34} />}
            title="租房投资"
            rows={[
              ['累计租房支出', money(output.rent.total_cost)],
              ['投资资产（估算）', money(output.rent.net_worth)],
              ['资金灵活性评分', output.rent.liquidity_score],
            ]}
            footer={[
              ['月租金（首年）', money(output.rent.first_year_rent)],
              ['可投资金额（首年）', money(output.rent.first_year_investable)],
              ['流动性', '100%'],
            ]}
          />

          <section className={cn(panelClass, 'p-6')}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                净资产对比曲线
                <Info className="text-slate-400" size={20} aria-label="信息" />
              </h2>
              <Button type="button" variant="outline" className="rounded-[8px] px-4 py-2 text-sm font-bold text-slate-500">当前价格</Button>
            </div>
            <LineCompareChart
              data={output.chart}
              lines={[
                {key: 'buy', name: '买房净资产', color: '#10b981'},
                {key: 'rent', name: '租房投资资产', color: '#6366f1'},
              ]}
            />
            <p className="mt-4 rounded-[8px] bg-indigo-50 px-4 py-3 text-sm text-slate-600">
              {output.summary.crossover_year
                ? `在第 ${output.summary.crossover_year} 年，租房投资资产超过买房净资产。`
                : `${input.years} 年内买房净资产保持领先。`}
            </p>
          </section>

          <section className={cn(panelClass, 'p-6')}>
            <h2 className="mb-5 text-xl font-bold">对比总结</h2>
            <SummaryBlock
              title={`成本对比（${input.years}年）`}
              rows={[
                ['买房总成本（含利息）', money(output.buy.total_cost), 'green'],
                ['租房总支出', money(output.rent.total_cost), 'purple'],
                ['差额（买房 - 租房）', money(output.buy.total_cost - output.rent.total_cost), 'orange'],
              ]}
            />
            <SummaryBlock
              title={`最终资产对比（${input.years}年后）`}
              rows={[
                ['买房净资产', money(finalChartPoint.buy), 'green'],
                ['租房投资资产', money(finalChartPoint.rent), 'purple'],
                ['差额（租房 - 买房）', money(finalChartPoint.rent - finalChartPoint.buy), 'purple'],
              ]}
            />
            <Link
              className="mt-5 flex items-center justify-between rounded-[8px] bg-indigo-50 p-5 text-indigo-700 transition hover:bg-indigo-100"
              href="/investment"
            >
              <span>
                <span className="block text-lg font-bold">建议</span>
                <span className="mt-1 block text-2xl font-bold">
                  {output.summary.winner === 'rent' ? '租房 + 投资' : '买房持有'}
                </span>
                <span className="mt-2 block text-sm text-slate-500">
                  在当前参数下，{output.summary.winner === 'rent' ? '租房并投资更优' : '买房持有更优'}，优势约 {money(output.summary.diff)}。
                </span>
              </span>
              <ArrowRight size={22} />
            </Link>
          </section>
        </section>

        <PageBottom
          loading={loading}
          onGenerate={() => loadScenario(true)}
          summaries={[
            {title: '买房资产', text: `${input.years} 年内买房净资产约 ${money(finalChartPoint.buy)}，适合重视稳定居住的人群。`},
            {title: '租房投资', text: `租房投资资产约 ${money(finalChartPoint.rent)}，资金灵活性评分 ${output.rent.liquidity_score}。`},
            {title: '成本差额', text: `买房与租房总成本差额约 ${money(output.buy.total_cost - output.rent.total_cost)}。`},
            {title: '当前建议', text: output.summary.winner === 'rent' ? '当前参数下租房并投资更优。' : '当前参数下买房持有更优。'},
          ]}
        />

        <p className="mt-5 text-center text-sm text-slate-400">本测算结果仅供参考，不构成任何投资或财务建议，请结合自身情况谨慎决策。</p>
      </div>
    </main>
  )
}

function AssetPanel({
  color,
  icon,
  title,
  rows,
  footer,
}: {
  color: 'green' | 'purple'
  icon: React.ReactNode
  title: string
  rows: [string, string][]
  footer: [string, string][]
}) {
  const colorClass = color === 'green' ? 'text-emerald-600 bg-emerald-50' : 'text-indigo-600 bg-indigo-50'
  return (
    <section className={cn(panelClass, 'p-6')}>
      <div className="flex items-center gap-5">
        <span className={`grid h-16 w-16 place-items-center rounded-[8px] ${colorClass}`}>{icon}</span>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="mt-8 space-y-6">
        {rows.map(([label, value], index) => (
          <div key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`mt-2 text-3xl font-bold ${index === rows.length - 1 ? (color === 'green' ? 'text-emerald-600' : 'text-indigo-600') : 'text-slate-950'}`}>
              {value}
            </p>
          </div>
        ))}
      </div>
      <div className={`mt-8 grid grid-cols-3 gap-2 rounded-[8px] p-4 text-center ${color === 'green' ? 'bg-emerald-50/60' : 'bg-indigo-50/60'}`}>
        {footer.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-bold text-slate-950">{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SummaryBlock({title, rows}: {title: string; rows: [string, string, string][]}) {
  const tone = {
    green: 'before:bg-emerald-500',
    purple: 'before:bg-indigo-500',
    orange: 'before:bg-orange-500 text-orange-600',
  } as const

  return (
    <div className="mb-4 rounded-[8px] bg-slate-50 p-4">
      <h3 className="mb-3 font-bold text-slate-600">{title}</h3>
      <div className="space-y-3">
        {rows.map(([label, value, color]) => (
          <div className="flex items-center justify-between gap-3 text-sm" key={label}>
            <span className={`relative pl-4 text-slate-600 before:absolute before:left-0 before:top-1.5 before:h-2 before:w-2 before:rounded-full ${tone[color as keyof typeof tone]}`}>
              {label}
            </span>
            <strong className={color === 'orange' ? 'text-orange-600' : 'text-slate-950'}>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
