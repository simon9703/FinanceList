import type { ConfidenceLevel, RiskLevel } from '@/config/profile'

export type Confidence = `${ConfidenceLevel}`
export type RiskLevelValue = `${RiskLevel}`
export type MoneyCategory = 'asset' | 'debt' | 'income' | 'expense'

export type MoneyItem = {
  key: string
  icon: string
  name: string
  amount: number
  ratio?: number
  confidence?: number
  duration?: string
  note?: string
}

export type JudgmentChange = {
  id?: string
  label: string
  before?: string
  after: string
  source: '人工修改' | '线索确认' | '系统计算' | 'AI解析'
  createdAt?: number
}

export type ForecastScenario = {
  name: '保守' | '基准' | '乐观'
  fiveYearNetAsset: number
  tenYearNetAsset: number
  assumptions: string[]
}

export type Snapshot = {
  id: string
  personId: string
  title: string
  total: number
  debt: number
  income: number
  expense: number
  confidence: number
  createdAt: number
}

export type Person = {
  id: string
  name: string
  ageRange: string
  city: string
  job: string
  maritalStatus?: string
  children?: string
  family?: string
  confidence?: number
  future5?: number
  future10?: number
  forecastScenarios?: ForecastScenario[]
  asset: { total: number; debt: number; income: number; expense: number }
  structure: { houseRatio: number; carRatio: number; investRatio: number; cashRatio: number }
  assetItems?: MoneyItem[]
  debtItems?: MoneyItem[]
  incomeItems?: MoneyItem[]
  expenseItems?: MoneyItem[]
  recentChanges?: JudgmentChange[]
  tags: string[]
  summary?: string
  riskLevel?: RiskLevelValue
  updatedAt: number
}

export type ClueImpact = {
  target: 'asset' | 'debt' | 'income' | 'expense' | 'forecast' | 'confidence'
  label: string
  deltaText: string
}

export type ParsedClue = {
  type: string
  item: string
  amount?: number
  amountText: string
  confidence: Confidence
  occurredAt?: string
  explanation: string
  impacts: ClueImpact[]
}

export type Clue = {
  id: string
  personId: string
  content: string
  type: string
  confidence: Confidence
  createdAt: number
  parsed?: ParsedClue[]
  confirmed?: boolean
  hidden?: boolean
}

export type TimelineItem = { id: string; personId: string; title: string; createdAt: number }

export type AiAnalysis = {
  assetRange: string
  debtRange: string
  income: string
  expense: string
  structureTag: string
  riskLevel: RiskLevelValue
  summary: string
  parsedClue?: Record<string, string>
  parsedClues?: ParsedClue[]
}
