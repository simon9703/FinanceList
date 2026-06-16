import { ConfidenceLevel } from '@/config/profile'
import type { Clue, Person, TimelineItem } from '@/types/profile'
import { demoClues, demoPerson } from '@/services/profile'

export const mockNow = Date.now()
export const mockDemoPerson: Person = demoPerson
export const mockInitialPeople: Person[] = [mockDemoPerson]
export const mockInitialClues: Clue[] = demoClues
export const mockInitialTimeline: TimelineItem[] = [
  { id: 't_demo', personId: mockDemoPerson.id, title: '创建档案', createdAt: mockNow },
]

export const mockCreateProfileForm = {
  id: '',
  name: '张先生',
  ageRange: '31-35',
  city: '一线',
  job: '互联网',
  maritalStatus: '已婚',
  children: '1孩 · 小学',
  totalAsset: 430,
  debt: 145,
  income: 4.9,
  expense: 3.35,
  assetTags: ['房产', '车辆', '股票基金', '现金'],
  debtTags: ['房贷', '消费贷'],
  incomeTags: ['工资', '副业', '生意'],
  expenseTags: ['房贷', '生活', '教育'],
  mode: 'simple' as const,
}

export const mockDefaultClueConfidence = ConfidenceLevel.Medium
