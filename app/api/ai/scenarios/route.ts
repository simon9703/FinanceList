import {NextResponse} from 'next/server'
import {generateScenarioWithAI} from '@/lib/scenario/ai'

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}))
  const scenario = await generateScenarioWithAI(payload)
  return NextResponse.json({scenario, source: 'mock-ai-layer'})
}
