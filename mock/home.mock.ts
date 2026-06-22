export const homeData = {
  totalAsset: 1500000,
  moduleCards: [
    {key: 'buy_rent', title: '生活决策', subtitle: '比较买房租房、居住城市等生活选择', status: '租房更优'},
    {key: 'investment', title: '投资协助', subtitle: '生成科学资产配置方案，优化投资组合', status: '平衡型'},
    {key: 'living_cost', title: '城市成本', subtitle: '对比城市生活成本，选择最优生活地', status: '广州最低'},
    {key: 'retirement', title: '退休计划', subtitle: '规划退休目标与现金流，实现安心晚年', status: '60岁更稳'}
  ],
  recentScenarios: [
    {id: 'br-001', title: '深圳 30 年买房租房对比', module: 'buy_rent', createdAt: '2024-05-15'},
    {id: 'iv-001', title: '10 年平衡型投资组合', module: 'investment', createdAt: '2024-05-14'},
    {id: 'rt-001', title: '60 岁退休现金流推演', module: 'retirement', createdAt: '2024-05-13'}
  ]
} as const
