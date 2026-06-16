import type { ParsedClue } from './types'

export async function parseClueWithAi(content: string): Promise<ParsedClue[]> {
  if (/副业|私活|6000|六千/.test(content)) {
    return [{ type: '收入', item: '副业收入', amount: 0.6, amountText: '约6000/月', confidence: 'medium', explanation: '自然语言中出现副业和月收入金额，建议按持续性收入线索确认。', impacts: [{ target: 'income', label: '月收入估算', deltaText: '+6000' }, { target: 'forecast', label: '5年预测', deltaText: '上调' }] }]
  }
  return [{ type: '其他', item: '观察线索', amountText: '待确认', confidence: 'medium', explanation: '已记录为观察线索，需要用户补充金额或影响方向。', impacts: [{ target: 'confidence', label: '综合可信度', deltaText: '+1%' }] }]
}
