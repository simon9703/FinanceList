import Link from 'next/link'
import type {ReactNode} from 'react'
import {ArrowLeft, Plus, Scale, WalletCards} from 'lucide-react'
import {getTranslations} from 'next-intl/server'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {getProfileDetail} from '@/lib/repository'

function money(value: number, unit: string) {
  return `${value.toLocaleString('zh-CN', {maximumFractionDigits: 2})}${unit}`
}

export default async function ProfileDetailPage({params}: {params: {locale: string; id: string}}) {
  const t = await getTranslations('Common')
  const p = await getTranslations('Profile')
  const detail = await getProfileDetail(params.id)
  const prefix = params.locale === 'en' ? '/en' : ''

  if (!detail) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
        <Link href={`${prefix}/profiles`} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Link>
        <p className="mt-10 text-center text-muted-foreground">{t('notFound')}</p>
      </main>
    )
  }

  const {profile, moneyItems, clues, snapshots} = detail
  const assets = moneyItems.filter((item) => item.category === 'asset')
  const income = moneyItems.filter((item) => item.category === 'income')
  const expenses = moneyItems.filter((item) => item.category === 'expense')

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 pb-24 pt-5 sm:max-w-2xl">
      <header className="flex items-center justify-between gap-3">
        <Link href={`${prefix}/profiles`} className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-sm font-semibold">{t('details')}</div>
        <div className="h-10 w-10" />
      </header>

      <section className="mt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-black">{profile.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {[profile.city, profile.ageRange, profile.job].filter(Boolean).join(' · ')}
            </p>
          </div>
          <Badge className="bg-white">{profile.confidence}%</Badge>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-2">
        <Summary icon={<WalletCards className="h-4 w-4" />} label={p('assets')} value={money(profile.totalAsset, p('unit'))} />
        <Summary icon={<Scale className="h-4 w-4" />} label={p('debt')} value={money(profile.totalDebt, p('unit'))} />
        <Summary label={p('income')} value={money(profile.monthlyIncome, p('unit'))} />
        <Summary label={p('expense')} value={money(profile.monthlyExpense, p('unit'))} />
      </section>

      <Panel title={p('assetStructure')}>
        {assets.length ? (
          assets.map((item) => <BarRow key={item.id} label={item.name} value={money(item.amount, p('unit'))} ratio={item.ratio ?? 0} />)
        ) : (
          <Empty text={p('emptyHint')} />
        )}
      </Panel>

      <section className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Panel title={p('incomeAbility')}>
          {income.length ? income.map((item) => <LineRow key={item.id} label={item.name} value={money(item.amount, p('unit'))} />) : <Empty text={p('emptyHint')} />}
        </Panel>
        <Panel title={p('expensePressure')}>
          {expenses.length ? expenses.map((item) => <LineRow key={item.id} label={item.name} value={money(item.amount, p('unit'))} />) : <Empty text={p('emptyHint')} />}
        </Panel>
      </section>

      <Panel title={`${p('clues')} · ${clues.length}`}>
        {clues.length ? (
          clues.map((item) => (
            <div key={item.id} className="border-t py-3 first:border-t-0 first:pt-0">
              <div className="text-sm">{item.content}</div>
              <div className="mt-2 text-xs text-muted-foreground">{item.confidence}</div>
            </div>
          ))
        ) : (
          <Empty text={p('emptyHint')} />
        )}
      </Panel>

      <Panel title={`${p('snapshots')} · ${snapshots.length}`}>
        {snapshots.slice(0, 3).map((item) => (
          <LineRow key={item.id} label={item.createdAt.slice(0, 10)} value={money(item.totalAsset - item.totalDebt, p('unit'))} />
        ))}
      </Panel>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-background/95 p-4 backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-2 sm:max-w-2xl">
          <Button size="lg">
            <Plus className="h-5 w-5" />
            {p('addClue')}
          </Button>
          <Button size="lg" variant="secondary">
            {p('editProfile')}
          </Button>
        </div>
      </div>
    </main>
  )
}

function Summary({label, value, icon}: {label: string; value: string; icon?: ReactNode}) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-panel">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 truncate text-xl font-black">{value}</div>
    </div>
  )
}

function Panel({title, children}: {title: string; children: ReactNode}) {
  return (
    <Card className="mt-3 border-none bg-white">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function BarRow({label, value, ratio}: {label: string; value: string; ratio: number}) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary" style={{width: `${Math.min(ratio, 100)}%`}} />
      </div>
    </div>
  )
}

function LineRow({label, value}: {label: string; value: string}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t py-3 text-sm first:border-t-0 first:pt-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function Empty({text}: {text: string}) {
  return <div className="py-4 text-center text-sm text-muted-foreground">{text}</div>
}
