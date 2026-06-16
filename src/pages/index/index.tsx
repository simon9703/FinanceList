import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { BottomTab } from '@/components/BottomTab'
import { PageHeader } from '@/components/PageHeader'
import { ProfileCard } from '@/components/ProfileCard'
import { useProfileStore } from '@/store/profile'

export default function Index() {
  const people = useProfileStore((s) => s.people)
  return <View className='container tab-page'>
    <PageHeader eyebrow='Life Wealth Profile' title='人生财富结构档案' action={`${people.length} 个档案`} />
    <View className='section-title'>档案列表</View>
    {people.map((person) => <View key={person.id} onClick={() => Taro.navigateTo({ url: `/pages/detail/index?id=${person.id}` })}><ProfileCard person={person} /></View>)}
    <View className='floating-create' onClick={() => Taro.navigateTo({ url: '/pages/create/index' })}>+ 创建档案</View>
    <BottomTab active='home' />
  </View>
}
