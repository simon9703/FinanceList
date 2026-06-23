import {BriefcaseBusiness, CalendarDays, CreditCard, Target} from 'lucide-react'
import {LineCompareChart} from '@/components/finance/Charts'
import {Input} from '@/components/ui/input'
import {InsightCard, KpiCard, PageHero, Panel, ScenarioTabs, Shell} from '@/components/finance/Ui'
import {money} from '@/lib/format'
import {calculateRetirement} from '@/lib/scenario/calc'
import {mockScenario} from '@/lib/scenario/mock'

export function RetirementPage() {
  const input = {
    current_age: 30,
    retirement_age: 55,
    current_asset: 300000,
    monthly_saving: 8000,
    monthly_expense: 15000,
  }
  const output = calculateRetirement(mockScenario.retirement.data, input)

  return (
    <Shell>
      <PageHero title="退休计划" subtitle="估算退休目标、资产积累路径与退休后现金流" />
      <section className="grid gap-5 xl:grid-cols-[1.45fr_repeat(4,minmax(0,1fr))]">
        <Panel className="p-6">
          <h2 className="text-xl font-bold">计划参数</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="当前年龄" value={`${input.current_age} 岁`} />
            <Field label="计划退休年龄" value={`${input.retirement_age} 岁`} />
            <Field label="每月投入" value={money(input.monthly_saving)} />
            <Field label="已有资产" value={money(input.current_asset)} />
          </div>
          <div className="mt-5">
            <p className="mb-3 text-sm font-bold text-slate-600">居住地区</p>
            <ScenarioTabs items={['中国大陆', '香港', '新加坡']} active="中国大陆" />
          </div>
          <p className="mt-4 text-sm text-slate-500">所有金额均为当前币种，按年化收益率 6% 估算。</p>
        </Panel>

        <section className="grid gap-5 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-4">
          <KpiCard label="退休目标金额" value={money(output.required_fund)} hint="按 25 年退休期估算" tone="green" />
          <KpiCard label="预计可退休年龄" value={`${Math.round(output.depletion_age)} 岁`} hint={`比计划晚 ${Math.max(0, Math.round(output.depletion_age) - input.retirement_age)} 年`} />
          <KpiCard label="退休后月支出" value={money(input.monthly_expense)} hint="按当前水平 70% 估算" tone="purple" />
          <KpiCard label="现金流安全度" value={output.gap > 0 ? '1.42' : '1.60'} hint="安全（>1.2 为安全）" tone="orange" />
        </section>
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
            <Region icon={<Target size={30} />} title="中国大陆" value="¥15,000" tag="经济舒适" tone="green" />
            <Region icon={<CreditCard size={30} />} title="香港" value="¥23,000" tag="舒适" tone="purple" />
            <Region icon={<CalendarDays size={30} />} title="新加坡" value="¥21,000" tag="舒适" tone="orange" />
          </div>
          <p className="mt-5 text-sm text-slate-500">包含房租、饮食、交通、医疗、娱乐等基础开支。</p>
        </Panel>
      </section>

      <InsightCard>
        <div className="grid gap-6 xl:grid-cols-[0.45fr_0.55fr]">
          <section>
            <h3 className="text-xl font-bold">AI 退休摘要</h3>
            <p className="mt-3 rounded-[8px] bg-emerald-50 px-5 py-4 font-bold leading-7 text-emerald-700">
              整体上，您的退休计划基本可行。按基准情景，可在 {Math.round(output.depletion_age)} 岁前保持现金流安全。
            </p>
          </section>
          <section>
            <h3 className="text-xl font-bold">建议调整方向</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Advice title="若希望按计划退休" text="每月投入提高约 11%，或延后退休约 4 个月。" />
              <Advice title="增强安全边际" text="将现金流安全度提升至 1.6，建议月投 ¥9,800。" />
              <Advice title="优化支出结构" text="控制长期支出压力，降低退休后的资金缺口。" />
            </div>
          </section>
        </div>
      </InsightCard>
    </Shell>
  )
}

function Field({label, value}: {label: string; value: string}) {
  return (
    <label>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <Input className="mt-2 h-12 text-lg font-bold" readOnly value={value} />
    </label>
  )
}

function Region({icon, title, value, tag, tone}: {icon: React.ReactNode; title: string; value: string; tag: string; tone: 'green' | 'purple' | 'orange'}) {
  const color = tone === 'green' ? 'text-emerald-600 bg-emerald-50' : tone === 'purple' ? 'text-violet-600 bg-violet-50' : 'text-orange-600 bg-orange-50'
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-5 text-center">
      <span className={`mx-auto grid h-16 w-16 place-items-center rounded-[8px] ${color}`}>{icon}</span>
      <p className="mt-4 font-bold text-slate-700">{title}</p>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <span className={`mt-3 inline-flex rounded-full px-4 py-1 text-sm font-bold ${color}`}>{tag}</span>
    </section>
  )
}

function Advice({title, text}: {title: string; text: string}) {
  return (
    <div className="flex gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-indigo-50 text-indigo-600">
        <BriefcaseBusiness size={20} />
      </span>
      <span>
        <strong className="block text-slate-900">{title}</strong>
        <small className="mt-1 block leading-5 text-slate-500">{text}</small>
      </span>
    </div>
  )
}
