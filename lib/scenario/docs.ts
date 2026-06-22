import type {ScenarioModule} from '@/lib/scenario/types'

export const moduleDocs: Record<ScenarioModule, {title: string; path: string; data: string; input: string; output: string; notes: string[]}> = {
  buy_rent: {title: '买房 vs 租房', path: '/scenario-finance/modules/buy_rent', data: 'BuyRentAIData', input: 'BuyRentInput', output: 'BuyRentOutput', notes: ['AI = 生成 scenario.data', 'Mock = fallback', '前端 = 唯一计算源']},
  investment: {title: '投资模块', path: '/scenario-finance/modules/investment', data: 'InvestmentAIData', input: 'InvestmentInput', output: 'InvestmentOutput', notes: ['资产权重合计为 1', 'market_regime 用于 AI 语境', '输出只依赖 scenario.data']},
  living_cost: {title: '生活成本', path: '/scenario-finance/modules/living_cost', data: 'LivingCostAIData', input: 'LivingCostInput', output: 'LivingCostOutput', notes: ['城市模型影响 mock', 'lifestyle 只调整展示计算', 'DB 存最终 scenario']},
  retirement: {title: '退休模块', path: '/scenario-finance/modules/retirement', data: 'RetirementAIData', input: 'RetirementInput', output: 'RetirementOutput', notes: ['通胀和回报来自 AI 数据', '曲线按退休后年度生成', 'UI 只负责展示']},
  personal: {title: '个人资产', path: '/scenario-finance/modules/personal', data: 'PersonalInput', input: 'PersonalInput', output: 'PersonalOutput', notes: ['无 AI 必需字段', '输入即可计算', '资产配置统一 Record 输出']}
}

export const moduleOrder = Object.keys(moduleDocs) as ScenarioModule[]
