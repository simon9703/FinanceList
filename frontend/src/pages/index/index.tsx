import React from 'react'
import Taro from '@tarojs/taro'
import { Input, Text, View } from '@tarojs/components'
import { BottomTab } from '@/components/BottomTab'
import { ProfileCard } from '@/components/ProfileCard'
import { useProfileStore } from '@/store/profile'

export default function Index() {
  const people = useProfileStore((s) => s.people)
  return <View className='container tab-page app-bg'>
    <View className='home-hero'>
      <View className='app-logo'>◇</View>
      <View>
        <View className='page-title'>AI 财富观察档案</View>
        <View className='text-secondary'>微信小程序 · 让财富看得见，决策更智慧</View>
      </View>
    </View>
    <View className='stat-row'>
      <View><Text>全部档案</Text><Text>{people.length}</Text></View>
      <View><Text>监控中</Text><Text>8</Text></View>
      <View><Text>预警中</Text><Text>2</Text></View>
    </View>
    <View className='toolbar'>
      <Input className='search-input' placeholder='搜索人物' />
      <Text className='sort-pill'>最近更新 ▾</Text>
    </View>
    {people.map((person) => <View key={person.id} onClick={() => Taro.navigateTo({ url: `/pages/detail/index?id=${person.id}` })}><ProfileCard person={person} /></View>)}
    <View className='floating-create primary-gradient' onClick={() => Taro.navigateTo({ url: '/pages/create/index' })}>+ 新建档案</View>
    <BottomTab active='home' />
  </View>
}
