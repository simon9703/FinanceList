import type { Clue, MoneyItem, Profile, Snapshot } from '../../lib/types'

export const demoUserId = 'demo-user'
export const demoProfile: Profile = {
  id: 'p_demo', userId: demoUserId, name: '张先生', ageRange: '31-35', city: '一线', job: '互联网', maritalStatus: '已婚', children: '1孩 · 小学', totalAsset: 430, totalDebt: 145, monthlyIncome: 4.9, monthlyExpense: 3.35, confidence: 72, createdAt: '2026-06-01T00:00:00.000Z', updatedAt: '2026-06-20T00:00:00.000Z'
}
export const demoMoneyItems: MoneyItem[] = [
  { id: 'm1', profileId: 'p_demo', category: 'asset', name: '房产', amount: 310, ratio: 72, confidence: 78 },
  { id: 'm2', profileId: 'p_demo', category: 'asset', name: '股票基金', amount: 65, ratio: 15, confidence: 64 },
  { id: 'm3', profileId: 'p_demo', category: 'debt', name: '房贷', amount: 120, ratio: 83, confidence: 76 },
  { id: 'm4', profileId: 'p_demo', category: 'income', name: '工资', amount: 3.2, confidence: 72 },
]
export const demoClues: Clue[] = [
  { id: 'c1', userId: demoUserId, profileId: 'p_demo', content: '听说最近开始做副业，每月约6000', type: 'income', confidence: 'medium', confirmed: true, hidden: false, createdAt: '2026-06-20T00:00:00.000Z', updatedAt: '2026-06-20T00:00:00.000Z' },
]
export const demoSnapshots: Snapshot[] = [
  { id: 's1', userId: demoUserId, profileId: 'p_demo', totalAsset: 430, totalDebt: 145, monthlyIncome: 4.9, monthlyExpense: 3.35, confidence: 72, createdAt: '2026-06-20T00:00:00.000Z' },
]
