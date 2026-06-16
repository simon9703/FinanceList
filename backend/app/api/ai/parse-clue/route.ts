import { NextRequest, NextResponse } from 'next/server'
import { parseClueWithAi } from '../../../../lib/ai'

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ data: await parseClueWithAi(body.content || '') })
}
