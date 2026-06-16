import { RiskLevel, StructureTag } from '@/config/profile'
import { mockAiAnalysisBase, mockParsedClue } from '@/mock/ai'
import type { AiAnalysis, Clue, Person } from '@/types/profile'

export const buildAnalysisPrompt = (person: Person, clues: Clue[]) => `
你是人生财富结构分析助手。只做线索解析、结构总结、风险分析，不做精确资产计算。
基础信息：${JSON.stringify(person)}
线索列表：${JSON.stringify(clues.map(({ content, createdAt }) => ({ content, createdAt })))}
请输出 JSON：assetRange/debtRange/income/expense/structureTag/riskLevel/summary/parsedClue。
`

export async function analyzeProfile(person: Person, clues: Clue[]): Promise<AiAnalysis> {
  const clueText = clues.map((clue) => clue.content).join('，')
  const hasLuxuryCar = /宝马|奔驰|保时捷|奥迪|特斯拉|豪车/.test(clueText)
  const hasIntlSchool = /国际学校|私立|双语/.test(clueText)
  const pressure = person.asset.debt / Math.max(person.asset.total, 1)

  return {
    assetRange: hasLuxuryCar ? mockAiAnalysisBase.luxuryCarAssetRange : mockAiAnalysisBase.defaultAssetRange,
    debtRange: pressure > 0.45 ? mockAiAnalysisBase.highPressureDebtRange : mockAiAnalysisBase.defaultDebtRange,
    income: hasIntlSchool ? mockAiAnalysisBase.intlSchoolIncome : mockAiAnalysisBase.defaultIncome,
    expense: hasIntlSchool ? mockAiAnalysisBase.intlSchoolExpense : mockAiAnalysisBase.defaultExpense,
    structureTag: pressure > 0.45 ? StructureTag.MortgageMiddleClass : StructureTag.StableAccumulator,
    riskLevel: pressure > 0.6 || hasIntlSchool ? RiskLevel.Medium : RiskLevel.Low,
    summary: hasIntlSchool ? mockAiAnalysisBase.intlSchoolSummary : mockAiAnalysisBase.defaultSummary,
    parsedClue: {
      car: hasLuxuryCar ? mockParsedClue.luxuryCar : mockParsedClue.notRecognized,
      education: hasIntlSchool ? mockParsedClue.intlEducation : mockParsedClue.notRecognized,
      income_signal: hasLuxuryCar || hasIntlSchool ? mockParsedClue.incomeUp : mockParsedClue.incomeStable,
      confidence: mockParsedClue.confidence,
    },
  }
}
