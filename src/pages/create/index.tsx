import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { Input, Text, View } from '@tarojs/components'
import { BottomTab } from '@/components/BottomTab'
import { PageHeader } from '@/components/PageHeader'
import { mockCreateProfileForm } from '@/mock/profile'
import { useProfileStore } from '@/store/profile'
import { createProfileGroups, type CreateProfileGroupKey } from './config'

export default function CreatePage() {
  const createPerson = useProfileStore((s) => s.createPerson)
  const [form, setForm] = useState(mockCreateProfileForm)
  const pick = (key: CreateProfileGroupKey, value: string) => setForm((s) => ({ ...s, [key]: value }))
  return <View className='container tab-page'>
    <PageHeader eyebrow='New Profile' title='创建人物档案' action='弱表单' />
    <View className='info-panel'>
      <View className='panel-head'><Text className='panel-title'>基础信息</Text><Text className='panel-suffix'>先粗略描述</Text></View>
      <Input className='input clean' value={form.name} onInput={(e) => setForm({ ...form, name: String(e.detail.value) })} placeholder='人物称呼' />
      <Input className='input clean' value={form.desc} onInput={(e) => setForm({ ...form, desc: String(e.detail.value) })} placeholder='一句话描述（可选）' />
    </View>
    {Object.entries(createProfileGroups).map(([key, values]) => <View className='tag-panel' key={key}>
      <View className='tag-panel-title'>{key}</View>
      <View className='tag-wrap'>{values.map((value) => <Text key={value} className={form[key as CreateProfileGroupKey] === value ? 'tag selected' : 'tag'} onClick={() => pick(key as CreateProfileGroupKey, value)}>{value}</Text>)}</View>
    </View>)}
    <View className='btn sticky-btn' onClick={() => { const id = createPerson(form); Taro.redirectTo({ url: `/pages/detail/index?id=${id}` }) }}>保存档案</View>
    <BottomTab active='create' />
  </View>
}
