import {NextResponse} from 'next/server'
import {mockScenario} from '@/lib/category/mock'
import type {ScenarioModule} from '@/lib/category/types'

export function GET(request: Request) {
  const module = new URL(request.url).searchParams.get('module') as ScenarioModule | null
  if (module && mockScenario[module]) return NextResponse.json({scenario: mockScenario[module], source: 'mock'})
  return NextResponse.json({scenarios: mockScenario, source: 'mock'})
}
