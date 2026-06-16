import type {ParsedClue} from './types'

export async function parseClueWithAi(content: string): Promise<ParsedClue[]> {
  const amountMatch = content.match(/(\d+(?:\.\d+)?)/)
  const amount = amountMatch ? Number(amountMatch[1]) : undefined

  return [
    {
      type: content.includes('支出') || content.includes('花') ? 'expense' : 'income',
      item: content.includes('副业') ? '副业收入' : '待确认线索',
      amount,
      amountText: amount ? `${amount}` : '待确认',
      confidence: amount ? 'medium' : 'low',
      explanation: '第一版使用规则解析，后续可接入模型服务。',
      impacts: amount ? [{target: 'monthlyIncome', label: '月收入', deltaText: `+${amount}`}] : []
    }
  ]
}
