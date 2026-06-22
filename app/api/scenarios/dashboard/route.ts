import {NextResponse} from 'next/server'
import {z} from 'zod'
import {resolveScenario} from '@/lib/scenario/service'
import type {ModuleKey} from '@/lib/scenario/types'

const requestSchema = z.object({
  modules: z.array(z.enum(['buy_rent', 'investment', 'living_cost', 'retirement', 'personal'])).optional(),
  regenerate: z.boolean().optional(),
  mode: z.enum(['mock', 'ai_cache']).optional(),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const parsed = requestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid dashboard request', issues: parsed.error.flatten()}, {status: 400})
  }

  const modules = (parsed.data.modules ?? ['buy_rent', 'investment', 'living_cost', 'retirement']) as ModuleKey[]
  const entries = await Promise.all(
    modules.map(async (module) => {
      const response = await resolveScenario({module, regenerate: parsed.data.regenerate, mode: parsed.data.mode})
      return [module, response] as const
    }),
  )
  const responses = Object.fromEntries(entries)
  const sources = new Set(entries.map(([, response]) => response.source))

  return NextResponse.json({
    scenarios: Object.fromEntries(entries.map(([module, response]) => [module, response.scenario])),
    sources: Object.fromEntries(entries.map(([module, response]) => [module, response.source])),
    source: sources.size === 1 ? entries[0]?.[1].source ?? 'mock' : 'mixed',
    responses,
  })
}
