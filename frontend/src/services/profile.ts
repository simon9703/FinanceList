import { ClueType, ConfidenceLevel, RiskLevel, StructureTag, TimelineTitle } from '@/config/profile'
import type { Clue, ForecastScenario, JudgmentChange, MoneyItem, ParsedClue, Person, Snapshot, TimelineItem } from '@/types/profile'

const now = Date.now()

export type ProfileFormValues = {
  id?: string
  name: string
  ageRange: string
  city: string
  job: string
  maritalStatus: string
  children: string
  totalAsset: number
  debt: number
  income: number
  expense: number
  assetTags: string[]
  debtTags: string[]
  incomeTags: string[]
  expenseTags: string[]
  mode: 'simple' | 'pro'
}

const ratio = (amount: number, total: number) => Math.round((amount / Math.max(total, 1)) * 100)

export function buildFamily(maritalStatus = '未填写', children = '孩子情况待补充') {
  return `${maritalStatus} · ${children}`
}

export function buildForecast(person: Pick<Person, 'asset'>): ForecastScenario[] {
  const net = person.asset.total - person.asset.debt
  const monthlySurplus = Math.max(person.asset.income - person.asset.expense, 0)
  const yearlySurplus = monthlySurplus * 12
  return [
    { name: '保守', fiveYearNetAsset: Math.round(net + yearlySurplus * 5 * 0.7), tenYearNetAsset: Math.round(net + yearlySurplus * 10 * 0.65), assumptions: ['收入按当前能力保守折减', '支出压力不下降', '资产低增长'] },
    { name: '基准', fiveYearNetAsset: Math.round(net + yearlySurplus * 5), tenYearNetAsset: Math.round(net + yearlySurplus * 10), assumptions: ['收入能力维持', '支出压力稳定', '负债按计划下降'] },
    { name: '乐观', fiveYearNetAsset: Math.round(net + yearlySurplus * 5 * 1.25), tenYearNetAsset: Math.round(net + yearlySurplus * 10 * 1.35), assumptions: ['收入小幅增长', '投资资产温和增值', '家庭责任可控'] },
  ]
}

export function buildMoneyItems(form: ProfileFormValues) {
  const assetItems: MoneyItem[] = [
    { key: 'house', icon: '🏠', name: '房产', amount: Math.round(form.totalAsset * 0.72), ratio: 72, confidence: 76, duration: '长期', note: form.assetTags.includes('房产') ? '用户标记已知资产' : '' },
    { key: 'invest', icon: '📈', name: '股票基金', amount: Math.round(form.totalAsset * 0.15), ratio: 15, confidence: 62, duration: '持续', note: form.assetTags.includes('股票基金') ? '包含股票基金' : '' },
    { key: 'car', icon: '🚗', name: '车辆', amount: Math.round(form.totalAsset * 0.08), ratio: 8, confidence: 68, duration: '折旧', note: form.assetTags.includes('车辆') ? '车辆资产估算' : '' },
    { key: 'cash', icon: '💰', name: '现金存款', amount: Math.max(form.totalAsset - Math.round(form.totalAsset * 0.95), 0), ratio: 5, confidence: 55, duration: '流动', note: form.assetTags.includes('现金') ? '现金/活期储蓄' : '' },
  ]
  const debtItems: MoneyItem[] = [
    { key: 'mortgage', icon: '🏠', name: '房贷', amount: Math.round(form.debt * 0.83), ratio: 83, confidence: 74, duration: '长期', note: form.debtTags.includes('房贷') ? '主要负债' : '' },
    { key: 'consumer', icon: '💳', name: '消费贷', amount: Math.round(form.debt * 0.12), ratio: 12, confidence: 54, duration: '中短期', note: '' },
    { key: 'credit', icon: '💳', name: '信用卡', amount: Math.max(form.debt - Math.round(form.debt * 0.95), 0), ratio: 5, confidence: 48, duration: '短期', note: '' },
  ]
  const incomeItems: MoneyItem[] = [
    { key: 'salary', icon: '💼', name: '工资', amount: Number((form.income * 0.65).toFixed(2)), confidence: 72, duration: '月均', note: '' },
    { key: 'business', icon: '🏪', name: '生意收入', amount: Number((form.income * 0.16).toFixed(2)), confidence: 58, duration: '月均', note: '' },
    { key: 'side', icon: '🧩', name: '副业收入', amount: Number((form.income * 0.12).toFixed(2)), confidence: 55, duration: '月均', note: '' },
    { key: 'yield', icon: '📈', name: '投资收益', amount: Number((form.income * 0.07).toFixed(2)), confidence: 48, duration: '月均', note: '' },
  ]
  const expenseItems: MoneyItem[] = [
    { key: 'mortgage', icon: '🏠', name: '房贷', amount: Number((form.expense * 0.29).toFixed(2)), confidence: 76, duration: '月均', note: '' },
    { key: 'life', icon: '🍜', name: '日常生活', amount: Number((form.expense * 0.22).toFixed(2)), confidence: 65, duration: '月均', note: '' },
    { key: 'edu', icon: '👦', name: '教育', amount: Number((form.expense * 0.12).toFixed(2)), confidence: 58, duration: '月均', note: '' },
    { key: 'travel', icon: '✈️', name: '旅游月均', amount: Number((form.expense * 0.08).toFixed(2)), confidence: 44, duration: '月均', note: '' },
    { key: 'support', icon: '👴', name: '赡养', amount: Number((form.expense * 0.05).toFixed(2)), confidence: 42, duration: '月均', note: '' },
  ]
  return { assetItems, debtItems, incomeItems, expenseItems }
}

