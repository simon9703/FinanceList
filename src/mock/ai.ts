import { ConfidenceLevel, RiskLevel, StructureTag } from '@/config/profile'
import type { AiAnalysis } from '@/types/profile'

export const mockAiAnalysisBase = {
  luxuryCarAssetRange: '260-360万',
  defaultAssetRange: '240-330万',
  highPressureDebtRange: '120-180万',
  defaultDebtRange: '80-140万',
  intlSchoolIncome: '3-4.5万',
  defaultIncome: '2.5-4万',
  intlSchoolExpense: '2-3.2万',
  defaultExpense: '1.6-2.8万',
  intlSchoolSummary: '收入能力较强，但教育与房贷支出使现金流承压。',
  defaultSummary: '资产以房产为核心，整体稳定但流动性仍需关注。',
}

export const mockParsedClue = {
  luxuryCar: '豪华车信号',
  intlEducation: '国际/私立教育',
  notRecognized: '未识别',
  incomeUp: '上升',
  incomeStable: '平稳',
  confidence: ConfidenceLevel.Medium,
}

export const mockAiFallbackResponse: AiAnalysis = {
  assetRange: mockAiAnalysisBase.defaultAssetRange,
  debtRange: mockAiAnalysisBase.defaultDebtRange,
  income: mockAiAnalysisBase.defaultIncome,
  expense: mockAiAnalysisBase.defaultExpense,
  structureTag: StructureTag.StableAccumulator,
  riskLevel: RiskLevel.Low,
  summary: mockAiAnalysisBase.defaultSummary,
  parsedClue: {
    car: mockParsedClue.notRecognized,
    education: mockParsedClue.notRecognized,
    income_signal: mockParsedClue.incomeStable,
    confidence: mockParsedClue.confidence,
  },
}
