'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type {MoneyItem, Snapshot} from '@/lib/types'
import {shortYuan, yuan} from '@/lib/format'

const colors = ['#2878ff', '#14b8a6', '#ff9f0a', '#7357ff', '#10b981']

export function AssetDonut({items, total}: {items: MoneyItem[]; total: number}) {
  const data = items.map((item, index) => ({
    name: item.name,
    value: item.amount,
    ratio: item.ratio ?? Math.round((item.amount / Math.max(total, 1)) * 100),
    color: colors[index % colors.length]
  }))

  return (
    <div className="grid grid-cols-[150px_1fr] items-center gap-2">
      <div className="relative h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={72} paddingAngle={1} stroke="none">
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => yuan(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-medium text-slate-500">总资产</span>
          <span className="mt-1 text-base font-bold text-slate-950">{shortYuan(total)}</span>
        </div>
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name} className="grid grid-cols-[10px_1fr_36px_78px] items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full" style={{backgroundColor: item.color}} />
            <span className="truncate font-semibold text-slate-700">{item.name}</span>
            <span className="text-right font-semibold text-slate-700">{item.ratio}%</span>
            <span className="text-right text-slate-700">{shortYuan(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TrendLine({snapshots, color = '#2878ff'}: {snapshots: Snapshot[]; color?: string}) {
  const data = makeSnapshotData(snapshots)

  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{top: 8, right: 4, bottom: 2, left: 4}}>
          <Tooltip formatter={(value) => yuan(Number(value))} labelFormatter={(label) => `日期 ${label}`} />
          <Line type="monotone" dataKey="netAsset" stroke={color} strokeWidth={2.2} dot={false} activeDot={{r: 3}} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function JudgmentLineChart({snapshots}: {snapshots: Snapshot[]}) {
  const data = makeSnapshotData(snapshots)

  return (
    <div className="h-[156px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{top: 12, right: 10, bottom: 0, left: 0}}>
          <CartesianGrid stroke="#e5edf7" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#71809a'}} />
          <YAxis yAxisId="money" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#71809a'}} tickFormatter={(value) => shortYuan(Number(value))} width={45} />
          <YAxis yAxisId="score" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#71809a'}} tickFormatter={(value) => `${value}%`} width={30} />
          <Tooltip formatter={(value) => (typeof value === 'number' && value > 100 ? yuan(value) : `${value}%`)} />
          <Line yAxisId="money" type="monotone" dataKey="netAsset" stroke="#2878ff" strokeWidth={3} dot={{r: 4, fill: '#2878ff'}} />
          <Line yAxisId="score" type="monotone" dataKey="confidence" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ForecastAreaChart({snapshots}: {snapshots: Snapshot[]}) {
  const data = makeSnapshotData(snapshots)
  const last = data[data.length - 1]?.netAsset ?? 0
  const forecast = [
    {date: '现在', value: last},
    {date: '1年后', value: Math.round(last * 1.18)},
    {date: '3年后', value: Math.round(last * 1.36)},
    {date: '5年后', value: Math.round(last + 1200000)}
  ]

  return (
    <div className="h-[116px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={forecast} margin={{top: 8, right: 8, bottom: 0, left: 0}}>
          <defs>
            <linearGradient id="forecast-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7357ff" stopOpacity={0.26} />
              <stop offset="100%" stopColor="#7357ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#71809a'}} />
          <Tooltip formatter={(value) => yuan(Number(value))} />
          <Area type="monotone" dataKey="value" stroke="#7357ff" strokeWidth={3} fill="url(#forecast-fill)" dot={{r: 4, fill: '#fff', stroke: '#7357ff', strokeWidth: 2}} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function makeSnapshotData(snapshots: Snapshot[]) {
  const base = snapshots.length
    ? snapshots
    : [
        {createdAt: '2026-01-01T00:00:00.000Z', totalAsset: 2200000, totalDebt: 1100000, confidence: 70},
        {createdAt: '2026-03-01T00:00:00.000Z', totalAsset: 2450000, totalDebt: 1240000, confidence: 76},
        {createdAt: '2026-06-01T00:00:00.000Z', totalAsset: 2850000, totalDebt: 1450000, confidence: 86}
      ]

  return base
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((item, index) => ({
      date: ['3月前', '2月前', '1月前', '本月初', '1周前', '本次评估'][index] ?? item.createdAt.slice(5, 10),
      netAsset: item.totalAsset - item.totalDebt,
      confidence: item.confidence
    }))
}
