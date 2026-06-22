import type {Metadata, Viewport} from 'next'
import type {ReactNode} from 'react'
import '../globals.css'
import {AppHeader} from '@/components/scenario-finance/AppHeader'

export const metadata: Metadata = {title: '财富侦探', description: 'AI 决策与推演'}
export const viewport: Viewport = {width: 'device-width', initialScale: 1, maximumScale: 1}

export default function ScenarioRootLayout({children}: {children: ReactNode}) {
  return <html lang="zh-CN"><body><AppHeader />{children}</body></html>
}
