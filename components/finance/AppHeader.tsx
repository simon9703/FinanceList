'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {ShieldCheck} from 'lucide-react'
import {cn} from '@/lib/utils'

const nav = [
  ['/', '首页'],
  ['/investment', '投资协助'],
  ['/living-cost', '城市成本'],
  ['/retirement', '退休计划'],
  ['/buy-rent', '案例库'],
  ['/personal-asset', '知识库'],
]

export function AppHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] w-[94vw] items-center justify-between gap-6 md:w-[95vw]">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-[0_12px_24px_rgba(79,70,229,0.25)]">
            <ShieldCheck size={24} />
          </span>
          <span className="leading-tight">
            <strong className="block text-[22px] font-black text-slate-950">财富侦探</strong>
            <small className="text-[13px] font-medium text-slate-500">看清选择，掌控未来</small>
          </span>
        </Link>
        <nav className="flex min-w-0 flex-1 items-center justify-end gap-2 overflow-x-auto text-[15px] font-bold text-slate-900 md:gap-7 lg:gap-12">
          {nav.map(([href, label]) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                className={cn(
                  'relative shrink-0 px-1 py-6 transition hover:text-indigo-600',
                  active && 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-indigo-600',
                )}
                href={href}
                key={href}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
