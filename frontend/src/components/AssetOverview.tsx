import React from 'react'
import { Text, View } from '@tarojs/components'
import type { Person } from '@/types/profile'
import { glassCard, metricStrong, panelHead, textSecondary } from './ui'

const money = (value: number) => value.toLocaleString('zh-CN', { maximumFractionDigits: 2 })

export function AssetOverview({ person }: { person: Person }) {
  const netAsset = person.asset.total - person.asset.debt

  return <View className={`${glassCard} px-[30px] py-[34px]`}>
    <View className={panelHead}>
      <View>
        <View className='flex items-center justify-between gap-[20px] text-[24px] text-[#89919d]'>资产净值</View>
        <View className='mt-[22px] text-[58px] font-black tracking-[-2px]'>¥{money(netAsset * 10000)}</View>
        <View className='mt-[12px] text-[24px] text-[#8b929e]'>较上次评估 <Text className='text-[#18b779]'>+3.2%</Text></View>
      </View>
      <View className='flex flex-col items-end gap-[8px] text-[22px] text-[#7a8496]'><Text>综合可信度</Text><Text className='text-[38px] font-black text-[#172033]'>{person.confidence || 60}%</Text></View>
    </View>
    <View className='mt-[26px] grid grid-cols-3 gap-[14px]'>
      <View className='flex flex-col gap-[8px] rounded-[20px] bg-[#f8faff] p-[18px]'><Text className={textSecondary}>总资产</Text><Text className={metricStrong}>≈ {money(person.asset.total)}万</Text></View>
      <View className='flex flex-col gap-[8px] rounded-[20px] bg-[#f8faff] p-[18px]'><Text className={textSecondary}>总负债</Text><Text className={metricStrong}>≈ {money(person.asset.debt)}万</Text></View>
      <View className='flex flex-col gap-[8px] rounded-[20px] bg-[#f8faff] p-[18px]'><Text className={textSecondary}>月结余能力</Text><Text className={metricStrong}>≈ {money(person.asset.income - person.asset.expense)}万</Text></View>
    </View>
  </View>
}