export function buildPersonFromForm(form: ProfileFormValues, previous?: Person): Person {
  const items = buildMoneyItems(form)
  const base: Person = {
    id: previous?.id || form.id || `p_${Date.now()}`,
    name: form.name || '未命名人物',
    ageRange: form.ageRange,
    city: form.city,
    job: form.job,
    maritalStatus: form.maritalStatus,
    children: form.children,
    family: buildFamily(form.maritalStatus, form.children),
    confidence: previous ? Math.min((previous.confidence || 60) + 2, 95) : 62,
    asset: { total: form.totalAsset, debt: form.debt, income: form.income, expense: form.expense },
    structure: { houseRatio: ratio(items.assetItems[0].amount, form.totalAsset), investRatio: ratio(items.assetItems[1].amount, form.totalAsset), carRatio: ratio(items.assetItems[2].amount, form.totalAsset), cashRatio: ratio(items.assetItems[3].amount, form.totalAsset) },
    ...items,
    recentChanges: previous ? [{ id: `j_${Date.now()}`, label: '当前判断', before: '已更新', after: '人工修正', source: '人工修改', createdAt: Date.now() }, ...(previous.recentChanges || [])] : [{ id: `j_${Date.now()}`, label: '初始判断', after: '创建第一份估算快照', source: '人工修改', createdAt: Date.now() }],
    tags: previous?.tags || [StructureTag.Pending],
    summary: previous?.summary || '已建立初始财富画像，等待持续线索补充。',
    riskLevel: previous?.riskLevel || RiskLevel.Medium,
    updatedAt: Date.now(),
  }
  const forecast = buildForecast(base)
  return { ...base, forecastScenarios: forecast, future5: forecast[1].fiveYearNetAsset, future10: forecast[1].tenYearNetAsset }
}

export function createSnapshot(person: Person): Snapshot {
  return { id: `s_${Date.now()}`, personId: person.id, title: '当前估算快照', total: person.asset.total, debt: person.asset.debt, income: person.asset.income, expense: person.asset.expense, confidence: person.confidence || 60, createdAt: Date.now() }
}

export function parseClueMock(content: string): ParsedClue[] {
  if (/副业|私活|六千|6000/.test(content)) {
    return [{ type: '收入', item: '副业收入', amount: 0.6, amountText: '约6000/月', confidence: ConfidenceLevel.Medium, explanation: '识别到持续性副业收入线索，需用户确认持续性。', impacts: [{ target: 'income', label: '月收入估算', deltaText: '+6000' }, { target: 'forecast', label: '5年预测', deltaText: '上调' }] }]
  }
  return [
    { type: '收入', item: '年终奖金', amount: 8, amountText: '80,000元', confidence: ConfidenceLevel.Medium, occurredAt: '2024年12月', explanation: '一次性收入，不直接改变长期月收入能力。', impacts: [{ target: 'confidence', label: '现金判断可信度', deltaText: '+2%' }] },
    { type: '资产', item: '投资计划', amount: 4, amountText: '40,000元', confidence: ConfidenceLevel.Medium, occurredAt: '2024年12月', explanation: '可能增加投资资产配置。', impacts: [{ target: 'asset', label: '投资资产', deltaText: '+4万' }] },
  ]
}

export const demoChanges: JudgmentChange[] = [
  { label: '工资估算', before: '4.5万/月', after: '4.9万/月', source: '线索确认' },
  { label: '新增副业', after: '≈6000/月', source: 'AI解析' },
  { label: '房贷余额估算', before: '168万', after: '145万', source: '系统计算' },
]

export const demoPerson: Person = buildPersonFromForm({ id: 'p_demo', name: '张先生', ageRange: '31-35', city: '一线', job: '互联网', maritalStatus: '已婚', children: '1孩 · 小学', totalAsset: 430, debt: 145, income: 4.9, expense: 3.35, assetTags: ['房产', '车辆', '股票基金', '现金'], debtTags: ['房贷', '消费贷'], incomeTags: ['工资', '副业', '生意'], expenseTags: ['房贷', '生活', '教育'], mode: 'simple' })
demoPerson.recentChanges = demoChanges
demoPerson.tags = [StructureTag.MortgageMiddleClass, `风险：${RiskLevel.Medium}`, '流动性偏低']
demoPerson.summary = '资产以房产为核心，收入能力较强，房贷与教育支出形成中等现金流压力。'
demoPerson.confidence = 72

export const demoClues: Clue[] = [
  { id: 'c1', personId: 'p_demo', content: '听说最近开始做副业，每月约6000', type: ClueType.LifeSignal, confidence: ConfidenceLevel.Medium, createdAt: new Date('2026-06-20').getTime(), parsed: parseClueMock('副业6000'), confirmed: true },
  { id: 'c2', personId: 'p_demo', content: '换成宝马5系', type: ClueType.LifeSignal, confidence: ConfidenceLevel.High, createdAt: new Date('2026-06-18').getTime(), confirmed: true },
  { id: 'c3', personId: 'p_demo', content: '孩子开始上私立学校', type: ClueType.LifeSignal, confidence: ConfidenceLevel.Medium, createdAt: new Date('2026-06-12').getTime(), confirmed: true },
]

export const demoSnapshots: Snapshot[] = [createSnapshot(demoPerson)]

export const profileService = {
  async listProfiles(): Promise<Person[]> { return [demoPerson] },
  async listClues(personId: string): Promise<Clue[]> { return demoClues.filter((item) => item.personId === personId) },
  async listTimeline(personId: string): Promise<TimelineItem[]> { return [{ id: 't_demo', personId, title: TimelineTitle.Created, createdAt: now }] },
  async parseClue(content: string): Promise<ParsedClue[]> { return parseClueMock(content) },
}
