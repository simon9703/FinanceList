export enum RiskLevel {
  Low = '低',
  Medium = '中',
  High = '高',
}

export enum ConfidenceLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum ClueType {
  LifeSignal = 'life_signal',
}

export enum TimelineTitle {
  Created = '创建档案',
  ClueAdded = '新增线索',
  AiUpdated = 'AI更新结构',
}

export enum StructureTag {
  MortgageMiddleClass = '房贷中产型',
  StableAccumulator = '稳健积累型',
  Pending = '待分析',
}

export enum ProfileIcon {
  Person = '👤',
  House = '🏠',
  Car = '🚗',
  Portfolio = '💼',
  Debt = '💳',
  Invest = '📈',
  Cash = '💰',
  Warning = '⚠️',
}

export const PROFILE_ICON_GROUP = [
  ProfileIcon.House,
  ProfileIcon.Car,
  ProfileIcon.Portfolio,
  ProfileIcon.Debt,
].join('')

export const ASSET_STRUCTURE_ICONS = {
  houseRatio: ProfileIcon.House,
  carRatio: ProfileIcon.Car,
  investRatio: ProfileIcon.Invest,
  cashRatio: ProfileIcon.Cash,
} as const

export const ASSET_STRUCTURE_META = [
  { key: 'houseRatio', label: '房产资产', icon: ProfileIcon.House, colorClass: 'green' },
  { key: 'carRatio', label: '车辆资产', icon: ProfileIcon.Car, colorClass: 'blue' },
  { key: 'investRatio', label: '投资资产', icon: ProfileIcon.Invest, colorClass: 'lime' },
  { key: 'cashRatio', label: '现金余额', icon: ProfileIcon.Cash, colorClass: 'gray' },
] as const

export const BOTTOM_TABS = [
  { key: 'home', label: '档案', icon: ProfileIcon.Person, url: '/pages/index/index' },
  { key: 'create', label: '创建', icon: '+', url: '/pages/create/index' },
  { key: 'insight', label: '线索', icon: ProfileIcon.Invest, url: '/pages/clue/index' },
] as const
