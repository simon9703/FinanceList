import {ChartNoAxesCombined, FolderArchive, Plus, SlidersHorizontal, WalletCards} from 'lucide-react'
import type {ReactNode} from 'react'
import {ProfileCard} from '@/components/profile-card'
import {getProfileDetail, listProfiles} from '@/lib/repository'
import {cn} from '@/lib/utils'
import {yuan} from '@/lib/format'

export default async function ProfilesPage({params}: {params: {locale: string}}) {
  const profiles = await listProfiles()
  const prefix = params.locale === 'en' ? '/en' : ''
  const details = await Promise.all(profiles.map((profile) => getProfileDetail(profile.id)))
  const totalAsset = profiles.reduce((sum, profile) => sum + profile.totalAsset, 0)
  const totalDebt = profiles.reduce((sum, profile) => sum + profile.totalDebt, 0)

  return (
    <main className="min-h-screen bg-[#f7faff] px-4 py-6">
      <div className="mx-auto w-full max-w-[430px]">
        <div className="rounded-[34px] bg-white px-4 pb-5 pt-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
          <header className="flex items-start justify-between">
            <div>
              <div className="text-[15px] font-black text-slate-950">9:41</div>
              <h1 className="mt-9 text-[28px] font-black tracking-normal text-slate-950">财富档案</h1>
              <p className="mt-2 text-base font-medium text-slate-500">洞察财富全貌，AI 助你决策更智慧</p>
            </div>
            <button className="mt-12 flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 shadow-sm" type="button" aria-label="新增档案">
              <Plus className="h-7 w-7" />
            </button>
          </header>

          <section className="mt-7 grid grid-cols-3 gap-2">
            <SummaryCard icon={<FolderArchive className="h-5 w-5" />} label="全部档案" value={profiles.length.toString()} sub="较上月" delta="+1" tone="blue" />
            <SummaryCard icon={<ChartNoAxesCombined className="h-5 w-5" />} label="总资产（估值）" value={yuan(totalAsset)} sub="较上月" delta="+3.2%" tone="purple" />
            <SummaryCard icon={<WalletCards className="h-5 w-5" />} label="总负债（估值）" value={yuan(totalDebt)} sub="较上月" delta="-1.1%" tone="orange" />
          </section>

          <section className="mt-6 flex items-center gap-2">
            <button className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-black text-primary" type="button">最近更新</button>
            <button className="rounded-full bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600" type="button">总资产最高</button>
            <button className="rounded-full bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600" type="button">负债最高</button>
            <button className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white" type="button" aria-label="筛选">
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </section>

          <section className="mt-4 space-y-4">
            {profiles.map((profile, index) => {
              const detail = details[index]
              return (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  href={`${prefix}/profiles/${profile.id}`}
                  moneyItems={detail?.moneyItems}
                  snapshots={detail?.snapshots}
                  index={index}
                />
              )
            })}
          </section>
        </div>
      </div>
    </main>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
  delta,
  tone
}: {
  icon: ReactNode
  label: string
  value: string
  sub: string
  delta: string
  tone: 'blue' | 'purple' | 'orange'
}) {
  const toneClass = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-violet-50 text-violet-600',
    orange: 'bg-orange-50 text-orange-600'
  }[tone]

  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2">
        <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', toneClass)}>{icon}</span>
        <span className="min-w-0 truncate text-sm font-semibold text-slate-500">{label}</span>
      </div>
      <div className="mt-4 truncate text-xl font-black text-slate-950">{value}</div>
      <div className="mt-2 truncate text-sm font-medium text-slate-500">
        {sub} <span className={cn('font-black', delta.startsWith('-') ? 'text-emerald-600' : 'text-emerald-600')}>{delta}</span>
      </div>
    </div>
  )
}
