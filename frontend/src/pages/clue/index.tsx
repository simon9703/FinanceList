import React, { useMemo, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Text, Textarea, View } from '@tarojs/components'
import { BottomTab } from '@/components/BottomTab'
import { mockClueInput } from '@/mock/clue'
import type { ParsedClue } from '@/types/profile'
import { useProfileStore } from '@/store/profile'

const typeTabs = ['资产', '负债', '收入', '家庭', '消费', '职业', '其他']
const quickTags = ['工资收入', '奖金/补贴', '投资计划', '房产相关', '大额支出']

export default function CluePage() {
  const { params } = useRouter()
  const [content, setContent] = useState('我刚刚收到年终奖金8万元，打算拿出4万元投资指数基金。')
  const [activeType, setActiveType] = useState('全部')
  const [preview, setPreview] = useState<ParsedClue[]>([])
  const people = useProfileStore((s) => s.people)
  const addClue = useProfileStore((s) => s.addClue)
  const parseClue = useProfileStore((s) => s.parseClue)
  const person = useMemo(() => people.find((item) => item.id === params.id) || people[0], [params.id, people])

  return <View className='container tab-page app-bg clue-page'>
    <View className='phone-nav'><Text onClick={() => Taro.navigateBack()}>‹</Text><Text>添加线索</Text><Text>··· ◎</Text></View>
    <View className='clue-tabs'>{typeTabs.map((item) => <Text key={item} className={activeType === item ? 'active' : ''} onClick={() => setActiveType(item)}>{item}</Text>)}</View>

    <View className='clue-input-card glass-card'>
      <Textarea className='clue-textarea' value={content} maxlength={500} onInput={(event) => setContent(String(event.detail.value))} placeholder={mockClueInput.placeholder} />
      <Text className='counter'>{content.length}/500</Text>
    </View>
    <View className='quick-tags'>{quickTags.map((item) => <Text key={item}>{item}</Text>)}</View>
    <View className='btn primary-gradient ai-button' onClick={() => setPreview(parseClue(content))}>✦ AI解析</View>

    <View className='info-panel parse-card'>
      <View className='panel-head'><Text className='panel-title'>解析结果</Text><Text className='panel-suffix'>{preview.length ? '待确认' : '等待解析'}</Text></View>
      {preview.length ? <View className='parse-success'>✓ 解析成功<Text>已识别 {preview.length} 条线索，确认后才保存</Text></View> : null}
      {preview.map((item) => <View className='parsed-item' key={`${item.type}-${item.item}`}><View><Text className={item.type === '收入' ? 'tag income-tag' : 'tag asset-tag'}>{item.type}</Text><Text>{item.item}</Text></View><Text className='metric-strong'>{item.amountText}</Text><View className='panel-hint'>{item.explanation} · 建议影响：{item.impacts.map((impact) => `${impact.label}${impact.deltaText}`).join('、')}</View></View>)}
    </View>

    <View className='ai-disclaimer'>ⓘ AI可能会识别，请确认后保存</View>
    <View className='btn primary-gradient fixed-save' onClick={async () => { if (!preview.length) setPreview(parseClue(content)); await addClue(person.id, content, true); Taro.navigateBack() }}>确认并保存到线索列表</View>
    <BottomTab active='insight' />
  </View>
}
