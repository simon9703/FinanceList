import Link from 'next/link'
import type {ReactNode} from 'react'
import {Banknote, ChartNoAxesCombined, CreditCard, UserRound, WalletCards} from 'lucide-react'
import {AssetDonut, ForecastAreaChart, JudgmentLineChart} from '@/components/wealth-charts'
import {cn} from '@/lib/utils'
import {yuan} from '@/lib/format'
import type {Clue, MoneyItem, Profile, Snapshot} from '@/lib/types'

export function ProfileDetailPcPage({profile, moneyItems, clues, snapshots, prefix}: {profile: Profile; moneyItems: MoneyItem[]; clues: Clue[]; snapshots: Snapshot[]; prefix: string}) {
  const assets = moneyItems.filter((item) => item.category === 'asset')
  const expenses = moneyItems.filter((item) => item.category === 'expense')
  const netAsset = profile.totalAsset - profile.totalDebt

  return (
    <section className="hidden min-h-screen w-full bg-[linear-gradient(180deg,#fbfdff,#f4f7ff)] px-24 py-8 lg:block">
      <header className="mb-8 flex items-center justify-between"><Link href={`${prefix}/profiles`} className="text-2xl font-black">AI 财富观察档案</Link><nav className="flex gap-12 font-semibold text-slate-700"><span>首页</span><span>产品介绍</span><span>档案洞察</span><span>案例故事</span><span>帮助中心</span></nav><button className="rounded-xl bg-violet-600 px-6 py-3 font-bold text-white">登录 / 注册</button></header>
      <section className="grid w-full grid-cols-[1fr_1.5fr] gap-8 rounded-[28px] border bg-white/90 p-8 shadow-panel"><div className="flex items-center gap-8"><div className="flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-violet-100"><UserRound className="h-28 w-28" /></div><div><h1 className="text-4xl font-black">{profile.name}</h1><p className="mt-4 text-lg text-slate-500">{[profile.ageRange, profile.maritalStatus, profile.children, profile.city, profile.job].filter(Boolean).join(' · ')}</p><p className="mt-4 text-slate-500">“理性务实的成长型家庭，重视资产稳健增值与教育规划。”</p></div></div><div className="grid grid-cols-5 divide-x text-center"><PcMetric icon={<WalletCards />} label="总资产（估算）" value={yuan(profile.totalAsset)} up /><PcMetric icon={<CreditCard />} label="总负债（估算）" value={yuan(profile.totalDebt)} /><PcMetric icon={<ChartNoAxesCombined />} label="净资产（估算）" value={yuan(netAsset)} up /><PcMetric icon={<Banknote />} label="月收入（估算）" value={yuan(profile.monthlyIncome)} /><PcMetric icon={<Banknote />} label="月支出（估算）" value={yuan(profile.monthlyExpense)} /></div></section>
      <section className="mt-8 grid w-full grid-cols-3 gap-7"><PcPanel title="资产结构"><AssetDonut items={assets} total={profile.totalAsset} /></PcPanel><PcPanel title="收入能力"><JudgmentLineChart snapshots={snapshots} /></PcPanel><PcPanel title="支出压力"><AssetDonut items={expenses} total={profile.monthlyExpense} /></PcPanel><PcPanel title="线索列表"><div className="space-y-4">{clues.slice(0,3).map((c) => <div key={c.id} className="rounded-xl bg-slate-50 p-4 font-semibold">{c.content.slice(0, 36)}</div>)}</div></PcPanel><PcPanel title="判断变化"><JudgmentLineChart snapshots={snapshots} /></PcPanel><PcPanel title="未来推演"><ForecastAreaChart snapshots={snapshots} /></PcPanel></section>
    </section>
  )
}

function PcPanel({title, children}: {title: string; children: ReactNode}) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel"><h2 className="mb-4 truncate text-lg font-bold">{title}</h2>{children}</section>
}

function PcMetric({icon, label, value, up}: {icon: ReactNode; label: string; value: string; up?: boolean}) {
  return <div className="px-5 py-4"><div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center text-primary [&>svg]:h-8 [&>svg]:w-8">{icon}</div><div className="text-sm font-semibold text-slate-500">{label}</div><div className="mt-3 text-3xl font-black">{value}</div><div className={cn('mt-2 text-sm font-bold', up ? 'text-emerald-600' : 'text-rose-500')}>较上期 {up ? '↑ 4.2%' : '↑ 2.7%'}</div></div>
}
