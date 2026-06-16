import React from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { AssetOverview } from '@/components/AssetOverview'
import { BottomTab } from '@/components/BottomTab'
import { InfoPanel } from '@/components/InfoPanel'
import { PageHeader } from '@/components/PageHeader'
import { ProfileIcon } from '@/config/profile'
import { useProfileStore } from '@/store/profile'

const fmt = (time: number) => new Date(time).toISOString().slice(0, 10)

export default function DetailPage() {
  const { params } = useRouter()
  const people = useProfileStore((s) => s.people)
  const timeline = useProfileStore((s) => s.timeline)
  const rerunAnalysis = useProfileStore((s) => s.rerunAnalysis)
  const person = people.find((item) => item.id === params.id) || people[0]
  const items = timeline.filter((item) => item.personId === person.id).sort((a, b) => a.createdAt - b.createdAt)
  return <View className='container tab-page'>
    <PageHeader eyebrow={`${person.city} / ${person.ageRange} / ${person.job}`} title={`${ProfileIcon.Person} ${person.name}`} action={person.riskLevel ? `风险 ${person.riskLevel}` : '待分析'} />
    <View onClick={() => Taro.navigateTo({ url: `/pages/clue/index?id=${person.id}` })}><AssetOverview person={person} /></View>
    <InfoPanel title='现金流' suffix='按月估算' rows={[
      { label: '收入', value: `≈ ${person.asset.income} 万` },
      { label: '支出', value: `≈ ${person.asset.expense} 万` },
      { label: '结余', value: `≈ ${(person.asset.income - person.asset.expense).toFixed(1)} 万`, hint: '可用于投资/还贷' },
    ]} />
    <View className='info-panel'>
      <View className='panel-head'><Text className='panel-title'>风险标签</Text><Text className='panel-suffix'>AI 结构总结</Text></View>
      <View className='tag-wrap'>{person.tags.map((tag) => <Text key={tag} className={tag.includes('风险') ? 'tag warn' : 'tag'}>{ProfileIcon.Warning} {tag}</Text>)}</View>
      <View className='summary-text'>{person.summary}</View>
    </View>
    <View className='info-panel'>
      <View className='panel-head'><Text className='panel-title'>时间轴</Text><Text className='panel-suffix'>{items.length} 条记录</Text></View>
      {items.map((item) => <View key={item.id} className='timeline-row'><Text>{fmt(item.createdAt)}</Text><Text>{item.title}</Text></View>)}
    </View>
    <View className='detail-actions'><View className='btn' onClick={() => Taro.navigateTo({ url: `/pages/clue/index?id=${person.id}` })}>+ 添加线索</View><View className='btn secondary' onClick={() => rerunAnalysis(person.id)}>重新分析</View></View>
    <BottomTab active='insight' />
  </View>
}
