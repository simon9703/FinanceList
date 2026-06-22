import {NextResponse} from 'next/server'
import {z} from 'zod'
import {resolveScenario} from '@/lib/scenario/service'

const requestSchema = z.object({
  module: z.enum(['buy_rent', 'investment', 'living_cost', 'retirement', 'personal']),
  request: z.record(z.unknown()).optional(),
  regenerate: z.boolean().optional(),
  mode: z.enum(['mock', 'ai_cache']).optional(),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = requestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid scenario request', issues: parsed.error.flatten()}, {status: 400})
  }

  const response = await resolveScenario(parsed.data)
  return NextResponse.json(response)
}
