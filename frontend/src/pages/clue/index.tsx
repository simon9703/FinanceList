import React, { useMemo, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Text, Textarea, View } from '@tarojs/components'
import { BottomTab } from '@/components/BottomTab'
import { button, card, glassCard, metricStrong, page, panelHead, panelHint, panelSuffix, panelTitle, phoneNav, primaryGradient, tag } from '@/components/ui'
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

  return <View className={page}>
    <View className={phoneNav}><Text onClick={() => Taro.navigateBack()}>‹</Text><Text>添加线索</Text><Text>··· ◎</Text></View>
    <View className='mb-[18px] flex gap-[14px]'>{typeTabs.map((item) => <Text key={item} className={`flex-1 rounded-full py-[14px] text-center text-[24px] font-bold ${activeType === item ? 'bg-[#1677ff] text-white shadow-[0_8px_20px_rgba(22,119,255,.24)]' : 'bg-[#edf2f8] text-[#748096]'}`} onClick={() => setActiveType(item)}>{item}</Text>)}</View>

    <View className={`${glassCard} relative min-h-[220px] rounded-[22px] p-[24px]`}>
      <Textarea className='min-h-[190px] w-full text-[28px] leading-[1.65] text-[#172033]' value={content} maxlength={500} onInput={(event) => setContent(String(event.detail.value))} placeholder={mockClueInput.placeholder} />
      <Text className='absolute right-[24px] bottom-[18px] text-[22px] text-[#a3adbd]'>{content.length}/500</Text>
    </View>
    <View className='my-[22px] flex flex-wrap gap-x-[18px] gap-y-[14px]'>{quickTags.map((item) => <Text key={item} className='min-w-[150px] rounded-[16px] bg-[#eef2f7] px-[18px] py-[16px] text-center text-[24px] text-[#60708a]'>{item}</Text>)}</View>
    <View className={`${button} ${primaryGradient} my-[8px] mb-[24px] shadow-[0_16px_34px_rgba(22,119,255,.28)]`} onClick={() => setPreview(parseClue(content))}>✦ AI解析</View>

    <View className={`${card} overflow-hidden`}>
      <View className={panelHead}><Text className={panelTitle}>解析结果</Text><Text className={panelSuffix}>{preview.length ? '待确认' : '等待解析'}</Text></View>
      {preview.length ? <View className='mt-[18px] flex flex-col gap-[8px] rounded-[22px] bg-[#ecfbf4] p-[22px] text-[28px] font-black text-[#17a96b]'>✓ 解析成功<Text className='text-[22px] font-medium text-[#58a486]'>已识别 {preview.length} 条线索，确认后才保存</Text></View> : null}
      {preview.map((item) => <View className='mt-[18px] grid grid-cols-[1fr_auto] gap-[12px] rounded-[20px] border border-solid border-[#eef2f7] bg-white p-[22px] text-[26px] text-[#172033]' key={`${item.type}-${item.item}`}><View><Text className={item.type === '收入' ? `${tag} mr-[12px] bg-[#e9fbf3] text-[#18a86e]` : `${tag} mr-[12px] bg-[#edf5ff] text-[#1677ff]`}>{item.type}</Text><Text>{item.item}</Text></View><Text className={metricStrong}>{item.amountText}</Text><View className={`${panelHint} col-span-full`}>{item.explanation} · 建议影响：{item.impacts.map((impact) => `${impact.label}${impact.deltaText}`).join('、')}</View></View>)}
    </View>

    <View className='my-[18px] mb-[110px] text-center text-[22px] text-[#929caf]'>ⓘ AI可能会识别，请确认后保存</View>
    <View className={`${button} ${primaryGradient} fixed left-[30px] right-[30px] bottom-[78px] z-[12] rounded-[18px]`} onClick={async () => { if (!preview.length) setPreview(parseClue(content)); await addClue(person.id, content, true); Taro.navigateBack() }}>确认并保存到线索列表</View>
    <BottomTab active='insight' />
  </View>
}
