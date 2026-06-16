import React from 'react'
import Taro from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { BOTTOM_TABS } from '@/config/profile'

export function BottomTab({ active }: { active: string }) {
  return <View className='bottom-tab'>
    {BOTTOM_TABS.map((item) => <View key={item.key} className={`tab-item ${active === item.key ? 'active' : ''}`} onClick={() => Taro.navigateTo({ url: item.url })}>
      <Text className='tab-icon'>{item.icon}</Text>
      <Text>{item.label}</Text>
    </View>)}
  </View>
}
