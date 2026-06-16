import React from 'react'
import Taro from '@tarojs/taro'
import { Input, Text, View } from '@tarojs/components'
import { BottomTab } from '@/components/BottomTab'
import { ProfileCard } from '@/components/ProfileCard'
import { page } from '@/components/ui'
import { useProfileStore } from '@/store/profile'

export default function Index() {
  const people = useProfileStore((s) => s.people)
  return <View className={page}>
    <View className='my-[12px] mb-[28px] flex items-center gap-[22px]'>
      <View className='flex h-[76px] w-[76px] items-center justify-center rounded-[22px] bg-gradient-to-br from-[#1f7aff] to-[#62a8ff] text-[42px] font-black text-white shadow-[0_12px_30px_rgba(31,122,255,.28)]'>◇</View>
      <View>
        <View className='text-[42px] font-extrabold leading-[1.2]'>AI 财富观察档案</View>
        <View className='text-[24px] text-[#7a8496]'>微信小程序 · 让财富看得见，决策更智慧</View>
      </View>
    </View>
    <View className='mb-[18px] grid grid-cols-3 gap-[14px]'>
      <View className='flex flex-col gap-[8px] rounded-[18px] border border-solid border-[#edf1f7] bg-white p-[18px] text-[22px] text-[#7a8496]'><Text>全部档案</Text><Text className='text-[34px] font-black text-[#172033]'>{people.length}</Text></View>
      <View className='flex flex-col gap-[8px] rounded-[18px] border border-solid border-[#edf1f7] bg-white p-[18px] text-[22px] text-[#7a8496]'><Text>监控中</Text><Text className='text-[34px] font-black text-[#172033]'>8</Text></View>
      <View className='flex flex-col gap-[8px] rounded-[18px] border border-solid border-[#edf1f7] bg-white p-[18px] text-[22px] text-[#7a8496]'><Text>预警中</Text><Text className='text-[34px] font-black text-[#172033]'>2</Text></View>
    </View>
    <View className='mb-[18px] flex gap-[14px]'>
      <Input className='flex-1 rounded-[20px] border border-solid border-[#edf1f7] bg-white px-[22px] py-[18px] text-[26px]' placeholder='搜索人物' />
      <Text className='rounded-full bg-[#eef5ff] px-[20px] py-[16px] text-[24px] font-bold text-[#1976ff]'>最近更新 ▾</Text>
    </View>
    {people.map((person) => <View key={person.id} onClick={() => Taro.navigateTo({ url: `/pages/detail/index?id=${person.id}` })}><ProfileCard person={person} /></View>)}
    <View className='fixed left-[30px] right-[30px] bottom-[116px] z-[11] rounded-full bg-gradient-to-br from-[#1677ff] to-[#1f6bff] p-[24px] text-center text-[28px] font-black text-white shadow-[0_20px_50px_rgba(17,24,39,.22)]' onClick={() => Taro.navigateTo({ url: '/pages/create/index' })}>+ 新建档案</View>
    <BottomTab active='home' />
  </View>
}
