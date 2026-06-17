import Link from 'next/link'
import {ArrowLeft, CheckCircle2, CircleEllipsis, Landmark, Sparkles} from 'lucide-react'
import {Button} from '@/components/ui/button'
import type {ParsedClue, Profile} from '@/lib/types'

export function ClueNewH5Page({prefix, profileId, profile, parsed, content}: {prefix: string; profileId: string; profile?: Profile; parsed: ParsedClue[]; content: string}) {
  return (
    <section className="w-full px-4 py-6 lg:hidden">
      <div className="w-full rounded-[34px] bg-white px-4 pb-5 pt-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
        <header className="grid grid-cols-[44px_1fr_90px] items-center"><Link href={`${prefix}/profiles/${profileId}`} className="flex h-11 w-11 items-center justify-center rounded-full text-slate-950"><ArrowLeft className="h-7 w-7" /></Link><div className="text-center text-xl font-bold">添加线索</div><button className="flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white" type="button"><CircleEllipsis className="h-6 w-6" /><span className="h-5 w-px bg-slate-200" /><Landmark className="h-5 w-5" /></button></header>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4"><textarea className="h-[158px] w-full resize-none bg-transparent text-xl font-medium leading-9 text-slate-950 outline-none placeholder:text-slate-400" defaultValue={content} maxLength={500} /><div className="text-right text-base font-medium text-slate-400">{content.length}/500</div></section>
        <Button size="lg" className="mt-6 h-14 w-full rounded-2xl text-xl font-bold shadow-[0_14px_28px_rgba(40,120,255,0.28)]"><Sparkles className="h-6 w-6" />AI解析</Button>
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold">解析结果</h2><div className="flex items-center gap-1 text-sm font-bold text-emerald-600"><CheckCircle2 className="h-5 w-5" />整体置信度：92%</div></div><div className="mt-4 space-y-3">{parsed.map((item) => <div key={item.item} className="rounded-xl border border-slate-200 p-3"><div className="flex items-center justify-between gap-3"><div className="truncate text-lg font-bold">{item.item}</div><div className="text-right text-xl font-bold">{item.amount ?? item.amountText}<span className="ml-1 text-sm font-medium text-slate-500">元</span></div></div><div className="mt-2 truncate text-sm text-slate-500">{item.explanation}</div></div>)}</div></section>
        <Button size="lg" className="mt-6 h-14 w-full rounded-2xl text-xl font-bold shadow-[0_14px_28px_rgba(40,120,255,0.28)]">保存到线索列表</Button><div className="mt-3 text-center text-sm text-slate-400">{profile?.name ?? '档案'} · 保存后将用于下一次判断</div>
      </div>
    </section>
  )
}
