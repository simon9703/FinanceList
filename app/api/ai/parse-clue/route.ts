import {NextResponse} from 'next/server'
import {parseClueWithAi} from '@/lib/ai'

export async function POST(request: Request) {
  const body = await request.json()
  const data = await parseClueWithAi(body.content ?? '')
  return NextResponse.json({data})
}
