import Link from 'next/link'
import {ShieldCheck} from 'lucide-react'

const nav = [
  ['/', '首页'], ['/buy-rent', '买房租房'], ['/investment', '投资协助'], ['/living-cost', '城市成本'], ['/retirement', '退休计划'], ['/personal-asset', '个人资产']
]

export function AppHeader() {
  return <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6"><Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg"><ShieldCheck size={24}/></span><span><strong className="block text-2xl text-slate-950">财富侦探</strong><small className="text-slate-500">AI 决策与推演</small></span></Link><nav className="hidden items-center gap-9 font-semibold text-slate-900 lg:flex">{nav.map(([href,label])=><Link className="transition hover:text-blue-600" href={href} key={href}>{label}</Link>)}</nav></div></header>
}
