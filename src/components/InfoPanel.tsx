import React from 'react'
import { Text, View } from '@tarojs/components'

export type InfoRow = {
  label: string
  value: string
  hint?: string
}

export function InfoPanel({ title, rows, suffix }: { title: string; rows: InfoRow[]; suffix?: string }) {
  return <View className='info-panel'>
    <View className='panel-head'>
      <Text className='panel-title'>{title}</Text>
      {suffix ? <Text className='panel-suffix'>{suffix}</Text> : null}
    </View>
    {rows.map((row) => <View key={row.label} className='panel-row'>
      <Text className='panel-label'>{row.label}</Text>
      <Text className='panel-value'>{row.value}</Text>
      {row.hint ? <Text className='panel-hint'>{row.hint}</Text> : null}
    </View>)}
  </View>
}
