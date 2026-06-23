'use client'

import {useState} from 'react'
import {CalendarClock, CalendarDays, CreditCard, MapPin, PiggyBank, ShieldCheck, Target, WalletCards} from 'lucide-react'
import {LineCompareChart} from '@/components/finance/Charts'
import {Panel, ScenarioTabs, Shell} from '@/components/finance/Ui'
import {PageBottom} from '@/components/finance/PageBottom'
import {Badge} from '@/components/ui/badge'
import {money} from '@/lib/format'
import {calculateRetirement} from '@/lib/scenario/calc'
import {mockScenario} from '@/lib/scenario/mock'

export function RetirementPage() {
  const [region, setRegion] = useState('中国大陆')
  const input = {
    current_age: 30,
    retirement_age: 55,
    current_asset: 300000,
    monthly_saving: 8000,
    monthly_expense: 15000,
  }
  const output = calculateRetirement(mockScenario.retirement.data, input)
  const safeRatio = output.gap > 0 ? '1.42' : '1.60'

  return (
    <Shell>
      <section className="mb-8 border-t-4 border-indigo-500 pt-8">
        <h1 className="text-[42px] font-bold leading-tight tracking-normal text-slate-950 md:text-[56px]">退休计划</h1>
        <p className="mt-4 text-lg font-bold text-slate-600 md:text-xl">估算退休目标、资产积累路径与退休后现金流</p>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_repeat(4,minmax(0,1fr))]">
        <Panel className="min-h-[380px] p-6 md:p-8">
          <h2 className="text-2xl font-bold">计划参数</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Field label="当前年龄" value={`${input.current_age} 岁`} />
            <Field label="计划退休年龄" value={`${input.retirement_age} 岁`} />
            <Field label="每月投入" value={money(input.monthly_saving)} />
            <Field label="已有资产" value={money(input.current_asset)} />
          </div>
          <div className="mt-8">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-600">
              <MapPin className="text-indigo-500" size={18} />
              居住地区
            </p>
            <ScenarioTabs items={['中国大陆', '香港', '新加坡']} active={region} onChange={setRegion} />
          </div>
          <p className="mt-6 text-sm font-bold leading-6 text-slate-500">所有金额均为当前币种，按年化收益率 6% 估算。</p>
        </Panel>

        <RetirementMetricCard
          icon={<PiggyBank size={20} />}
          label="退休目标金额"
          value={money(output.required_fund)}
          hint="按 25 年退休期估算"
          tone="green"
        />
        <RetirementMetricCard
          icon={<CalendarClock size={20} />}
          label="预计可退休年龄"
          value={`${Math.round(output.depletion_age)} 岁`}
          hint={`比计划晚 ${Math.max(0, Math.round(output.depletion_age) - input.retirement_age)} 年`}
          tone="blue"
        />
        <RetirementMetricCard
          icon={<WalletCards size={20} />}
          label="退休后月支出"
          value={money(input.monthly_expense)}
          hint="按当前水平 70% 估算"
          tone="purple"
        />
        <RetirementMetricCard
          icon={<ShieldCheck size={20} />}
          label="现金流安全度"
          value={safeRatio}
          hint="安全（>1.2 为安全）"
          tone="orange"
        />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[0.58fr_0.42fr]">
        <Panel className="p-6">
          <h2 className="mb-4 text-xl font-bold">资产增长推演</h2>
          <LineCompareChart
            data={output.yearly_curve.map((item) => ({
              year: item.age,
              baseline: item.balance,
              optimistic: Math.round(item.balance * 1.18),
              conservative: Math.round(item.balance * 0.82),
            }))}
            lines={[
              {key: 'optimistic', name: '乐观（年化8%）', color: '#16a34a'},
              {key: 'baseline', name: '基准（年化6%）', color: '#3b82f6'},
              {key: 'conservative', name: '保守（年化4%）', color: '#8b5cf6'},
            ]}
          />
          <p className="mt-4 text-sm text-slate-500">假设年化收益和通胀不变，后续可加入税费与费用参数。</p>
        </Panel>

        <Panel className="p-6">
          <h2 className="mb-5 text-xl font-bold">不同地区退休成本（每月）</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Region icon={<Target size={30} />} title="中国大陆" value="¥15,000" tag="经济舒适" tone="green" active={region === '中国大陆'} />
            <Region icon={<CreditCard size={30} />} title="香港" value="¥23,000" tag="舒适" tone="purple" active={region === '香港'} />
            <Region icon={<CalendarDays size={30} />} title="新加坡" value="¥21,000" tag="舒适" tone="orange" active={region === '新加坡'} />
          </div>
          <p className="mt-5 text-sm text-slate-500">包含房租、饮食、交通、医疗、娱乐等基础开支。</p>
        </Panel>
      </section>

      <PageBottom
        summaries={[
          {title: '退休地区', text: `当前选择 ${region}，请结合医疗、房租与通胀压力评估。`},
          {title: '退休目标', text: `目标资金约 ${money(output.required_fund)}，预计可退休年龄 ${Math.round(output.depletion_age)} 岁。`},
          {title: '现金流', text: `退休后月支出按 ${money(input.monthly_expense)} 估算，安全度 ${safeRatio}。`},
          {title: '调整方向', text: '可通过提高月投、延后退休或优化支出增强安全边际。'},
        ]}
      />
    </Shell>
  )
}

function Field({label, value}: {label: string; value: string}) {
  return (
    <label>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <span className="mt-3 block rounded-[8px] border border-slate-200 bg-white px-5 py-4 text-xl font-bold text-slate-950 shadow-sm">{value}</span>
    </label>
  )
}

function RetirementMetricCard({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint: string
  tone: 'green' | 'blue' | 'purple' | 'orange'
}) {
  const colors = {
    green: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-violet-50 text-violet-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <Panel className="min-h-[380px] p-8">
      <Badge className={`mb-10 inline-flex items-center gap-2 border-0 px-4 py-2 text-sm font-bold ${colors[tone]}`}>
        {icon}
        {label}
      </Badge>
      <p className="text-[34px] font-bold leading-tight tracking-tight text-slate-950 md:text-[42px]">{value}</p>
      <p className="mt-5 text-base font-bold leading-7 text-slate-500">{hint}</p>
    </Panel>
  )
}

function Region({icon, title, value, tag, tone, active}: {icon: React.ReactNode; title: string; value: string; tag: string; tone: 'green' | 'purple' | 'orange'; active?: boolean}) {
  const color = tone === 'green' ? 'text-emerald-600 bg-emerald-50' : tone === 'purple' ? 'text-violet-600 bg-violet-50' : 'text-orange-600 bg-orange-50'
  return (
    <section className={`rounded-[8px] border bg-white p-5 text-center transition ${active ? 'border-indigo-300 shadow-[0_12px_30px_rgba(79,70,229,0.14)]' : 'border-slate-200'}`}>
      <span className={`mx-auto grid h-16 w-16 place-items-center rounded-[8px] ${color}`}>{icon}</span>
      <p className="mt-4 font-bold text-slate-700">{title}</p>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <Badge className={`mt-3 inline-flex rounded-full border-0 px-4 py-1 text-sm font-bold ${color}`}>{tag}</Badge>
    </section>
  )
}
