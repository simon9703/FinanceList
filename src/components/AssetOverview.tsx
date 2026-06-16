import React from 'react'
import { Text, View } from '@tarojs/components'
import { ASSET_STRUCTURE_META, ProfileIcon } from '@/config/profile'
import type { Person } from '@/types/profile'

const formatWan = (value: number) => value.toLocaleString('zh-CN', { maximumFractionDigits: 1 })

const structureRows = ASSET_STRUCTURE_META

export function AssetOverview({ person }: { person: Person }) {
  const netAsset = Math.max(person.asset.total - person.asset.debt, 0)

  return <View className='hero-card'>
    <View className='hero-topline'>
      <Text>总资产</Text>
      <Text className='hero-eye'>◎</Text>
    </View>
    <View className='hero-amount'>≈ {formatWan(person.asset.total)}<Text className='hero-unit'> 万</Text></View>
    <View className='hero-sub'>净资产 ≈ {formatWan(netAsset)} 万 · 负债 ≈ {formatWan(person.asset.debt)} 万</View>
    <View className='hero-profit'>月结余 ≈ +{formatWan(Math.max(person.asset.income - person.asset.expense, 0))} 万</View>

    <View className='hero-actions'>
      <View className='pill-action'>{ProfileIcon.Invest} 添加线索</View>
      <View className='pill-action secondary'>重新分析</View>
    </View>

    <View className='ratio-bar'>
      {structureRows.map((item) => <View key={item.key} className={`ratio-fill ${item.colorClass}`} style={{ width: `${person.structure[item.key]}%` }} />)}
    </View>

    <View className='asset-list'>
      {structureRows.map((item) => <View className='asset-row' key={item.key}>
        <View className='asset-name'><Text className={`dot ${item.colorClass}`} />{item.icon} {item.label}</View>
        <Text className='asset-value'>{person.structure[item.key]}%</Text>
      </View>)}
    </View>
  </View>
}
