import type {Clue, MoneyItem, Profile, Snapshot} from './types'

export const demoUserId = 'demo-user'

export const demoProfile: Profile = {
  id: 'p_demo',
  userId: demoUserId,
  name: '张先生',
  ageRange: '31-35',
  city: '上海',
  job: '互联网产品经理',
  maritalStatus: '已婚',
  children: '1 个孩子，小学',
  totalAsset: 430,
  totalDebt: 145,
  monthlyIncome: 4.9,
  monthlyExpense: 3.35,
  confidence: 72,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-16T00:00:00.000Z'
}

export const demoMoneyItems: MoneyItem[] = [
  {id: 'm1', profileId: 'p_demo', category: 'asset', name: '房产', amount: 310, ratio: 72, confidence: 78},
  {id: 'm2', profileId: 'p_demo', category: 'asset', name: '股票基金', amount: 65, ratio: 15, confidence: 64},
  {id: 'm3', profileId: 'p_demo', category: 'debt', name: '房贷', amount: 120, ratio: 83, confidence: 76},
  {id: 'm4', profileId: 'p_demo', category: 'income', name: '工资', amount: 3.2, confidence: 72},
  {id: 'm5', profileId: 'p_demo', category: 'income', name: '副业', amount: 0.6, confidence: 58},
  {id: 'm6', profileId: 'p_demo', category: 'expense', name: '家庭支出', amount: 2.1, confidence: 66}
]

export const demoClues: Clue[] = [
  {
    id: 'c1',
    userId: demoUserId,
    profileId: 'p_demo',
    content: '最近开始做副业，每月约 6000 元。',
    type: 'income',
    confidence: 'medium',
    confirmed: true,
    hidden: false,
    createdAt: '2026-06-16T00:00:00.000Z',
    updatedAt: '2026-06-16T00:00:00.000Z'
  }
]

export const demoSnapshots: Snapshot[] = [
  {
    id: 's1',
    userId: demoUserId,
    profileId: 'p_demo',
    totalAsset: 430,
    totalDebt: 145,
    monthlyIncome: 4.9,
    monthlyExpense: 3.35,
    confidence: 72,
    createdAt: '2026-06-16T00:00:00.000Z'
  }
]
