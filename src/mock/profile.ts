import { ConfidenceLevel, RiskLevel, StructureTag, TimelineTitle } from '@/config/profile'
import type { Clue, Person, TimelineItem } from '@/types/profile'

export const mockNow = Date.now()

export const mockDemoPerson: Person = {
  id: 'p_demo',
  name: '张先生',
  ageRange: '31-35',
  city: '一线',
  job: '互联网',
  asset: { total: 285, debt: 145, income: 3.2, expense: 2.1 },
  structure: { houseRatio: 72, carRatio: 10, investRatio: 13, cashRatio: 5 },
  tags: [StructureTag.MortgageMiddleClass, `风险：${RiskLevel.Medium}`, '流动性偏低'],
  summary: '高收入但流动性较弱',
  riskLevel: RiskLevel.Medium,
  updatedAt: mockNow,
}

export const mockInitialPeople: Person[] = [mockDemoPerson]

export const mockInitialClues: Clue[] = []

export const mockInitialTimeline: TimelineItem[] = [
  { id: 't_demo', personId: mockDemoPerson.id, title: TimelineTitle.Created, createdAt: mockNow },
]

export const mockCreateProfileForm = {
  name: '张先生',
  ageRange: '31-35',
  city: '一线',
  job: '互联网',
  house: '有房有贷',
  car: '30万+',
  income: '2-3万',
  debt: '房贷',
  desc: '',
}

export const mockDefaultPersonName = '未命名人物'

export const mockNewPersonAsset = { total: 180, debt: 90, income: 2.6, expense: 1.5 }

export const mockNewPersonStructure = {
  withHouse: { houseRatio: 70, carRatio: 12, investRatio: 10, cashRatio: 8 },
  withoutHouse: { houseRatio: 20, carRatio: 4, investRatio: 40, cashRatio: 36 },
}

export const mockDefaultClueConfidence = ConfidenceLevel.Medium
