import {BarChart3, Bot, Grid2X2, ListFilter, Plus, Search} from 'lucide-react'
import {ProfileCard} from '@/components/profile-card'
import type {MoneyItem, Profile, Snapshot} from '@/lib/types'

type ProfileDetailLite = {moneyItems?: MoneyItem[]; snapshots?: Snapshot[]} | null

export function ProfilesPcPage({profiles, details, prefix}: {profiles: Profile[]; details: ProfileDetailLite[]; prefix: string}) {
  return (
    <section className="hidden min-h-screen w-full bg-[radial-gradient(circle_at_70%_12%,rgba(139,92,246,0.18),transparent_28%),linear-gradient(180deg,#fbfdff_0%,#f7faff_100%)] lg:block">
      <header className="flex h-20 w-full items-center justify-between border-b border-slate-100 bg-white/70 px-16 backdrop-blur">
        <div className="flex items-center gap-3 text-2xl font-bold"><span className="text-4xl font-black text-primary">AI</span> AI 财富观察档案</div>
        <nav className="flex items-center gap-12 text-base font-semibold text-slate-700"><span>产品介绍</span><span>功能亮点</span><span>定价方案</span><span>关于我们</span><button className="rounded-full border border-slate-300 px-6 py-2 font-bold">登录 / 注册</button></nav>
      </header>
      <div className="w-full px-16 pb-10">
        <section className="grid min-h-[300px] grid-cols-[1fr_1.1fr] items-center gap-8 py-10">
          <div className="pl-20"><h1 className="text-6xl font-black tracking-tight text-slate-950">AI 财富观察档案</h1><p className="mt-6 text-2xl font-medium text-slate-600">用 AI 洞察财富全貌，预测未来趋势，让每个决策更有依据。</p><button className="mt-8 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-10 py-4 text-xl font-bold text-white shadow-xl"><Plus /> 新建档案</button></div>
          <div className="relative h-72 overflow-hidden rounded-[42px] bg-gradient-to-br from-blue-50 via-white to-violet-100"><div className="absolute left-28 top-12 rounded-xl bg-white p-5 shadow-xl"><div className="text-sm text-slate-500">资产增值潜力</div><b className="mt-2 block text-2xl text-primary">高 72%</b></div><div className="absolute bottom-8 right-24 h-56 w-80 rounded-[32px] bg-white/60 p-8 shadow-2xl backdrop-blur"><BarChart3 className="h-full w-full text-violet-500" /></div></div>
        </section>
        <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-7 shadow-[0_24px_80px_rgba(30,41,59,0.08)]">
          <div className="mb-6 flex items-center gap-4"><div className="flex h-12 flex-1 items-center gap-3 rounded-full border border-slate-200 px-5 text-slate-400"><Search className="h-5 w-5" />搜索姓名 / 城市 / 职业</div><button className="rounded-full bg-blue-50 px-5 py-3 font-bold text-primary">最近更新</button><button className="rounded-full border px-5 py-3 font-bold">总资产最高</button><button className="rounded-full border px-5 py-3 font-bold">负债最高</button><div className="ml-auto flex gap-2"><Grid2X2 className="text-primary"/><ListFilter className="text-slate-500"/></div></div>
          <div className="grid w-full grid-cols-3 gap-6">
            {profiles.map((profile, index) => { const detail = details[index]; return <ProfileCard key={profile.id} profile={profile} href={`${prefix}/profiles/${profile.id}`} moneyItems={detail?.moneyItems} snapshots={detail?.snapshots} index={index} /> })}
          </div>
        </section>
      </div><button className="fixed bottom-8 right-8 rounded-full bg-violet-600 p-5 text-white shadow-2xl"><Bot /></button>
    </section>
  )
}
