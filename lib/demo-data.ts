import type {Clue, MoneyItem, Profile, Snapshot} from './types'

export const demoUserId = 'demo-user'

export const demoProfiles: Profile[] = [
  {
    id: 'p_demo',
    userId: demoUserId,
    name: '张先生',
    ageRange: '38岁',
    city: '上海',
    job: '互联网从业者',
    maritalStatus: '已婚',
    children: '已婚有子（2岁）',
    totalAsset: 2850000,
    totalDebt: 1450000,
    monthlyIncome: 32000,
    monthlyExpense: 21000,
    confidence: 86,
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-16T00:00:00.000Z'
  },
  {
    id: 'p_demo_2',
    userId: demoUserId,
    name: '李女士',
    ageRange: '29岁',
    city: '北京',
    job: '教师',
    maritalStatus: '未婚',
    children: '未婚',
    totalAsset: 1680000,
    totalDebt: 420000,
    monthlyIncome: 18000,
    monthlyExpense: 11500,
    confidence: 78,
    createdAt: '2026-05-18T00:00:00.000Z',
    updatedAt: '2026-06-14T00:00:00.000Z'
  },
  {
    id: 'p_demo_3',
    userId: demoUserId,
    name: '王先生',
    ageRange: '45岁',
    city: '深圳',
    job: '企业主',
    maritalStatus: '已婚',
    children: '已婚有女（8岁）',
    totalAsset: 4120000,
    totalDebt: 2100000,
    monthlyIncome: 56000,
    monthlyExpense: 38000,
    confidence: 68,
    createdAt: '2026-04-20T00:00:00.000Z',
    updatedAt: '2026-06-12T00:00:00.000Z'
  }
]

export const demoProfile = demoProfiles[0]

export const demoMoneyItems: MoneyItem[] = [
  {id: 'm1', profileId: 'p_demo', category: 'asset', name: '房产', amount: 1653000, ratio: 58, confidence: 78},
  {id: 'm2', profileId: 'p_demo', category: 'asset', name: '投资', amount: 684000, ratio: 24, confidence: 64},
  {id: 'm3', profileId: 'p_demo', category: 'asset', name: '现金及活期', amount: 228000, ratio: 8, confidence: 82},
  {id: 'm4', profileId: 'p_demo', category: 'asset', name: '车辆', amount: 285000, ratio: 10, confidence: 70},
  {id: 'm5', profileId: 'p_demo', category: 'debt', name: '房贷', amount: 1200000, ratio: 83, confidence: 76},
  {id: 'm6', profileId: 'p_demo', category: 'debt', name: '消费贷', amount: 180000, ratio: 12, confidence: 62},
  {id: 'm7', profileId: 'p_demo', category: 'debt', name: '信用卡', amount: 70000, ratio: 5, confidence: 58},
  {id: 'm8', profileId: 'p_demo', category: 'income', name: '工资薪资', amount: 25000, ratio: 78, confidence: 72},
  {id: 'm9', profileId: 'p_demo', category: 'income', name: '奖金/补贴', amount: 7000, ratio: 22, confidence: 65},
  {id: 'm10', profileId: 'p_demo', category: 'expense', name: '居住', amount: 6000, ratio: 29, confidence: 66},
  {id: 'm11', profileId: 'p_demo', category: 'expense', name: '餐饮', amount: 3500, ratio: 17, confidence: 64},
  {id: 'm19', profileId: 'p_demo', category: 'expense', name: '交通', amount: 2500, ratio: 12, confidence: 62},
  {id: 'm20', profileId: 'p_demo', category: 'expense', name: '教育', amount: 2000, ratio: 10, confidence: 60},
  {id: 'm21', profileId: 'p_demo', category: 'expense', name: '其他', amount: 7000, ratio: 32, confidence: 58},
  {id: 'm12', profileId: 'p_demo_2', category: 'asset', name: '房产', amount: 980000, ratio: 58, confidence: 72},
  {id: 'm13', profileId: 'p_demo_2', category: 'asset', name: '投资', amount: 380000, ratio: 23, confidence: 68},
  {id: 'm14', profileId: 'p_demo_2', category: 'asset', name: '现金', amount: 120000, ratio: 7, confidence: 70},
  {id: 'm15', profileId: 'p_demo_2', category: 'asset', name: '保险', amount: 200000, ratio: 12, confidence: 62},
  {id: 'm16', profileId: 'p_demo_2', category: 'debt', name: '房贷', amount: 420000, ratio: 100, confidence: 76},
  {id: 'm17', profileId: 'p_demo_2', category: 'income', name: '工资薪资', amount: 18000, ratio: 100, confidence: 74},
  {id: 'm18', profileId: 'p_demo_2', category: 'expense', name: '家庭支出', amount: 11500, ratio: 100, confidence: 66},
  {id: 'm22', profileId: 'p_demo_3', category: 'asset', name: '公司股权', amount: 1900000, ratio: 46, confidence: 58},
  {id: 'm23', profileId: 'p_demo_3', category: 'asset', name: '房产', amount: 1400000, ratio: 34, confidence: 70},
  {id: 'm24', profileId: 'p_demo_3', category: 'asset', name: '车辆', amount: 360000, ratio: 9, confidence: 64},
  {id: 'm25', profileId: 'p_demo_3', category: 'asset', name: '现金', amount: 460000, ratio: 11, confidence: 62},
  {id: 'm26', profileId: 'p_demo_3', category: 'debt', name: '经营贷', amount: 1500000, ratio: 71, confidence: 54},
  {id: 'm27', profileId: 'p_demo_3', category: 'debt', name: '房贷', amount: 600000, ratio: 29, confidence: 66},
  {id: 'm28', profileId: 'p_demo_3', category: 'income', name: '经营收入', amount: 56000, ratio: 100, confidence: 58},
  {id: 'm29', profileId: 'p_demo_3', category: 'expense', name: '家庭及经营支出', amount: 38000, ratio: 100, confidence: 55}
]

