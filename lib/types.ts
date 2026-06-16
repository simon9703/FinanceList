export type TenantRecord = {userId: string}
export type MoneyCategory = 'asset' | 'debt' | 'income' | 'expense'

export type MoneyItem = {
  id: string
  profileId: string
  category: MoneyCategory
  name: string
  amount: number
  confidence: number
  duration?: string
  note?: string
  ratio?: number
}

export type Profile = TenantRecord & {
  id: string
  name: string
  ageRange?: string
  city?: string
  job?: string
  maritalStatus?: string
  children?: string
  totalAsset: number
  totalDebt: number
  monthlyIncome: number
  monthlyExpense: number
  confidence: number
  createdAt: string
  updatedAt: string
}

export type Clue = TenantRecord & {
  id: string
  profileId: string
  content: string
  type: string
  confidence: 'low' | 'medium' | 'high'
  confirmed: boolean
  hidden: boolean
  parsedResult?: ParsedClue[]
  createdAt: string
  updatedAt: string
}

export type ParsedClue = {
  type: string
  item: string
  amount?: number
  amountText: string
  confidence: 'low' | 'medium' | 'high'
  explanation: string
  impacts: {target: string; label: string; deltaText: string}[]
}

export type Snapshot = TenantRecord & {
  id: string
  profileId: string
  totalAsset: number
  totalDebt: number
  monthlyIncome: number
  monthlyExpense: number
  confidence: number
  createdAt: string
}

export type ProfileDetail = {
  profile: Profile
  moneyItems: MoneyItem[]
  clues: Clue[]
  snapshots: Snapshot[]
}
