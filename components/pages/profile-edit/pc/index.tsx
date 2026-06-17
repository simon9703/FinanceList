import Link from 'next/link'
import {Bell, BriefcaseBusiness, ChartNoAxesCombined, CreditCard, Gift, Plus, Save, WalletCards, X} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {yuan} from '@/lib/format'
import type {MoneyItem, Profile} from '@/lib/types'

export function ProfileEditPcPage({prefix, profileId, profile, moneyItems}: {prefix: string; profileId: string; profile?: Profile; moneyItems: MoneyItem[]}) {
  const groups = [
    {title: '资产', total: profile?.totalAsset ?? 0, items: moneyItems.filter((i) => i.category === 'asset'), icon: ChartNoAxesCombined},
    {title: '负债', total: profile?.totalDebt ?? 0, items: moneyItems.filter((i) => i.category === 'debt'), icon: CreditCard},
    {title: '收入', total: profile?.monthlyIncome ?? 0, items: moneyItems.filter((i) => i.category === 'income'), icon: WalletCards},
    {title: '支出', total: profile?.monthlyExpense ?? 0, items: moneyItems.filter((i) => i.category === 'expense'), icon: Gift}
  ]
  return (
    <section className="hidden min-h-screen w-full bg-[radial-gradient(circle_at_76%_0%,rgba(139,92,246,0.16),transparent_26%),linear-gradient(180deg,#ffffff,#f7faff)] lg:block">
      <header className="flex h-20 items-center justify-between border-b bg-white/80 px-14"><Link href={`${prefix}/profiles/${profileId}`} className="text-2xl font-black">AI 财富观察档案</Link><nav className="flex gap-16 text-lg font-bold"><span>首页</span><span>财富洞察</span><span>规划建议</span><span>市场动态</span><span>我的档案</span></nav><div className="flex items-center gap-8"><button className="rounded-xl border border-violet-400 px-6 py-3 font-bold text-violet-600">升级专业版</button><Bell /><span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 font-black text-primary">张</span></div></header>
      <div className="w-full px-14 py-10"><div className="text-center"><h1 className="text-5xl font-black">编辑当前判断</h1><p className="mt-4 text-xl text-slate-500">完善您的财务信息，AI 将基于您的最新情况，生成更精准的洞察与建议。</p><div className="mx-auto mt-8 grid w-full grid-cols-2 rounded-2xl border bg-white p-1"><button className="rounded-xl py-4 font-black">简单模式</button><button className="rounded-xl bg-violet-50 py-4 font-black text-violet-600">专业模式</button></div></div>
      <div className="mt-10 grid w-full grid-cols-4 gap-6">{groups.map(({title,total,items,icon: Icon}) => <section key={title} className="rounded-2xl border bg-white p-6 shadow-panel"><div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary"><Icon /></span><h2 className="text-2xl font-black">{title}</h2></div><span className="font-bold text-slate-600">总计 {yuan(total)}</span></div><div className="space-y-5">{items.slice(0,5).map((item) => <div key={item.id} className="grid grid-cols-[1fr_100px_70px_20px] items-center gap-3"><div><div className="font-bold">{item.name}</div><div className="text-sm text-slate-400">估算金额</div></div><input className="w-full rounded-lg border px-3 py-2" defaultValue={(item.amount / 10000).toFixed(0)} /><span className="text-right text-slate-500">{item.ratio?.toFixed(1) ?? '—'}%</span><X className="h-4 w-4 text-slate-300" /></div>)}</div><button className="mt-6 w-full rounded-xl border border-dashed py-3 font-bold text-primary"><Plus className="inline h-4 w-4" /> 添加{title}项</button></section>)}</div>
      <div className="mt-6 rounded-2xl border bg-white/80 p-5 text-lg text-slate-500"><BriefcaseBusiness className="mr-2 inline text-primary" />智能提示：基于您的输入，我们将从资产配置、风险水平、现金流健康度等维度进行综合分析。</div><Button className="mx-auto mt-8 flex h-16 w-full rounded-2xl text-2xl font-black"><Save /> 保存并更新判断</Button></div>
    </section>
  )
}