export const demoClues: Clue[] = [
  {
    id: 'c1',
    userId: demoUserId,
    profileId: 'p_demo',
    content: '刚收到年终奖8万元，打算拿出4万元投资指数基金，另外信用卡还了7000元。',
    type: 'income',
    confidence: 'high',
    confirmed: true,
    hidden: false,
    parsedResult: [
      {
        type: 'income',
        item: '年终奖收入',
        amount: 80000,
        amountText: '80,000元',
        confidence: 'high',
        explanation: '识别依据：年终奖8万元',
        impacts: [{target: 'income', label: '收入', deltaText: '+80,000元'}]
      },
      {
        type: 'asset',
        item: '投资指数基金',
        amount: 40000,
        amountText: '40,000元',
        confidence: 'medium',
        explanation: '识别依据：拿出4万元投资指数基金',
        impacts: [{target: 'asset', label: '资产', deltaText: '+40,000元'}]
      },
      {
        type: 'debt',
        item: '信用卡还款',
        amount: 7000,
        amountText: '7,000元',
        confidence: 'medium',
        explanation: '识别依据：信用卡还了7000元',
        impacts: [{target: 'debt', label: '负债', deltaText: '-7,000元'}]
      }
    ],
    createdAt: '2026-06-16T00:00:00.000Z',
    updatedAt: '2026-06-16T00:00:00.000Z'
  }
]

export const demoSnapshots: Snapshot[] = [
  {
    id: 's1',
    userId: demoUserId,
    profileId: 'p_demo',
    totalAsset: 2100000,
    totalDebt: 1360000,
    monthlyIncome: 28000,
    monthlyExpense: 19000,
    confidence: 72,
    createdAt: '2025-06-16T00:00:00.000Z'
  },
  {
    id: 's2',
    userId: demoUserId,
    profileId: 'p_demo',
    totalAsset: 2360000,
    totalDebt: 1400000,
    monthlyIncome: 30000,
    monthlyExpense: 20500,
    confidence: 78,
    createdAt: '2025-12-16T00:00:00.000Z'
  },
  {
    id: 's3',
    userId: demoUserId,
    profileId: 'p_demo',
    totalAsset: 2600000,
    totalDebt: 1420000,
    monthlyIncome: 31000,
    monthlyExpense: 20800,
    confidence: 82,
    createdAt: '2026-03-16T00:00:00.000Z'
  },
  {
    id: 's4',
    userId: demoUserId,
    profileId: 'p_demo',
    totalAsset: 2850000,
    totalDebt: 1450000,
    monthlyIncome: 32000,
    monthlyExpense: 21000,
    confidence: 86,
    createdAt: '2026-06-16T00:00:00.000Z'
  },
  {
    id: 's5',
    userId: demoUserId,
    profileId: 'p_demo_2',
    totalAsset: 1280000,
    totalDebt: 460000,
    monthlyIncome: 16000,
    monthlyExpense: 10000,
    confidence: 68,
    createdAt: '2025-06-16T00:00:00.000Z'
  },
  {
    id: 's6',
    userId: demoUserId,
    profileId: 'p_demo_2',
    totalAsset: 1680000,
    totalDebt: 420000,
    monthlyIncome: 18000,
    monthlyExpense: 11500,
    confidence: 78,
    createdAt: '2026-06-16T00:00:00.000Z'
  },
  {
    id: 's7',
    userId: demoUserId,
    profileId: 'p_demo_3',
    totalAsset: 3500000,
    totalDebt: 1980000,
    monthlyIncome: 48000,
    monthlyExpense: 34000,
    confidence: 62,
    createdAt: '2025-06-16T00:00:00.000Z'
  },
  {
    id: 's8',
    userId: demoUserId,
    profileId: 'p_demo_3',
    totalAsset: 4120000,
    totalDebt: 2100000,
    monthlyIncome: 56000,
    monthlyExpense: 38000,
    confidence: 68,
    createdAt: '2026-06-16T00:00:00.000Z'
  }
]
