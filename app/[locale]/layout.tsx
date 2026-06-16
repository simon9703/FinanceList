import type {Metadata, Viewport} from 'next'
import type {ReactNode} from 'react'
import {NextIntlClientProvider} from 'next-intl'
import {getMessages} from 'next-intl/server'
import '../globals.css'

export const metadata: Metadata = {
  title: 'FinanceList',
  description: 'Mobile-first wealth profile management'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode
  params: {locale: string}
}) {
  const messages = await getMessages()

  return (
    <html lang={params.locale}>
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
