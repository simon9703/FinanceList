import Link from 'next/link'
import type {ReactNode} from 'react'
import {
  ArrowLeft,
  ArrowUp,
  Banknote,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ChevronRight,
  CircleEllipsis,
  CreditCard,
  House,
  Landmark,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards,
} from 'lucide-react'
import {AssetDonut, ForecastAreaChart, JudgmentLineChart} from '@/components/wealth-charts'
import {getProfileDetail} from '@/lib/repository'
import {cn} from '@/lib/utils'
import {shortYuan, yuan} from '@/lib/format'

const clueCategories = [
  {name: '房产', sub: '相关', count: '3', Icon: House, color: 'text-blue-600'},
  {name: '投资', sub: '相关', count: '4', Icon: ChartNoAxesCombined, color: 'text-blue-600'},
  {name: '收入', sub: '相关', count: '2', Icon: WalletCards, color: 'text-blue-600'},
  {name: '支出', sub: '相关', count: '3', Icon: Banknote, color: 'text-orange-500'},
  {name: '信用', sub: '相关', count: '1', Icon: CreditCard, color: 'text-emerald-600'},
  {name: '其他', sub: '', count: '1', Icon: CircleEllipsis, color: 'text-slate-600'}
]

export default async function ProfileDetailPage({params}: {params: {locale: string; id: string}}) {
  const detail = await getProfileDetail(params.id)
  const prefix = params.locale === 'en' ? '/en' : ''

  if (!detail) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
        <Link href={`${prefix}/profiles`} className="inline-flex items-center gap-2 text-sm text-slate-500">
          <ArrowLeft className="h-4 w-4" />
          返回
        </Link>
        <p className="mt-10 text-center text-slate-500">没有找到该档案</p>
      </main>
    )
  }

  const {profile, moneyItems, clues, snapshots} = detail
  const assets = moneyItems.filter((item) => item.category === 'asset')
  const income = moneyItems.filter((item) => item.category === 'income')
  const expenses = moneyItems.filter((item) => item.category === 'expense')
  const netAsset = profile.totalAsset - profile.totalDebt
  const monthlySurplus = profile.monthlyIncome - profile.monthlyExpense

  return (
    <main className="min-h-screen bg-[#f7faff] px-4 py-6">
      <div className="mx-auto w-full max-w-[430px] rounded-[34px] bg-white px-4 pb-5 pt-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
        <TopBar backHref={`${prefix}/profiles`} title="档案详情" />

        <section className="mt-7 grid grid-cols-[82px_1fr_116px] items-center gap-3">
          <div className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-300">
            <UserRound className="h-11 w-11 text-slate-700" strokeWidth={1.7} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-2xl font-black">{profile.name}</h1>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">{profile.confidence >= 82 ? '中风险' : '低风险'}</span>
            </div>
            <p className="mt-2 truncate text-sm text-slate-500">{[profile.ageRange, profile.job, profile.city].filter(Boolean).join(' · ')}</p>
            <p className="mt-1 truncate text-sm text-slate-500">{profile.children || profile.maritalStatus}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
            <div className="text-xs font-semibold text-slate-500">综合财富信心</div>
            <div className="mt-1 flex items-center justify-center gap-1">
              <span className="text-2xl font-black">{profile.confidence}%</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                <ArrowUp className="h-3 w-3" />
              </span>
            </div>
            <div className="mt-1 text-xs font-bold text-emerald-600">较上次评估 +3.2%</div>
          </div>
        </section>

        <Panel title="当前财富判断" icon={<Sparkles className="h-5 w-5 text-primary" />}>
          <div className="grid grid-cols-3 gap-y-5 divide-x divide-slate-100">
            <JudgeMetric icon={<House />} label="总资产（估值）" value={yuan(profile.totalAsset)} tone="blue" />
            <JudgeMetric icon={<CreditCard />} label="总负债（未结清）" value={yuan(profile.totalDebt)} tone="orange" />
            <JudgeMetric icon={<ChartNoAxesCombined />} label="净资产" value={yuan(netAsset)} tone="green" />
            <JudgeMetric icon={<WalletCards />} label="月收入（估计）" value={yuan(profile.monthlyIncome)} tone="blue" />
            <JudgeMetric icon={<Banknote />} label="月支出（估计）" value={yuan(profile.monthlyExpense)} tone="orange" />
            <JudgeMetric icon={<ChartNoAxesCombined />} label="月度盈余能力" value={yuan(monthlySurplus)} tone="green" />
          </div>
        </Panel>

        <Panel title="资产结构" action>
          <AssetDonut items={assets} total={profile.totalAsset} />
        </Panel>

        <section className="mt-3 grid grid-cols-3 gap-2">
          <AbilityCard icon={<WalletCards />} title="收入能力" value={`${yuan(profile.monthlyIncome)} /月`} label="收入稳定性" status="高" tone="green" active={5} />
          <AbilityCard icon={<Banknote />} title="支出压力" value={`${yuan(profile.monthlyExpense)} /月`} label="支出压力" status="中等" tone="orange" active={2} />
          <AbilityCard icon={<BriefcaseBusiness />} title="线索总览" value={`${clues.length + 13} 条`} label="待核实线索" status="3条" tone="purple" active={2} />
        </section>

        <Panel title={`线索列表（共${clues.length + 13}条）`} action>
          <div className="grid grid-cols-6 gap-2">
            {clueCategories.map(({name, sub, count, Icon, color}) => (
              <div key={name} className="min-w-0 text-center">
                <Icon className={cn('mx-auto h-7 w-7', color)} />
                <div className="mt-1 truncate text-xs font-semibold text-slate-600">{name}</div>
                <div className="text-[11px] text-slate-400">{sub}</div>
                <div className="mt-1 text-base font-black">{count}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="判断变化（近6次评估）" badge="净资产 +¥120,000">
          <div className="mb-2 flex items-center gap-5 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-blue-500" />净资产</span>
            <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-emerald-500" />信心分</span>
          </div>
          <JudgmentLineChart snapshots={snapshots} />
        </Panel>

        <Panel title="未来预测" subtitle="基于当前数据">
          <div className="grid grid-cols-[145px_1fr] items-end gap-3">
            <div>
              <div className="text-sm text-slate-500">5年后净资产预计</div>
              <div className="mt-2 text-2xl font-black">{shortYuan(netAsset + 1200000)}</div>
              <div className="mt-3 inline-flex rounded-full bg-violet-50 px-3 py-1 text-sm font-black text-violet-600">年化增长率 7.3%</div>
            </div>
            <ForecastAreaChart snapshots={snapshots} />
          </div>
        </Panel>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link href={`${prefix}/profiles/${profile.id}/clues/new`} className="flex h-12 items-center justify-center rounded-xl bg-primary text-base font-black text-white shadow-[0_12px_26px_rgba(40,120,255,0.25)]">
            添加线索
          </Link>
          <Link href={`${prefix}/profiles/${profile.id}/edit`} className="flex h-12 items-center justify-center rounded-xl bg-slate-100 text-base font-black text-slate-700">
            编辑判断
          </Link>
        </div>
      </div>
    </main>
  )
}

function TopBar({backHref, title}: {backHref: string; title: string}) {
  return (
    <header className="grid grid-cols-[44px_1fr_90px] items-center">
      <Link href={backHref} className="flex h-11 w-11 items-center justify-center rounded-full text-slate-950">
        <ArrowLeft className="h-7 w-7" />
      </Link>
      <div className="text-center text-xl font-black">{title}</div>
      <button className="flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white" type="button">
        <CircleEllipsis className="h-6 w-6" />
        <span className="h-5 w-px bg-slate-200" />
        <Landmark className="h-5 w-5" />
      </button>
    </header>
  )
}

function Panel({title, icon, subtitle, badge, action, children}: {title: string; icon?: ReactNode; subtitle?: string; badge?: string; action?: boolean; children: ReactNode}) {
  return (
    <section className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {icon}
          <h2 className="truncate text-lg font-black">{title}</h2>
          {subtitle ? <span className="truncate text-sm font-semibold text-slate-400">（{subtitle}）</span> : null}
        </div>
        {badge ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-600">{badge}</span> : null}
        {action ? <ChevronRight className="h-6 w-6 shrink-0 text-slate-950" /> : null}
      </div>
      {children}
    </section>
  )
}

function JudgeMetric({icon, label, value, tone}: {icon: ReactNode; label: string; value: string; tone: 'blue' | 'orange' | 'green'}) {
  const toneClass = {
    blue: 'text-blue-600',
    orange: 'text-orange-500',
    green: 'text-emerald-600'
  }[tone]

  return (
    <div className="min-w-0 px-3 first:pl-0">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
        <span className={cn('[&>svg]:h-5 [&>svg]:w-5', toneClass)}>{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-2 truncate text-xl font-black">{value}</div>
    </div>
  )
}

function AbilityCard({icon, title, value, label, status, tone, active}: {icon: ReactNode; title: string; value: string; label: string; status: string; tone: 'green' | 'orange' | 'purple'; active: number}) {
  const toneClass = {
    green: 'text-emerald-600 bg-emerald-50',
    orange: 'text-orange-500 bg-orange-50',
    purple: 'text-violet-600 bg-violet-50'
  }[tone]
  const barClass = {
    green: 'bg-emerald-500',
    orange: 'bg-orange-500',
    purple: 'bg-violet-500'
  }[tone]

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-panel">
      <div className="flex items-center gap-2">
        <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg [&>svg]:h-5 [&>svg]:w-5', toneClass)}>{icon}</span>
        <div className="truncate text-sm font-black">{title}</div>
      </div>
      <div className="mt-3 truncate text-lg font-black">{value}</div>
      <div className="mt-4 flex items-center justify-between gap-2 text-xs">
        <span className="truncate text-slate-500">{label}</span>
        <span className={cn('shrink-0 font-black', tone === 'orange' ? 'text-orange-500' : 'text-emerald-600')}>{status}</span>
      </div>
      <div className="mt-3 flex gap-1">
        {[0, 1, 2, 3, 4].map((item) => (
          <span key={item} className={cn('h-2 flex-1 rounded-full', item < active ? barClass : 'bg-slate-100')} />
        ))}
      </div>
    </div>
  )
}
