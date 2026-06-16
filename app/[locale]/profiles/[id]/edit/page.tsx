import Link from 'next/link'
import type {ReactNode} from 'react'
import {
  ArrowLeft,
  Banknote,
  ChartPie,
  ChevronRight,
  CircleEllipsis,
  CreditCard,
  Landmark,
  Plus,
  WalletCards,
} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {getProfileDetail} from '@/lib/repository'
import {cn} from '@/lib/utils'
import {percent, yuan} from '@/lib/format'
import type {MoneyItem} from '@/lib/types'

export default async function EditProfilePage({params}: {params: {locale: string; id: string}}) {
  const detail = await getProfileDetail(params.id)
  const prefix = params.locale === 'en' ? '/en' : ''
  const profile = detail?.profile
  const moneyItems = detail?.moneyItems ?? []

  return (
    <main className="min-h-screen bg-[#f7faff] px-4 py-6">
      <div className="mx-auto w-full max-w-[430px] rounded-[34px] bg-white px-4 pb-5 pt-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
        <TopBar backHref={`${prefix}/profiles/${params.id}`} title="编辑当前判断" />

        <section className="mt-7 grid grid-cols-2 rounded-full bg-slate-100 p-1">
          <button className="h-12 rounded-full bg-white text-lg font-bold text-primary shadow-sm" type="button">简单模式</button>
          <button className="h-12 rounded-full text-lg font-bold text-slate-500" type="button">专业模式</button>
        </section>

        <Group
          title="资产"
          total={profile?.totalAsset ?? 0}
          items={moneyItems.filter((item) => item.category === 'asset')}
          color="#2878ff"
          icon={<ChartPie />}
          iconClass="bg-blue-50 text-blue-600"
          action="添加资产项"
        />
        <Group
          title="负债"
          total={profile?.totalDebt ?? 0}
          items={moneyItems.filter((item) => item.category === 'debt')}
          color="#ff4056"
          icon={<CreditCard />}
          iconClass="bg-rose-50 text-rose-500"
          action="添加负债项"
        />
        <Group
          title="收入"
          total={profile?.monthlyIncome ?? 0}
          items={moneyItems.filter((item) => item.category === 'income')}
          color="#10b981"
          icon={<WalletCards />}
          iconClass="bg-emerald-50 text-emerald-600"
          action="添加收入项"
          monthly
        />
        <Group
          title="支出压力"
          total={profile?.monthlyExpense ?? 0}
          items={moneyItems.filter((item) => item.category === 'expense')}
          color="#8b5cf6"
          icon={<Banknote />}
          iconClass="bg-violet-50 text-violet-600"
          action="添加支出项"
          monthly
          centerAction
        />

        <Button size="lg" className="mt-7 h-14 w-full rounded-2xl text-xl font-bold shadow-[0_14px_28px_rgba(40,120,255,0.28)]">
          保存并更新判断
        </Button>
        <div className="mt-4 text-center text-base font-medium text-slate-400">下次评估将基于更新后的数据</div>
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
      <div className="text-center text-xl font-bold">{title}</div>
      <button className="flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white" type="button">
        <CircleEllipsis className="h-6 w-6" />
        <span className="h-5 w-px bg-slate-200" />
        <Landmark className="h-5 w-5" />
      </button>
    </header>
  )
}

function Group({
  title,
  total,
  items,
  color,
  icon,
  iconClass,
  action,
  monthly,
  centerAction
}: {
  title: string
  total: number
  items: MoneyItem[]
  color: string
  icon: ReactNode
  iconClass: string
  action: string
  monthly?: boolean
  centerAction?: boolean
}) {
  return (
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full [&>svg]:h-6 [&>svg]:w-6', iconClass)}>{icon}</span>
          <h2 className="truncate text-2xl font-bold">
            {title}
            <span className="ml-2 text-base font-semibold text-slate-400">（{monthly ? '月均' : '总计'} {yuan(total)}）</span>
          </h2>
        </div>
        {!centerAction ? (
          <button className="shrink-0 text-base font-bold text-primary" type="button">
            + {action}
          </button>
        ) : null}
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const ratio = item.ratio ?? Math.min(100, (item.amount / Math.max(total, 1)) * 100)
          return (
            <div key={item.id} className="grid grid-cols-[96px_96px_1fr_44px_20px] items-center gap-3">
              <div className="truncate text-lg font-bold text-slate-950">{item.name}</div>
              <div className="truncate text-base font-medium text-slate-500">{yuan(item.amount)}</div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full" style={{width: percent(ratio), backgroundColor: color}} />
              </div>
              <div className="text-right text-base font-bold text-slate-500">{percent(ratio)}</div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
          )
        })}
      </div>

      {centerAction ? (
        <button className="mx-auto mt-5 flex items-center gap-1 text-base font-bold text-primary" type="button">
          <Plus className="h-5 w-5" />
          {action}
        </button>
      ) : (
        <div className="mt-4 text-sm font-medium text-slate-400">长按拖拽可调整占比顺序</div>
      )}
    </section>
  )
}
