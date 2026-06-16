import React, { useMemo, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Input, Text, View } from '@tarojs/components'
import { BottomTab } from '@/components/BottomTab'
import { button, card, formGrid, input, inputInGrid, page, panelHead, panelHint, panelSuffix, panelTitle, phoneNav, primaryGradient, tag } from '@/components/ui'
import { mockCreateProfileForm } from '@/mock/profile'
import { useProfileStore } from '@/store/profile'
import type { ProfileFormValues } from '@/services/profile'
import { formOptions } from './config'

const numberValue = (value: string) => Number(value.replace(/[，,万\s]/g, '')) || 0
const asText = (value: number) => String(value)

function TagGroup({ title, values, selected, onToggle, multi = true }: { title: string; values: readonly string[]; selected: string[]; onToggle: (value: string) => void; multi?: boolean }) {
  return <View className={`${card} p-[24px]`}>
    <View className='mb-[16px] text-[24px] text-[#8b929e]'>{title}</View>
    <View className='flex flex-wrap gap-[12px]'>{values.map((value) => <Text key={value} className={selected.includes(value) ? `${tag} bg-[#111827] text-white` : tag} onClick={() => onToggle(value)}>{value}</Text>)}</View>
    {!multi ? <View className={panelHint}>单选</View> : null}
  </View>
}

