import React, { useMemo, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Textarea, View } from '@tarojs/components'
import { BottomTab } from '@/components/BottomTab'
import { PageHeader } from '@/components/PageHeader'
import { ClueType } from '@/config/profile'
import { mockClueInput } from '@/mock/clue'
import { mockDefaultClueConfidence } from '@/mock/profile'
import { analyzeProfile } from '@/services/ai'
import { useProfileStore } from '@/store/profile'
import { cluePageText } from './config'

export default function CluePage() {
  const { params } = useRouter()
  const [content, setContent] = useState(mockClueInput.defaultContent)
  const [preview, setPreview] = useState('')
  const people = useProfileStore((s) => s.people)
  const clues = useProfileStore((s) => s.clues)
  const addClue = useProfileStore((s) => s.addClue)
  const person = useMemo(() => people.find((item) => item.id === params.id) || people[0], [params.id, people])
  return <View className='container tab-page'>
    <PageHeader eyebrow='AI Clue' title={cluePageText.inputTitle} action={person?.name} />
    <View className='info-panel clue-editor'><Textarea className='input textarea-clean' value={content} onInput={(e) => setContent(String(e.detail.value))} placeholder={mockClueInput.placeholder} /></View>
    {preview ? <View className='info-panel'><View className='panel-head'><View className='panel-title'>{cluePageText.previewTitle}</View><View className='panel-suffix'>Mock AI</View></View><View className='code-preview'>{preview}</View></View> : null}
    <View className='detail-actions'><View className='btn secondary' onClick={async () => { const result = await analyzeProfile(person, [...clues, { id: 'preview', personId: person.id, content, type: ClueType.LifeSignal, confidence: mockDefaultClueConfidence, createdAt: Date.now() }]); setPreview(JSON.stringify(result.parsedClue, null, 2)) }}>{cluePageText.parseButton}</View>
    <View className='btn' onClick={async () => { await addClue(person.id, content); Taro.navigateBack() }}>{cluePageText.saveButton}</View></View>
    <BottomTab active='insight' />
  </View>
}
