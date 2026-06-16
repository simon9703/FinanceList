import React from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { AssetOverview } from '@/components/AssetOverview'
import { BottomTab } from '@/components/BottomTab'
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

  return <View className='container tab-page app-bg'>
    <View className='nav-title'><Text onClick={() => Taro.navigateBack()}>‹</Text><Text>档案详情</Text><Text>···</Text></View>
    <View className='person-head'><View><View className='title'>{person.name}</View><View className='text-secondary'>{person.city} · {person.ageRange} · {person.job}</View><View className='family-line'>👨‍👩‍👧 {person.family}</View></View><Text className='risk-pill'>{person.riskLevel}风险</Text></View>
    <AssetOverview person={person} />

    <View className='info-panel'><View className='panel-head'><Text className='panel-title'>资产结构</Text><Text className='panel-suffix'>当前估算</Text></View>{person.assetItems?.map((item) => <View className='progress-row' key={item.key}><Text>{item.icon} {item.name}</Text><Text>{money(item.amount)}</Text><View className='progress-track'><View className='progress-fill primary-gradient' style={{ width: `${item.ratio}%` }} /></View><Text>{item.ratio}%</Text></View>)}</View>

    <View className='two-col'><View className='info-panel'><View className='panel-title'>收入能力</View>{person.incomeItems?.map((item) => <View className='panel-row' key={item.key}><Text>{item.icon} {item.name}</Text><Text className='panel-value'>{money(item.amount)}</Text></View>)}</View><View className='info-panel'><View className='panel-title'>支出压力</View>{person.expenseItems?.map((item) => <View className='panel-row' key={item.key}><Text>{item.icon} {item.name}</Text><Text className='panel-value'>{money(item.amount)}</Text></View>)}</View></View>

    <View className='info-panel'><View className='panel-head'><Text className='panel-title'>线索列表</Text><Text className='panel-suffix'>{personClues.length} 条</Text></View>{personClues.map((item) => <View key={item.id} className='clue-row'><Text>{fmt(item.createdAt)}</Text><Text>{item.content}</Text><Text className='tag'>收入线索 · 可信度{item.confidence === 'high' ? '高' : '中'}</Text></View>)}</View>

    <View className='info-panel'><View className='panel-head'><Text className='panel-title'>判断变化</Text><Text className='panel-suffix'>近6次变化</Text></View>{person.recentChanges?.map((item) => <View key={item.label} className='change-row'><Text>{item.label}</Text><Text>{item.before ? `${item.before} → ` : ''}{item.after}</Text><Text className='panel-suffix'>{item.source}</Text></View>)}</View>

    <View className='info-panel'><View className='panel-head'><Text className='panel-title'>历史快照</Text><Text className='panel-suffix'>{personSnapshots.length} 份</Text></View>{personSnapshots.slice(0, 2).map((item) => <View className='panel-row' key={item.id}><Text>{item.title}</Text><Text className='panel-value'>{money(item.total)} · 可信度 {item.confidence}%</Text></View>)}</View>

    <View className='info-panel future-card'><View className='panel-title'>未来推演</View>{(person.forecastScenarios || []).map((scenario) => <View className='forecast-entry' key={scenario.name}><Text>{scenario.name} · 5年/10年</Text><Text>{money(scenario.fiveYearNetAsset)} / {money(scenario.tenYearNetAsset)}</Text></View>)}<View className='panel-hint'>基于当前信息推演，并非真实财务结果</View></View>
    <View className='detail-actions'><View className='btn primary-gradient' onClick={() => Taro.navigateTo({ url: `/pages/clue/index?id=${person.id}` })}>＋添加线索</View><View className='btn secondary' onClick={() => Taro.navigateTo({ url: `/pages/create/index?id=${person.id}` })}>编辑当前判断</View></View>
    <BottomTab active='insight' />
  </View>
}
