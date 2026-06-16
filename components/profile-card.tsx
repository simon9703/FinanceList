import Link from 'next/link'
import {ArrowRight, BriefcaseBusiness, MapPin, ShieldCheck} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import {Card, CardContent} from '@/components/ui/card'
import type {Profile} from '@/lib/types'

function money(value: number, unit: string) {
  return `${value.toLocaleString('zh-CN', {maximumFractionDigits: 2})}${unit}`
}

export function ProfileCard({profile, href, unit}: {profile: Profile; href: string; unit: string}) {
  return (
    <Link href={href} className="block">
      <Card className="overflow-hidden border-none bg-white">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-xl font-bold">{profile.name}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {profile.city ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.city}
                  </span>
                ) : null}
                {profile.job ? (
                  <span className="inline-flex items-center gap-1">
                    <BriefcaseBusiness className="h-3.5 w-3.5" />
                    {profile.job}
                  </span>
                ) : null}
              </div>
            </div>
            <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Metric label="Assets" value={money(profile.totalAsset, unit)} />
            <Metric label="Debt" value={money(profile.totalDebt, unit)} />
            <Metric label="Income" value={money(profile.monthlyIncome, unit)} />
            <Metric label="Expense" value={money(profile.monthlyExpense, unit)} />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <Badge className="bg-secondary">
              <ShieldCheck className="mr-1 h-3.5 w-3.5 text-accent" />
              {profile.confidence}%
            </Badge>
            <span className="truncate text-xs text-muted-foreground">{profile.children || profile.maritalStatus || ''}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function Metric({label, value}: {label: string; value: string}) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <div className="text-[11px] uppercase tracking-normal text-muted-foreground">{label}</div>
      <div className="mt-1 truncate text-base font-bold">{value}</div>
    </div>
  )
}
