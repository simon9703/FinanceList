import { NextRequest, NextResponse } from 'next/server'
import { db, getUserId } from '../../../lib/db'
import type { Profile } from '../../../lib/types'

export async function GET(request: NextRequest) {
  const userId = getUserId(request.headers)
  return NextResponse.json({ data: db.listProfiles(userId) })
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request.headers)
  const body = await request.json()
  const now = new Date().toISOString()
  const profile: Profile = { id: body.id || `p_${Date.now()}`, userId, name: body.name || '未命名人物', ageRange: body.ageRange, city: body.city, job: body.job, maritalStatus: body.maritalStatus, children: body.children, totalAsset: Number(body.totalAsset || 0), totalDebt: Number(body.totalDebt || body.debt || 0), monthlyIncome: Number(body.monthlyIncome || body.income || 0), monthlyExpense: Number(body.monthlyExpense || body.expense || 0), confidence: Number(body.confidence || 60), createdAt: body.createdAt || now, updatedAt: now }
  db.upsertProfile(profile)
  db.addSnapshot({ id: `s_${Date.now()}`, userId, profileId: profile.id, totalAsset: profile.totalAsset, totalDebt: profile.totalDebt, monthlyIncome: profile.monthlyIncome, monthlyExpense: profile.monthlyExpense, confidence: profile.confidence, createdAt: now })
  return NextResponse.json({ data: profile })
}
