import {nanoid} from './simple-id'
import {demoClues, demoMoneyItems, demoProfiles, demoSnapshots, demoUserId} from './demo-data'
import {createSupabaseServerClient, hasSupabaseEnv} from './supabase/server'
import {parseClueWithAi} from './ai'
import type {Clue, MoneyItem, Profile, ProfileDetail, Snapshot} from './types'

type DbProfile = {
  id: string
  user_id: string
  name: string
  age_range: string | null
  city: string | null
  job: string | null
  marital_status: string | null
  children: string | null
  total_asset: string | number
  total_debt: string | number
  monthly_income: string | number
  monthly_expense: string | number
  confidence: number
  created_at: string
  updated_at: string
}

function toNumber(value: string | number | null | undefined) {
  return Number(value ?? 0)
}

function toProfile(row: DbProfile): Profile {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    ageRange: row.age_range ?? undefined,
    city: row.city ?? undefined,
    job: row.job ?? undefined,
    maritalStatus: row.marital_status ?? undefined,
    children: row.children ?? undefined,
    totalAsset: toNumber(row.total_asset),
    totalDebt: toNumber(row.total_debt),
    monthlyIncome: toNumber(row.monthly_income),
    monthlyExpense: toNumber(row.monthly_expense),
    confidence: row.confidence,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

function toMoneyItem(row: Record<string, unknown>): MoneyItem {
  return {
    id: String(row.id),
    profileId: String(row.profile_id),
    category: row.category as MoneyItem['category'],
    name: String(row.name),
    amount: toNumber(row.amount as string | number),
    ratio: row.ratio == null ? undefined : toNumber(row.ratio as string | number),
    confidence: Number(row.confidence ?? 60),
    duration: row.duration == null ? undefined : String(row.duration),
    note: row.note == null ? undefined : String(row.note)
  }
}

function toClue(row: Record<string, unknown>): Clue {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    profileId: String(row.profile_id),
    content: String(row.content),
    type: String(row.type),
    confidence: (row.confidence as Clue['confidence']) ?? 'medium',
    confirmed: Boolean(row.confirmed),
    hidden: Boolean(row.hidden),
    parsedResult: (row.parsed_result as Clue['parsedResult']) ?? undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  }
}

function toSnapshot(row: Record<string, unknown>): Snapshot {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    profileId: String(row.profile_id),
    totalAsset: toNumber(row.total_asset as string | number),
    totalDebt: toNumber(row.total_debt as string | number),
    monthlyIncome: toNumber(row.monthly_income as string | number),
    monthlyExpense: toNumber(row.monthly_expense as string | number),
    confidence: Number(row.confidence ?? 60),
    createdAt: String(row.created_at)
  }
}

async function getCurrentUserId() {
  if (!hasSupabaseEnv()) return demoUserId

  const supabase = createSupabaseServerClient()
  const {data} = await supabase.auth.getUser()
  return data.user?.id ?? null
}

export async function listProfiles(): Promise<Profile[]> {
  const userId = await getCurrentUserId()
  if (!hasSupabaseEnv()) return demoProfiles.filter((item) => item.userId === userId)
  if (!userId) return []

  const supabase = createSupabaseServerClient()
  const {data, error} = await supabase
    .from('wealth_profile')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', {ascending: false})

  if (error) throw error
  return (data ?? []).map((row) => toProfile(row as DbProfile))
}

export async function getProfileDetail(id: string): Promise<ProfileDetail | null> {
  const userId = await getCurrentUserId()
  if (!hasSupabaseEnv()) {
    const profile = demoProfiles.find((item) => item.id === id && item.userId === userId) ?? null
    if (!profile) return null
    return {
      profile,
      moneyItems: demoMoneyItems.filter((item) => item.profileId === id),
      clues: demoClues.filter((item) => item.profileId === id && item.userId === userId),
      snapshots: demoSnapshots.filter((item) => item.profileId === id && item.userId === userId)
    }
  }
  if (!userId) return null

  const supabase = createSupabaseServerClient()
  const {data: profileRow, error: profileError} = await supabase
    .from('wealth_profile')
    .select('*')
    .eq('user_id', userId)
    .eq('id', id)
    .single()

  if (profileError || !profileRow) return null

  const [{data: moneyRows, error: moneyError}, {data: clueRows, error: clueError}, {data: snapshotRows, error: snapshotError}] =
    await Promise.all([
      supabase.from('money_item').select('*').eq('user_id', userId).eq('profile_id', id),
      supabase.from('clue').select('*').eq('user_id', userId).eq('profile_id', id).order('created_at', {ascending: false}),
      supabase
        .from('wealth_snapshot')
        .select('*')
        .eq('user_id', userId)
        .eq('profile_id', id)
        .order('created_at', {ascending: false})
    ])

  if (moneyError) throw moneyError
  if (clueError) throw clueError
  if (snapshotError) throw snapshotError

  return {
    profile: toProfile(profileRow as DbProfile),
    moneyItems: (moneyRows ?? []).map(toMoneyItem),
    clues: (clueRows ?? []).map(toClue),
    snapshots: (snapshotRows ?? []).map(toSnapshot)
  }
}

export async function createProfile(input: Partial<Profile>) {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Unauthorized')
  const now = new Date().toISOString()
  const profile: Profile = {
    id: input.id ?? `p_${nanoid()}`,
    userId,
    name: input.name || '未命名档案',
    ageRange: input.ageRange,
    city: input.city,
    job: input.job,
    maritalStatus: input.maritalStatus,
    children: input.children,
    totalAsset: Number(input.totalAsset ?? 0),
    totalDebt: Number(input.totalDebt ?? 0),
    monthlyIncome: Number(input.monthlyIncome ?? 0),
    monthlyExpense: Number(input.monthlyExpense ?? 0),
    confidence: Number(input.confidence ?? 60),
    createdAt: input.createdAt ?? now,
    updatedAt: now
  }

  if (!hasSupabaseEnv()) return profile

  const supabase = createSupabaseServerClient()
  const {error} = await supabase.from('wealth_profile').upsert({
    id: profile.id,
    user_id: userId,
    name: profile.name,
    age_range: profile.ageRange,
    city: profile.city,
    job: profile.job,
    marital_status: profile.maritalStatus,
    children: profile.children,
    total_asset: profile.totalAsset,
    total_debt: profile.totalDebt,
    monthly_income: profile.monthlyIncome,
    monthly_expense: profile.monthlyExpense,
    confidence: profile.confidence,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt
  })

  if (error) throw error
  return profile
}

export async function createClue(input: {profileId: string; content: string; parsedResult?: Clue['parsedResult']}) {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Unauthorized')
  const now = new Date().toISOString()
  const parsedResult = input.parsedResult ?? (await parseClueWithAi(input.content))
  const clue: Clue = {
    id: `c_${nanoid()}`,
    userId,
    profileId: input.profileId,
    content: input.content,
    type: parsedResult[0]?.type ?? 'other',
    confidence: parsedResult[0]?.confidence ?? 'medium',
    confirmed: false,
    hidden: false,
    parsedResult,
    createdAt: now,
    updatedAt: now
  }

  if (!hasSupabaseEnv()) return clue

  const supabase = createSupabaseServerClient()
  const {error} = await supabase.from('clue').insert({
    id: clue.id,
    user_id: userId,
    profile_id: clue.profileId,
    content: clue.content,
    type: clue.type,
    confidence: clue.confidence,
    confirmed: clue.confirmed,
    hidden: clue.hidden,
    parsed_result: clue.parsedResult,
    created_at: clue.createdAt,
    updated_at: clue.updatedAt
  })

  if (error) throw error
  return clue
}
