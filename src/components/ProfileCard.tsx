import React from 'react'
import { Text, View } from '@tarojs/components'
import { PROFILE_ICON_GROUP, ProfileIcon } from '@/config/profile'
import type { Person } from '@/types/profile'

export function ProfileCard({ person }: { person: Person }) {
  const debtRatio = Math.round((person.asset.debt / Math.max(person.asset.total, 1)) * 100)

  return <View className='profile-card'>
    <View className='profile-card-head'>
      <View>
        <View className='title'>{ProfileIcon.Person} {person.name}</View>
        <View className='subtle'>{person.city} / {person.ageRange} / {person.job}</View>
      </View>
      <Text className='mini-icons'>{PROFILE_ICON_GROUP}</Text>
    </View>
    <View className='profile-total'>≈ {person.asset.total}万</View>
    <View className='profile-meta'>负债率 {debtRatio}% · 月结余 ≈ {(person.asset.income - person.asset.expense).toFixed(1)}万</View>
    <View className='compact-metrics'>
      <View><Text>月收入</Text><Text>{person.asset.income}万</Text></View>
      <View><Text>月支出</Text><Text>{person.asset.expense}万</Text></View>
      <View><Text>风险</Text><Text>{person.riskLevel || '-'}</Text></View>
    </View>
    <View className='tag-wrap'>{person.tags.slice(0, 3).map((tag) => <Text key={tag} className={tag.includes('风险') ? 'tag warn' : 'tag'}>{tag}</Text>)}</View>
    <View className='card-footer'>{ProfileIcon.Invest} 最近更新</View>
  </View>
}
