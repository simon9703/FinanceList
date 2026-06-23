'use client'

import Link from 'next/link'
import {useState} from 'react'
import {ArrowRight, FileText, RefreshCw, ShieldCheck, SlidersHorizontal, Sparkles} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import {panelClass} from './Ui'

type SummaryItem = {
  title: string
  text: string
}

type Audience = {
  title: string
  subtitle?: string
  icon?: React.ReactNode
}

type PageBottomProps = {
  updatedAt?: string
  badge?: string
  summaries: SummaryItem[]
  audience?: Audience
  onGenerate?: () => void | Promise<void>
  generateLabel?: string
  generatingLabel?: string
  loading?: boolean
  className?: string
}

export function PageBottom({
  updatedAt = '2024-05-15',
  badge = '本周推荐',
  summaries,
  audience = {title: '稳健增值型', subtitle: '风险等级：中等'},
  onGenerate,
  generateLabel = '一键生成个性化方案',
  generatingLabel = '生成中...',
  loading = false,
  className,
}: PageBottomProps) {
  const [generatedAt, setGeneratedAt] = useState(updatedAt)

  function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  async function handleGenerate() {
    await onGenerate?.()
    setGeneratedAt(new Date().toISOString().slice(0, 10))
  }

  return (
    <section className={cn('mt-6 space-y-6', className)}>
      <div className={cn(panelClass, 'border-indigo-100 p-5')}>
        <div className="grid items-center gap-5 lg:grid-cols-[84px_1fr_220px]">
          <div className="grid h-20 w-20 place-items-center rounded-[8px] bg-indigo-50 text-indigo-500">
            <Sparkles size={38} />
          </div>
          <div>
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-xl font-bold">AI 总结</h2>
              <Badge className="rounded-full border-0 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">{badge}</Badge>
            </div>
            <div className="grid gap-4 text-sm lg:grid-cols-4">
              {summaries.map((item) => (
                <div className="border-slate-200 lg:border-r lg:pr-4 lg:last:border-r-0" key={item.title}>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="mt-1 leading-6 text-slate-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[8px] bg-orange-50 px-4 py-5 text-center">
            {audience.icon ?? <ShieldCheck className="mx-auto text-orange-500" size={24} />}
            <p className="mt-2 text-sm font-bold text-orange-600">适合人群</p>
            <p className="mt-2 text-lg font-bold text-indigo-600">{audience.title}</p>
            {audience.subtitle && <p className="mt-1 text-xs text-slate-500">{audience.subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr_1fr_0.9fr]">
        <div className="flex items-center gap-3 rounded-[8px] border bg-white px-5 py-4 text-slate-500 shadow-sm">
          <RefreshCw size={20} />
          数据更新：{generatedAt}
        </div>
        <Button type="button" variant="outline" className="flex h-auto items-center justify-center gap-3 rounded-[8px] bg-white px-5 py-4 font-bold text-slate-700 shadow-sm" onClick={scrollToTop}>
          <SlidersHorizontal className="text-indigo-500" size={22} />
          参数调整
        </Button>
        <Button
          type="button"
          className="flex h-auto items-center justify-center gap-3 rounded-[8px] bg-indigo-600 px-5 py-4 font-bold text-white shadow-[0_14px_30px_rgba(79,70,229,0.28)]"
          disabled={loading}
          onClick={() => void handleGenerate()}
        >
          <Sparkles size={22} />
          {loading ? generatingLabel : generateLabel}
        </Button>
        <Button asChild variant="outline" className="flex h-auto items-center justify-center gap-3 rounded-[8px] bg-white px-5 py-4 font-bold text-slate-700 shadow-sm">
          <Link href="/">
            <FileText className="text-indigo-500" size={22} />
            查看案例
            <ArrowRight size={18} />
          </Link>
        </Button>
      </div>
    </section>
  )
}
