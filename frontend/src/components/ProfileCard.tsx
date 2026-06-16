import React from 'react'
import { Text, View } from '@tarojs/components'
import type { Person } from '@/types/profile'
import { TrendChart } from './Charts'
import { glassCard, metricStrong, panelHead, textSecondary, title } from './ui'

const money = (value: number) => `${value.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}万`

export function ProfileCard({ person }: { person: Person }) {
  const mainAssets = person.assetItems?.slice(0, 3) || []
  const metricItem = 'flex flex-col gap-[8px] rounded-[20px] bg-[#f8faff] p-[18px]'

  return <View className={`${glassCard} overflow-hidden`}>
    <View className={panelHead}>
      <View>
        <View className={title}>{person.name}</View>
        <View className={textSecondary}>{person.city} · {person.ageRange} · {person.job}</View>
        <View className='mt-[10px] text-[24px] text-[#526071]'>👨‍👩‍👧 {person.family || '家庭情况待补充'}</View>
      </View>
      <Text className='text-[46px] text-[#8d98aa]'>›</Text>
    </View>

    <View className='my-[24px] grid grid-cols-2 gap-[18px]'>
      <View className={metricItem}><Text className={textSecondary}>总资产</Text><Text className={metricStrong}>≈ {money(person.asset.total)}</Text></View>
      <View className={metricItem}><Text className={textSecondary}>总负债</Text><Text className={metricStrong}>≈ {money(person.asset.debt)}</Text></View>
      <View className={metricItem}><Text className={textSecondary}>月收入</Text><Text className={metricStrong}>≈ {money(person.asset.income)}</Text></View>
      <View className={metricItem}><Text className={textSecondary}>月支出</Text><Text className={metricStrong}>≈ {money(person.asset.expense)}</Text></View>
    </View>

    <View className='mb-[20px] flex flex-wrap gap-[12px]'>{mainAssets.map((item) => <Text key={item.key} className='rounded-[16px] bg-[#f3f7ff] px-[14px] py-[12px] text-[22px] text-[#40506a]'>{item.icon} {item.name}{money(item.amount)}</Text>)}</View>

    <View className='rounded-[20px] bg-[#fbfcff] p-[18px]'>
      <View className='mb-[10px] text-[24px] font-extrabold text-[#172033]'>最近判断变化</View>
      {(person.recentChanges || []).slice(0, 3).map((item) => <View key={item.label} className='grid grid-cols-[1fr_auto_auto] items-center gap-[12px] py-[8px] text-[24px] text-[#5d6674]'><Text>{item.label}</Text><Text className='text-[#18b779]'>{item.after}</Text></View>)}
    </View>

    <View className='pt-[18px]'><View className='mb-[10px] flex items-center justify-between text-[24px] text-[#526071]'><Text>5年后预计净资产</Text><Text className='font-extrabold text-[#172033]'>≈ {money(person.future5 || person.asset.total)}</Text></View><TrendChart values={[person.asset.total * 0.82, person.asset.total * 0.9, person.asset.total * 0.96, person.asset.total, person.future5 || person.asset.total]} /></View>
  </View>
}
