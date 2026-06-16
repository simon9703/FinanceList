import React from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { AssetOverview } from '@/components/AssetOverview'
import { BottomTab } from '@/components/BottomTab'
import { DonutChart } from '@/components/Charts'
import { button, card, page, panelHead, panelHint, panelSuffix, panelTitle, panelValue, primaryGradient, secondaryButton, tag, textSecondary, title } from '@/components/ui'
import { useProfileStore } from '@/store/profile'

const fmt = (time: number) => new Date(time).toISOString().slice(0, 10)
const money = (value: number) => `${value.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}万`

export default function DetailPage() {
  const { params } = useRouter()
  const people = useProfileStore((s) => s.people)
  const clues = useProfileStore((s) => s.clues)
  const snapshots = useProfileStore((s) => s.snapshots)
  const person = people.find((item) => item.id === params.id) || people[0]
  const personClues = clues.filter((item) => item.personId === person.id)
  const personSnapshots = snapshots.filter((item) => item.personId === person.id)

  return <View className={page}>
    <View className='mb-[26px] flex items-center justify-between text-[28px] font-extrabold'><Text onClick={() => Taro.navigateBack()}>‹</Text><Text>档案详情</Text><Text>···</Text></View>
    <View className='mb-[22px] flex items-start justify-between'><View><View className={title}>{person.name}</View><View className={textSecondary}>{person.city} · {person.ageRange} · {person.job}</View><View className='mt-[10px] text-[24px] text-[#526071]'>👨‍👩‍👧 {person.family}</View></View><Text className='rounded-full bg-[#eef5ff] px-[20px] py-[16px] text-[24px] font-bold text-[#1976ff]'>{person.riskLevel}风险</Text></View>
    <AssetOverview person={person} />

    <View className={card}><View className={panelHead}><Text className={panelTitle}>资产结构</Text><Text className={panelSuffix}>当前估算</Text></View>{person.assetItems?.length ? <DonutChart items={person.assetItems} total={person.asset.total} /> : null}{person.assetItems?.map((item) => <View className='grid grid-cols-[1.3fr_1fr_1.5fr_auto] items-center gap-[14px] py-[18px] text-[24px] text-[#526071]' key={item.key}><Text>{item.icon} {item.name}</Text><Text>{money(item.amount)}</Text><View className='h-[8px] overflow-hidden rounded-full bg-[#e9eef7]'><View className={`${primaryGradient} h-full rounded-full`} style={{ width: `${item.ratio}%` }} /></View><Text>{item.ratio}%</Text></View>)}</View>

    <View className='grid grid-cols-2 gap-[18px]'><View className={card}><View className={panelTitle}>收入能力</View>{person.incomeItems?.map((item) => <View className='flex items-center justify-between gap-[18px] pt-[22px] text-[26px] text-[#606873]' key={item.key}><Text>{item.icon} {item.name}</Text><Text className={panelValue}>{money(item.amount)}</Text></View>)}</View><View className={card}><View className={panelTitle}>支出压力</View>{person.expenseItems?.map((item) => <View className='flex items-center justify-between gap-[18px] pt-[22px] text-[26px] text-[#606873]' key={item.key}><Text>{item.icon} {item.name}</Text><Text className={panelValue}>{money(item.amount)}</Text></View>)}</View></View>

    <View className={card}><View className={panelHead}><Text className={panelTitle}>线索列表</Text><Text className={panelSuffix}>{personClues.length} 条</Text></View>{personClues.map((item) => <View key={item.id} className='flex flex-col gap-[10px] border-t border-solid border-[#f0f3f8] py-[18px] text-[24px] text-[#526071]'><Text>{fmt(item.createdAt)}</Text><Text>{item.content}</Text><Text className={tag}>收入线索 · 可信度{item.confidence === 'high' ? '高' : '中'}</Text></View>)}</View>

    <View className={card}><View className={panelHead}><Text className={panelTitle}>判断变化</Text><Text className={panelSuffix}>近6次变化</Text></View>{person.recentChanges?.map((item) => <View key={item.label} className='grid grid-cols-[1fr_auto_auto] items-center gap-[12px] py-[8px] text-[24px] text-[#5d6674]'><Text>{item.label}</Text><Text>{item.before ? `${item.before} → ` : ''}{item.after}</Text><Text className={panelSuffix}>{item.source}</Text></View>)}</View>

    <View className={card}><View className={panelHead}><Text className={panelTitle}>历史快照</Text><Text className={panelSuffix}>{personSnapshots.length} 份</Text></View>{personSnapshots.slice(0, 2).map((item) => <View className='flex items-center justify-between gap-[18px] pt-[22px] text-[26px] text-[#606873]' key={item.id}><Text>{item.title}</Text><Text className={panelValue}>{money(item.total)} · 可信度 {item.confidence}%</Text></View>)}</View>

    <View className={`${card} bg-gradient-to-b from-white to-[#f3f8ff]`}><View className={panelTitle}>未来推演</View>{(person.forecastScenarios || []).map((scenario) => <View className='flex items-center justify-between pt-[18px] text-[26px] font-extrabold text-[#172033]' key={scenario.name}><Text>{scenario.name} · 5年/10年</Text><Text>{money(scenario.fiveYearNetAsset)} / {money(scenario.tenYearNetAsset)}</Text></View>)}<View className={panelHint}>基于当前信息推演，并非真实财务结果</View></View>
    <View className='grid grid-cols-2 gap-[22px]'><View className={`${button} ${primaryGradient}`} onClick={() => Taro.navigateTo({ url: `/pages/clue/index?id=${person.id}` })}>＋添加线索</View><View className={secondaryButton} onClick={() => Taro.navigateTo({ url: `/pages/create/index?id=${person.id}` })}>编辑当前判断</View></View>
    <BottomTab active='insight' />
  </View>
}
