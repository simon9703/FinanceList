import Link from 'next/link'
import type {ReactNode} from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ChartNoAxesCombined,
  House,
  MoreHorizontal,
  ShieldCheck,
  UserRound,
  WalletCards,
  CarFront,
} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import {TrendLine} from '@/components/wealth-charts'
import type {MoneyItem, Profile, Snapshot} from '@/lib/types'
import {cn} from '@/lib/utils'
import {shortYuan, yuan} from '@/lib/format'

const assetIcons = [House, ChartNoAxesCombined, WalletCards, CarFront]
const avatarColors = ['from-blue-100 to-blue-300', 'from-pink-100 to-purple-200', 'from-sky-100 to-blue-300']

export function ProfileCard({
  profile,
  href,
  moneyItems = [],
  snapshots = [],
  index = 0
}: {
  profile: Profile
  href: string
  moneyItems?: MoneyItem[]
  snapshots?: Snapshot[]
  index?: number
}) {
  const netAsset = profile.totalAsset - profile.totalDebt
  const assets = moneyItems.filter((item) => item.category === 'asset').slice(0, 4)
  const risk = getRisk(profile.confidence)
  const fallbackSnapshots =
    snapshots.length > 1
      ? snapshots
      : [
          {...profile, id: `${profile.id}-s1`, totalAsset: profile.totalAsset * 0.82, totalDebt: profile.totalDebt * 0.96},
          {...profile, id: `${profile.id}-s2`, totalAsset: profile.totalAsset * 0.91, totalDebt: profile.totalDebt * 0.98},
          {...profile, id: `${profile.id}-s3`}
        ]

  return (
    <Link href={href} className="block">
      <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-panel">
        <div className="flex items-start gap-3">
          <div className={cn('flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br', avatarColors[index % avatarColors.length])}>
            <UserRound className="h-10 w-10 text-slate-700" strokeWidth={1.7} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-xl font-black tracking-normal text-slate-950">{profile.name}</h2>
                  <span className="shrink-0 text-sm font-medium text-slate-500">{profile.ageRange}</span>
                </div>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {[profile.job, profile.city].filter(Boolean).join(' · ')}
                </p>
                <p className="mt-2 truncate text-sm text-slate-500">家庭：{profile.children || profile.maritalStatus || '待补充'}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge className={cn('rounded-full border-0 px-3 py-1 font-bold', risk.className)}>{risk.label}</Badge>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600">
                  <MoreHorizontal className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 border-y border-slate-200 py-3">
          <Metric label="总资产（估值）" value={yuan(profile.totalAsset)} />
          <Metric label="总负债（估值）" value={yuan(profile.totalDebt)} />
          <Metric label="净资产" value={yuan(netAsset)} positive />
        </div>

        <div className="grid grid-cols-2 border-b border-slate-200 py-3 text-sm">
          <div className="font-medium text-slate-500">
            月收入 <span className="ml-2 font-black text-slate-950">{yuan(profile.monthlyIncome)}</span>
          </div>
          <div className="font-medium text-slate-500">
            月支出 <span className="ml-2 font-black text-slate-950">{yuan(profile.monthlyExpense)}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 border-b border-slate-200 py-4">
          {assets.slice(0, 3).map((item, assetIndex) => {
            const Icon = assetIcons[assetIndex] ?? WalletCards
            const tones = ['text-emerald-600 bg-emerald-50', 'text-blue-600 bg-blue-50', 'text-purple-600 bg-purple-50']
            return (
              <div key={item.id} className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', tones[assetIndex])}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-black">{item.name}</div>
                    <div className="truncate text-sm font-semibold text-slate-700">{yuan(item.amount)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-b border-slate-200 py-4">
          <div className="text-sm font-medium text-slate-500">近期判断变化</div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <Pill icon={<ArrowUp className="h-4 w-4" />} label="资产" value={index === 1 ? '+8%' : '+5%'} className="text-emerald-600" />
            <Pill icon={<ArrowDown className="h-4 w-4" />} label="负债" value={index === 2 ? '+4%' : '-3%'} className={index === 2 ? 'text-orange-600' : 'text-rose-600'} />
            <Pill icon={<ShieldCheck className="h-4 w-4" />} label={index === 0 ? '现金流' : '风险'} value={index === 0 ? '持平' : '偏低'} className="text-slate-700" />
          </div>
        </div>

        <div className="grid grid-cols-[130px_1fr_150px_20px] items-center gap-2 pt-3">
          <div className="text-sm font-medium text-slate-500">5年预测（净资产）</div>
          <TrendLine snapshots={fallbackSnapshots as Snapshot[]} />
          <div className="text-right text-sm font-medium text-slate-500">
            目标 <span className="ml-1 text-base font-black text-slate-950">{shortYuan(netAsset + 1200000)}</span>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400" />
        </div>
      </article>
    </Link>
  )
}

function Metric({label, value, positive}: {label: string; value: string; positive?: boolean}) {
  return (
    <div className="min-w-0 border-r border-slate-200 px-2 last:border-r-0 first:pl-0 last:pr-0">
      <div className="truncate text-xs font-semibold text-slate-500">{label}</div>
      <div className={cn('mt-1 truncate text-xl font-black', positive && 'text-emerald-600')}>{value}</div>
    </div>
  )
}

function Pill({icon, label, value, className}: {icon: ReactNode; label: string; value: string; className?: string}) {
  return (
    <div className="flex min-w-0 items-center justify-center gap-1 rounded-full bg-slate-50 px-2 py-1.5 text-sm font-bold">
      <span className={className}>{icon}</span>
      <span className="truncate text-slate-500">{label}</span>
      <span className={cn('shrink-0', className)}>{value}</span>
    </div>
  )
}

function getRisk(confidence: number) {
  if (confidence >= 82) {
    return {label: '中风险', className: 'bg-emerald-50 text-emerald-700'}
  }
  if (confidence >= 72) {
    return {label: '低风险', className: 'bg-blue-50 text-blue-700'}
  }
  return {label: '较高风险', className: 'bg-orange-50 text-orange-700'}
}
