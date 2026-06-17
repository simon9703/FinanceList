import Link from 'next/link'
import {ArrowLeft, CircleEllipsis, Landmark, Save} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {yuan} from '@/lib/format'
import type {MoneyItem, Profile} from '@/lib/types'

export function ProfileEditH5Page({prefix, profileId, profile, moneyItems}: {prefix: string; profileId: string; profile?: Profile; moneyItems: MoneyItem[]}) {
  return (
    <section className="w-full px-4 py-6 lg:hidden">
      <div className="w-full rounded-[34px] bg-white px-4 pb-5 pt-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
        <header className="grid grid-cols-[44px_1fr_90px] items-center"><Link href={`${prefix}/profiles/${profileId}`} className="flex h-11 w-11 items-center justify-center rounded-full text-slate-950"><ArrowLeft className="h-7 w-7" /></Link><div className="text-center text-xl font-bold">编辑当前判断</div><button className="flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white" type="button"><CircleEllipsis className="h-6 w-6" /><span className="h-5 w-px bg-slate-200" /><Landmark className="h-5 w-5" /></button></header>
        <section className="mt-7 grid grid-cols-2 rounded-full bg-slate-100 p-1"><button className="h-12 rounded-full bg-white text-lg font-bold text-primary shadow-sm" type="button">简单模式</button><button className="h-12 rounded-full text-lg font-bold text-slate-500" type="button">专业模式</button></section>
        {(['asset','debt','income','expense'] as const).map((category) => <section key={category} className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel"><h2 className="mb-4 text-2xl font-bold">{labelMap[category]}<span className="ml-2 text-base font-semibold text-slate-400">{yuan(totalFor(category, profile))}</span></h2><div className="space-y-4">{moneyItems.filter((item) => item.category === category).map((item) => <div key={item.id} className="flex items-center justify-between gap-4"><div className="truncate font-bold">{item.name}</div><div className="shrink-0 text-slate-500">{yuan(item.amount)}</div></div>)}</div></section>)}
        <Button size="lg" className="mt-7 h-14 w-full rounded-2xl text-xl font-bold shadow-[0_14px_28px_rgba(40,120,255,0.28)]"><Save />保存并更新判断</Button>
      </div>
    </section>
  )
}

const labelMap = {asset: '资产', debt: '负债', income: '收入', expense: '支出压力'}
function totalFor(category: MoneyItem['category'], profile?: Profile) {
  if (!profile) return 0
  if (category === 'asset') return profile.totalAsset
  if (category === 'debt') return profile.totalDebt
  if (category === 'income') return profile.monthlyIncome
  return profile.monthlyExpense
}
