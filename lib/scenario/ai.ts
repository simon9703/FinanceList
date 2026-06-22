import {mockScenario} from './mock'
import type {ScenarioModule} from '@/lib/types'

export type GenerateScenarioRequest = {module?: ScenarioModule; prompt?: string; city_model?: 'cheap' | 'balanced' | 'expensive' | 'auto'}

export async function generateScenarioWithAI(input: GenerateScenarioRequest) {
  const module = input.module ?? 'buy_rent'
  const base = mockScenario[module]
  return {...base, id: `ai-${module}-${Date.now()}`, ai_generated: true, confidence: 0.86, city_model: input.city_model ?? base.city_model, created_at: Date.now(), expire_at: Date.now() + 7 * 24 * 60 * 60 * 1000}
}
