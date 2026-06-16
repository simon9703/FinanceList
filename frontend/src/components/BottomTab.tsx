import React from 'react'
import Taro from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { BOTTOM_TABS } from '@/config/profile'

export function BottomTab({ active }: { active: string }) {
  return <View className='fixed inset-x-0 bottom-0 z-10 grid h-[104px] grid-cols-3 border-t border-solid border-[rgba(17,24,39,.08)] bg-[rgba(255,255,255,.94)] px-[34px] py-[12px] pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur-[18px]'>
    {BOTTOM_TABS.map((item) => <View key={item.key} className={`flex flex-col items-center justify-center gap-[6px] text-[22px] font-bold ${active === item.key ? 'text-[#111827]' : 'text-[#9aa1aa]'}`} onClick={() => Taro.navigateTo({ url: item.url })}>
      <Text className='text-[30px] leading-none'>{item.icon}</Text>
      <Text>{item.label}</Text>
    </View>)}
  </View>
}
