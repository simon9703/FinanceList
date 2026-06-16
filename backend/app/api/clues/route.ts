import { NextRequest, NextResponse } from 'next/server'
import { parseClueWithAi } from '../../../lib/ai'
import { db, getUserId } from '../../../lib/db'
import type { Clue } from '../../../lib/types'

export async function POST(request: NextRequest) {
  const userId = getUserId(request.headers)
  const body = await request.json()
  const now = new Date().toISOString()
  const parsedResult = body.parsedResult || await parseClueWithAi(body.content || '')
  const clue: Clue = { id: `c_${Date.now()}`, userId, profileId: body.profileId, content: body.content || '', type: parsedResult[0]?.type || 'other', confidence: parsedResult[0]?.confidence || 'medium', confirmed: Boolean(body.confirmed), hidden: false, parsedResult, createdAt: now, updatedAt: now }
  return NextResponse.json({ data: db.addClue(clue) })
}
