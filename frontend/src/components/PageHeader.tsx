import React from 'react'
import { Text, View } from '@tarojs/components'

export function PageHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: string }) {
  return <View className='my-[10px] mb-[28px] flex items-center justify-between gap-[20px]'>
    <View>
      <View className='mb-[8px] text-[22px] uppercase tracking-[.08em] text-[#8b929e]'>{eyebrow}</View>
      <View className='text-[42px] font-extrabold leading-[1.2]'>{title}</View>
    </View>
    {action ? <Text className='whitespace-nowrap rounded-full bg-white px-[22px] py-[14px] text-[24px] font-bold text-[#111827] shadow-[0_10px_32px_rgba(22,28,45,.06)]'>{action}</Text> : null}
  </View>
}
