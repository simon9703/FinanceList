import React from 'react'
import { Text, View } from '@tarojs/components'

export function PageHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: string }) {
  return <View className='page-header'>
    <View>
      <View className='eyebrow'>{eyebrow}</View>
      <View className='page-title'>{title}</View>
    </View>
    {action ? <Text className='header-chip'>{action}</Text> : null}
  </View>
}