export default function CreatePage() {
  const { params } = useRouter()
  const people = useProfileStore((s) => s.people)
  const upsertPerson = useProfileStore((s) => s.upsertPerson)
  const editing = useMemo(() => people.find((item) => item.id === params.id), [params.id, people])
  const [form, setForm] = useState<ProfileFormValues>(() => editing ? {
    ...mockCreateProfileForm,
    id: editing.id,
    name: editing.name,
    ageRange: editing.ageRange,
    city: editing.city,
    job: editing.job,
    maritalStatus: editing.maritalStatus || '已婚',
    children: editing.children || '1孩 · 小学',
    totalAsset: editing.asset.total,
    debt: editing.asset.debt,
    income: editing.asset.income,
    expense: editing.asset.expense,
  } : mockCreateProfileForm)

  const setSingle = (key: keyof ProfileFormValues, value: string) => setForm((state) => ({ ...state, [key]: value }))
  const toggle = (key: 'assetTags' | 'debtTags' | 'incomeTags' | 'expenseTags', value: string) => setForm((state) => ({ ...state, [key]: state[key].includes(value) ? state[key].filter((item) => item !== value) : [...state[key], value] }))

  return <View className={page}>
    <View className={phoneNav}><Text onClick={() => Taro.navigateBack()}>‹</Text><Text>{editing ? '编辑当前判断' : '创建人物档案'}</Text><Text>··· ◎</Text></View>
    <View className='mb-[22px] grid grid-cols-2 rounded-full bg-[#eef2f7] p-[6px]'>
      <Text className={`rounded-full py-[14px] text-center text-[24px] font-extrabold ${form.mode === 'simple' ? 'bg-white text-[#1677ff] shadow-[0_8px_22px_rgba(16,35,75,.08)]' : 'text-[#7b8799]'}`} onClick={() => setForm({ ...form, mode: 'simple' })}>简单模式</Text>
      <Text className={`rounded-full py-[14px] text-center text-[24px] font-extrabold ${form.mode === 'pro' ? 'bg-white text-[#1677ff] shadow-[0_8px_22px_rgba(16,35,75,.08)]' : 'text-[#7b8799]'}`} onClick={() => setForm({ ...form, mode: 'pro' })}>Pro 模式</Text>
    </View>

    <View className={card}>
      <View className={panelHead}><Text className={panelTitle}>人物信息</Text><Text className={panelSuffix}>称呼建议必填</Text></View>
      <Input className={input} value={form.name} onInput={(event) => setForm({ ...form, name: String(event.detail.value) })} placeholder='称呼' />
      <View className={formGrid}>
        <Input className={inputInGrid} value={form.ageRange} onInput={(event) => setSingle('ageRange', String(event.detail.value))} placeholder='年龄区间' />
        <Input className={inputInGrid} value={form.city} onInput={(event) => setSingle('city', String(event.detail.value))} placeholder='城市' />
        <Input className={inputInGrid} value={form.job} onInput={(event) => setSingle('job', String(event.detail.value))} placeholder='职业' />
        <Input className={inputInGrid} value={form.maritalStatus} onInput={(event) => setSingle('maritalStatus', String(event.detail.value))} placeholder='婚姻情况' />
        <Input className={inputInGrid} value={form.children} onInput={(event) => setSingle('children', String(event.detail.value))} placeholder='孩子情况' />
      </View>
    </View>

    <TagGroup title='年龄区间' values={formOptions.ageRange} selected={[form.ageRange]} multi={false} onToggle={(value) => setSingle('ageRange', value)} />
    <TagGroup title='城市 / 职业 / 家庭' values={[...formOptions.city, ...formOptions.job, ...formOptions.maritalStatus, ...formOptions.children]} selected={[form.city, form.job, form.maritalStatus, form.children]} onToggle={(value) => {
      if ((formOptions.city as readonly string[]).includes(value)) setSingle('city', value)
      if ((formOptions.job as readonly string[]).includes(value)) setSingle('job', value)
      if ((formOptions.maritalStatus as readonly string[]).includes(value)) setSingle('maritalStatus', value)
      if ((formOptions.children as readonly string[]).includes(value)) setSingle('children', value)
    }} />

    <View className={card}>
      <View className={panelHead}><Text className={panelTitle}>初始判断</Text><Text className={panelSuffix}>单位：万</Text></View>
      <View className={formGrid}>
        <Input className={inputInGrid} type='digit' value={asText(form.totalAsset)} onInput={(event) => setForm({ ...form, totalAsset: numberValue(String(event.detail.value)) })} placeholder='总资产约 430万' />
        <Input className={inputInGrid} type='digit' value={asText(form.debt)} onInput={(event) => setForm({ ...form, debt: numberValue(String(event.detail.value)) })} placeholder='总负债约 145万' />
        <Input className={inputInGrid} type='digit' value={asText(form.income)} onInput={(event) => setForm({ ...form, income: numberValue(String(event.detail.value)) })} placeholder='月收入约 4.9万' />
        <Input className={inputInGrid} type='digit' value={asText(form.expense)} onInput={(event) => setForm({ ...form, expense: numberValue(String(event.detail.value)) })} placeholder='月支出约 3.35万' />
      </View>
    </View>

    <TagGroup title='已知资产标签' values={formOptions.assetTags} selected={form.assetTags} onToggle={(value) => toggle('assetTags', value)} />
    <TagGroup title='已知负债标签' values={formOptions.debtTags} selected={form.debtTags} onToggle={(value) => toggle('debtTags', value)} />
    <TagGroup title='收入能力标签' values={formOptions.incomeTags} selected={form.incomeTags} onToggle={(value) => toggle('incomeTags', value)} />
    <TagGroup title='支出压力标签' values={formOptions.expenseTags} selected={form.expenseTags} onToggle={(value) => toggle('expenseTags', value)} />

    {form.mode === 'pro' ? <View className={card}><View className={panelTitle}>Pro 逐项信息</View><View className={panelHint}>当前版本先保存名称、金额、持续情况、可信度、备注的 mock 结构；下一步可把每个标签展开成可编辑明细。</View></View> : null}

    <View className={`${button} ${primaryGradient} my-[28px]`} onClick={() => { const id = upsertPerson(form); Taro.redirectTo({ url: `/pages/detail/index?id=${id}` }) }}>{editing ? '保存并更新判断' : '保存档案并生成快照'}</View>
    <BottomTab active='create' />
  </View>
}
