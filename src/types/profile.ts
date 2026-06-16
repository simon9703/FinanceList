import type { ConfidenceLevel, RiskLevel } from '@/config/profile'

export type Confidence = `${ConfidenceLevel}`
export type RiskLevelValue = `${RiskLevel}`

export type Person = {
  id: string
  name: string
  ageRange: string
  city: string
  job: string
  asset: { total: number; debt: number; income: number; expense: number }
  structure: { houseRatio: number; carRatio: number; investRatio: number; cashRatio: number }
  tags: string[]
  summary?: string
  riskLevel?: RiskLevelValue
  updatedAt: number
}

export type Clue = { id: string; personId: string; content: string; type: string; confidence: Confidence; createdAt: number }

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
}
