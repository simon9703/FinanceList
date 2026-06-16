import React from 'react'
import { Text, View } from '@tarojs/components'
import type { Person } from '@/types/profile'

const money = (value: number) => `${value.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}万`

export function ProfileCard({ person }: { person: Person }) {
  const mainAssets = person.assetItems?.slice(0, 3) || []

  return <View className='profile-card glass-card'>
    <View className='profile-card-head'>
      <View>
        <View className='title'>{person.name}</View>
        <View className='text-secondary'>{person.city} · {person.ageRange} · {person.job}</View>
        <View className='family-line'>👨‍👩‍👧 {person.family || '家庭情况待补充'}</View>
      </View>
      <Text className='chevron'>›</Text>
    </View>

    <View className='metric-grid'>
      <View><Text className='text-secondary'>总资产</Text><Text className='metric-strong'>≈ {money(person.asset.total)}</Text></View>
      <View><Text className='text-secondary'>总负债</Text><Text className='metric-strong'>≈ {money(person.asset.debt)}</Text></View>
      <View><Text className='text-secondary'>月收入</Text><Text className='metric-strong'>≈ {money(person.asset.income)}</Text></View>
      <View><Text className='text-secondary'>月支出</Text><Text className='metric-strong'>≈ {money(person.asset.expense)}</Text></View>
    </View>

    <View className='asset-chip-row'>{mainAssets.map((item) => <Text key={item.key} className='asset-chip'>{item.icon} {item.name}{money(item.amount)}</Text>)}</View>

    <View className='change-box'>
      <View className='mini-title'>最近判断变化</View>
      {(person.recentChanges || []).slice(0, 3).map((item) => <View key={item.label} className='change-row'><Text>{item.label}</Text><Text className='success-text'>{item.after}</Text></View>)}
    </View>

    <View className='forecast-entry'><Text>5年后预计净资产 ≈ {money(person.future5 || person.asset.total)}</Text><Text>→</Text></View>
  </View>
}
