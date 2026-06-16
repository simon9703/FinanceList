import Link from 'next/link'
import {
  ArrowDownToLine,
  ArrowLeft,
  Banknote,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CheckCircle2,
  CircleEllipsis,
  CreditCard,
  Gift,
  House,
  Landmark,
  ShoppingCart,
  Sparkles,
  WalletCards,
} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {getProfileDetail} from '@/lib/repository'
import {cn} from '@/lib/utils'
import {yuan} from '@/lib/format'

const tabs = [
  {label: '全部', icon: null},
  {label: '收入', icon: WalletCards},
  {label: '资产', icon: ChartNoAxesCombined},
  {label: '负债', icon: CreditCard},
  {label: '生活', icon: BriefcaseBusiness}
]

const quickTags = [
  {label: '工资收入', icon: WalletCards, color: 'text-blue-600'},
  {label: '奖金/年终奖', icon: Gift, color: 'text-red-500'},
  {label: '房产相关', icon: House, color: 'text-orange-500'},
  {label: '投资计划', icon: ChartNoAxesCombined, color: 'text-violet-600'},
  {label: '房贷还款', icon: Banknote, color: 'text-emerald-600'},
  {label: '信用卡还款', icon: CreditCard, color: 'text-violet-600'},
  {label: '日常消费', icon: ShoppingCart, color: 'text-emerald-600'},
  {label: '更多', icon: CircleEllipsis, color: 'text-slate-600'}
]

export default async function NewCluePage({params}: {params: {locale: string; id: string}}) {
  const detail = await getProfileDetail(params.id)
  const prefix = params.locale === 'en' ? '/en' : ''
  const profile = detail?.profile
  const clue = detail?.clues[0]
  const parsed = clue?.parsedResult?.length ? clue.parsedResult : fallbackParsed
  const content = clue?.content ?? '刚收到年终奖8万元，打算拿出4万元投资指数基金，另外信用卡还了7000元。'

  return (
    <main className="min-h-screen bg-[#f7faff] px-4 py-6">
      <div className="mx-auto w-full max-w-[430px] rounded-[34px] bg-white px-4 pb-5 pt-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
        <TopBar backHref={`${prefix}/profiles/${params.id}`} title="添加线索" />

        <section className="mt-7 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.label}
                className={cn(
                  'flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-base font-black',
                  index === 0 ? 'bg-primary text-white shadow-[0_10px_20px_rgba(40,120,255,0.22)]' : 'bg-slate-50 text-slate-600'
                )}
                type="button"
              >
                {Icon ? <Icon className={cn('h-5 w-5', index === 0 ? 'text-white' : 'text-primary')} /> : null}
                {tab.label}
              </button>
            )
          })}
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
          <textarea
            className="h-[158px] w-full resize-none bg-transparent text-xl font-medium leading-9 text-slate-950 outline-none placeholder:text-slate-400"
            defaultValue={content}
            maxLength={500}
          />
          <div className="text-right text-base font-medium text-slate-400">{content.length}/500</div>
        </section>

        <section className="mt-5">
          <h2 className="text-base font-bold text-slate-700">快捷标签</h2>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {quickTags.map((tag) => {
              const Icon = tag.icon
              return (
                <button key={tag.label} className="flex min-w-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-3 text-sm font-bold text-slate-700" type="button">
                  <Icon className={cn('h-5 w-5 shrink-0', tag.color)} />
                  <span className="truncate">{tag.label}</span>
                </button>
              )
            })}
          </div>
        </section>

        <Button size="lg" className="mt-6 h-14 w-full rounded-2xl text-xl font-black shadow-[0_14px_28px_rgba(40,120,255,0.28)]">
          <Sparkles className="h-6 w-6" />
          AI解析
        </Button>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black">解析结果</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-500">已识别 {parsed.length} 条线索</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-black text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
              整体置信度：92%
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {parsed.map((item) => {
              const meta = getParsedMeta(item.type)
              const Icon = meta.icon
              return (
                <div key={item.item} className="grid grid-cols-[64px_1fr_auto_52px] items-center gap-3 rounded-xl border border-slate-200 p-3">
                  <span className={cn('flex h-14 w-14 items-center justify-center rounded-full', meta.iconBg)}>
                    <Icon className={cn('h-7 w-7', meta.iconText)} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-lg font-black">{item.item}</div>
                      <span className={cn('shrink-0 rounded-md px-2 py-1 text-xs font-black', meta.badgeClass)}>{meta.label}</span>
                    </div>
                    <div className="mt-2 truncate text-sm text-slate-500">{item.explanation}</div>
                  </div>
                  <div className="text-right text-xl font-black">
                    {item.amount ? yuan(item.amount) : item.amountText}
                    <span className="ml-1 text-sm font-medium text-slate-500">元</span>
                  </div>
                  <span className={cn('rounded-lg px-2 py-1 text-center text-sm font-black', meta.confidenceClass)}>{item.confidence === 'high' ? '95%' : '90%'}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-4 text-center text-sm font-medium text-slate-400">解析结果由 AI 生成，请确认后保存</div>
        </section>

        <Button size="lg" className="mt-6 h-14 w-full rounded-2xl text-xl font-black shadow-[0_14px_28px_rgba(40,120,255,0.28)]">
          保存到线索列表
        </Button>
        <div className="mt-3 text-center text-sm text-slate-400">{profile?.name ?? '档案'} · 保存后将用于下一次判断</div>
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

function getParsedMeta(type: string) {
  if (type === 'asset') {
    return {
      icon: ChartNoAxesCombined,
      label: '资产',
      iconBg: 'bg-blue-50',
      iconText: 'text-blue-600',
      badgeClass: 'bg-blue-50 text-blue-600',
      confidenceClass: 'bg-blue-50 text-blue-600'
    }
  }
  if (type === 'debt') {
    return {
      icon: CreditCard,
      label: '负债',
      iconBg: 'bg-rose-50',
      iconText: 'text-rose-500',
      badgeClass: 'bg-rose-50 text-rose-600',
      confidenceClass: 'bg-rose-50 text-rose-600'
    }
  }
  return {
    icon: ArrowDownToLine,
    label: '收入',
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-600',
    badgeClass: 'bg-emerald-50 text-emerald-600',
    confidenceClass: 'bg-emerald-50 text-emerald-600'
  }
}

const fallbackParsed = [
  {type: 'income', item: '年终奖收入', amount: 80000, amountText: '80,000元', confidence: 'high' as const, explanation: '识别依据：年终奖8万元', impacts: []},
  {type: 'asset', item: '投资指数基金', amount: 40000, amountText: '40,000元', confidence: 'medium' as const, explanation: '识别依据：拿出4万元投资指数基金', impacts: []},
  {type: 'debt', item: '信用卡还款', amount: 7000, amountText: '7,000元', confidence: 'medium' as const, explanation: '识别依据：信用卡还了7000元', impacts: []}
]
