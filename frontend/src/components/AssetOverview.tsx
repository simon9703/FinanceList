import React from 'react'
import { Text, View } from '@tarojs/components'
import type { Person } from '@/types/profile'

const money = (value: number) => value.toLocaleString('zh-CN', { maximumFractionDigits: 2 })

export function AssetOverview({ person }: { person: Person }) {
  const netAsset = person.asset.total - person.asset.debt

  return <View className='hero-card glass-card'>
    <View className='profile-card-head'>
      <View>
        <View className='hero-topline'>资产净值</View>
        <View className='hero-amount'>¥{money(netAsset * 10000)}</View>
        <View className='hero-sub'>较上次评估 <Text className='success-text'>+3.2%</Text></View>
      </View>
      <View className='confidence-badge'><Text>综合可信度</Text><Text>{person.confidence || 60}%</Text></View>
    </View>
    <View className='wealth-judge'>
      <View><Text className='text-secondary'>总资产</Text><Text className='metric-strong'>≈ {money(person.asset.total)}万</Text></View>
      <View><Text className='text-secondary'>总负债</Text><Text className='metric-strong'>≈ {money(person.asset.debt)}万</Text></View>
      <View><Text className='text-secondary'>月结余能力</Text><Text className='metric-strong'>≈ {money(person.asset.income - person.asset.expense)}万</Text></View>
    </View>
  </View>
}
