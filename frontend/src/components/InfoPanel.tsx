import React from 'react'
import { Text, View } from '@tarojs/components'
import { card, panelHead, panelHint, panelRow, panelSuffix, panelTitle, panelValue } from './ui'

export type InfoRow = {
  label: string
  value: string
  hint?: string
}

export function InfoPanel({ title, rows, suffix }: { title: string; rows: InfoRow[]; suffix?: string }) {
  return <View className={card}>
    <View className={panelHead}>
      <Text className={panelTitle}>{title}</Text>
      {suffix ? <Text className={panelSuffix}>{suffix}</Text> : null}
    </View>
    {rows.map((row) => <View key={row.label} className={panelRow}>
      <Text className='text-[24px] text-[#89919d]'>{row.label}</Text>
      <Text className={panelValue}>{row.value}</Text>
      {row.hint ? <Text className={panelHint}>{row.hint}</Text> : null}
    </View>)}
  </View>
}
