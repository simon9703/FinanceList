import {getMockScenario} from './mock'
import type {ModuleKey, Scenario, ScenarioApiMode, ScenarioRequest, ScenarioResponse} from './types'

const sevenDays = 7 * 24 * 60 * 60 * 1000

function configuredMode(mode?: ScenarioApiMode): ScenarioApiMode {
  if (mode) return mode
  return process.env.NEXT_PUBLIC_SCENARIO_MODE === 'ai_cache' ? 'ai_cache' : 'mock'
}

function stableHash(value: unknown) {
  const json = JSON.stringify(value, Object.keys(value as object).sort())
  let hash = 0
  for (let i = 0; i < json.length; i += 1) {
    hash = (hash << 5) - hash + json.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

async function readScenarioFromCache(_module: ModuleKey, _hash: string): Promise<Scenario | null> {
  // Cache adapter placeholder. The project currently has no Postgres driver dependency.
  return null
}

async function writeScenarioToCache(_scenario: Scenario, _hash: string): Promise<void> {
  // Cache adapter placeholder. The project currently has no Postgres driver dependency.
}

async function generateScenarioWithAI(module: ModuleKey, request: Record<string, unknown> = {}): Promise<Scenario | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const mock = getMockScenario(module)
  return {
    ...mock,
    id: `ai-${module}-${Date.now()}`,
    created_at: Date.now(),
    expire_at: Date.now() + sevenDays,
    ai_generated: true,
    confidence: 0.86,
    data: {
      ...(mock.data as object),
      ...(request.overrides && typeof request.overrides === 'object' ? request.overrides : {}),
    },
  }
}

export async function resolveScenario(payload: ScenarioRequest): Promise<ScenarioResponse> {
  const mode = configuredMode(payload.mode)
  const request = payload.request ?? {}

  if (mode === 'mock') {
    return {scenario: getMockScenario(payload.module), source: 'mock'}
  }

  const hash = stableHash({module: payload.module, request})

  if (!payload.regenerate) {
    const cached = await readScenarioFromCache(payload.module, hash)
    if (cached && cached.expire_at > Date.now()) {
      return {scenario: cached, source: 'cache'}
    }
  }

  const generated = await generateScenarioWithAI(payload.module, request)
  if (generated) {
    await writeScenarioToCache(generated, hash)
    return {scenario: generated, source: 'ai'}
  }

  return {scenario: getMockScenario(payload.module), source: 'mock'}
}

export async function resolveScenarios(
  modules: ModuleKey[],
  options: Pick<ScenarioRequest, 'mode' | 'regenerate'> = {},
) {
  const entries = await Promise.all(
    modules.map(async (module) => {
      const response = await resolveScenario({module, mode: options.mode, regenerate: options.regenerate})
      return [module, response] as const
    }),
  )

  return Object.fromEntries(entries) as Record<ModuleKey, ScenarioResponse>
}
