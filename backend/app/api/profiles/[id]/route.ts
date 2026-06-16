import { NextRequest, NextResponse } from 'next/server'
import { db, getUserId } from '../../../../lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(request.headers)
  const profile = db.getProfile(userId, params.id)
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ data: { profile, moneyItems: db.listMoneyItems(params.id), clues: db.listClues(userId, params.id), snapshots: db.listSnapshots(userId, params.id) } })
}
