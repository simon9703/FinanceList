import type { Clue, ParsedClue, Person } from '@/types/profile'

const API_BASE = process.env.TARO_APP_API_BASE || ''
const userHeaders = { 'content-type': 'application/json', 'x-user-id': 'demo-user' }

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers: { ...userHeaders, ...(options?.headers || {}) } })
  if (!response.ok) throw new Error(`API ${path} failed: ${response.status}`)
  return response.json() as Promise<T>
}

export const profileApi = {
  listProfiles: () => request<{ data: Person[] }>('/api/profiles'),
  getProfile: (id: string) => request<{ data: { profile: Person; clues: Clue[] } }>(`/api/profiles/${id}`),
  upsertProfile: (payload: unknown) => request<{ data: Person }>('/api/profiles', { method: 'POST', body: JSON.stringify(payload) }),
  parseClue: (content: string) => request<{ data: ParsedClue[] }>('/api/ai/parse-clue', { method: 'POST', body: JSON.stringify({ content }) }),
  addClue: (payload: unknown) => request<{ data: Clue }>('/api/clues', { method: 'POST', body: JSON.stringify(payload) }),
}
