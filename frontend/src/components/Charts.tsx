import React from 'react'
import { Text, View } from '@tarojs/components'
import type { MoneyItem } from '@/types/profile'

const palette = ['#20c997', '#2f80ed', '#f5a623', '#32c5d2', '#8b5cf6']

const money = (value: number) => `¥${(value * 10000).toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`

export function DonutChart({ items, total }: { items: MoneyItem[]; total: number }) {
  let cursor = 0
  const stops = items.map((item, index) => {
    const start = cursor
    const end = cursor + (item.ratio || 0)
    cursor = end
    return `${palette[index % palette.length]} ${start}% ${end}%`
  }).join(', ')

  return <View className='flex items-center gap-[28px] py-[24px]'>
    <View className='relative flex h-[190px] w-[190px] items-center justify-center rounded-full' style={{ background: `conic-gradient(${stops})` }}>
      <View className='flex h-[112px] w-[112px] flex-col items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(17,24,39,.04)]'>
        <Text className='text-[20px] text-[#7a8496]'>总资产</Text>
        <Text className='text-[24px] font-black text-[#172033]'>{money(total)}</Text>
      </View>
    </View>
    <View className='flex flex-1 flex-col gap-[16px]'>
      {items.map((item, index) => <View key={item.key} className='flex items-center gap-[12px] text-[24px] text-[#526071]'>
        <View className='h-[10px] w-[10px] rounded-full' style={{ backgroundColor: palette[index % palette.length] }} />
        <Text className='flex-1'>{item.name}</Text>
        <Text className='font-extrabold text-[#172033]'>{item.ratio || 0}%</Text>
      </View>)}
    </View>
  </View>
}

export function TrendChart({ values, color = '#2f80ed' }: { values: number[]; color?: string }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const points = values.map((value, index) => ({
    x: (index / Math.max(values.length - 1, 1)) * 100,
    y: 100 - ((value - min) / range) * 70 - 15,
  }))

  return <View className='relative h-[74px] w-full overflow-hidden rounded-[18px] bg-gradient-to-b from-white to-[#f8fbff]'>
    {points.slice(0, -1).map((point, index) => {
      const next = points[index + 1]
      const dx = next.x - point.x
      const dy = next.y - point.y
      const length = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx) * 180 / Math.PI
      return <View key={`${point.x}-${point.y}`} className='absolute h-[4px] origin-left rounded-full' style={{ left: `${point.x}%`, top: `${point.y}%`, width: `${length}%`, transform: `rotate(${angle}deg)`, backgroundColor: color }} />
    })}
  </View>
}
