import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { ClueType, TimelineTitle } from '@/config/profile'
import { mockDefaultClueConfidence, mockInitialClues, mockInitialPeople, mockInitialTimeline } from '@/mock/profile'
import { analyzeProfile } from '@/services/ai'
import { buildForecast, buildPersonFromForm, createSnapshot, parseClueMock, type ProfileFormValues } from '@/services/profile'
import type { Clue, Person, Snapshot, TimelineItem } from '@/types/profile'

type State = {
  people: Person[]
  clues: Clue[]
  timeline: TimelineItem[]
  snapshots: Snapshot[]
  createPerson: (input: ProfileFormValues) => string
  upsertPerson: (input: ProfileFormValues) => string
  addClue: (personId: string, content: string, confirmed?: boolean) => Promise<void>
  parseClue: (content: string) => ReturnType<typeof parseClueMock>
  rerunAnalysis: (personId: string) => Promise<void>
}

export const useProfileStore = create<State>((set, get) => ({
  people: mockInitialPeople,
  clues: mockInitialClues,
  timeline: mockInitialTimeline,
  snapshots: mockInitialPeople.map(createSnapshot),
  createPerson: (input) => get().upsertPerson(input),
  upsertPerson: (input) => {
    const previous = input.id ? get().people.find((item) => item.id === input.id) : undefined
    const person = buildPersonFromForm(input, previous)
    const snapshot = createSnapshot(person)
    set((s) => ({
      people: previous ? s.people.map((item) => item.id === person.id ? person : item) : [person, ...s.people],
      snapshots: [snapshot, ...s.snapshots],
      timeline: [{ id: `t_${Date.now()}`, personId: person.id, title: previous ? '人工修改当前判断' : TimelineTitle.Created, createdAt: Date.now() }, ...s.timeline],
    }))
    return person.id
  },
  parseClue: (content) => parseClueMock(content),
  addClue: async (personId, content, confirmed = true) => {
    const parsed = parseClueMock(content)
    const clue: Clue = {
      id: `c_${Date.now()}`,
      personId,
      content,
      type: ClueType.LifeSignal,
      confidence: mockDefaultClueConfidence,
      createdAt: Date.now(),
      parsed,
      confirmed,
    }
    set((s) => ({
      clues: [clue, ...s.clues],
      timeline: [{ id: `t_${Date.now()}`, personId, title: TimelineTitle.ClueAdded, createdAt: Date.now() }, ...s.timeline],
    }))
    await get().rerunAnalysis(personId)
    Taro.showToast({ title: '已保存并分析', icon: 'success' })
  },
  rerunAnalysis: async (personId) => {
    const person = get().people.find((item) => item.id === personId)
    if (!person) return
    const personClues = get().clues.filter((clue) => clue.personId === personId && clue.confirmed && !clue.hidden)
    const analysis = await analyzeProfile(person, personClues)
    const sideIncome = personClues.flatMap((clue) => clue.parsed || []).filter((item) => item.type === '收入' && item.item.includes('副业')).reduce((sum, item) => sum + (item.amount || 0), 0)
    const updatedAsset = { ...person.asset, income: Number(Math.max(person.asset.income, 4.3 + sideIncome).toFixed(2)) }
    const updated = { ...person, asset: updatedAsset, tags: [analysis.structureTag, `风险：${analysis.riskLevel}`, analysis.summary], summary: analysis.summary, riskLevel: analysis.riskLevel, confidence: Math.min((person.confidence || 60) + 2, 95), updatedAt: Date.now() }
    const forecast = buildForecast(updated)
    const withForecast = { ...updated, forecastScenarios: forecast, future5: forecast[1].fiveYearNetAsset, future10: forecast[1].tenYearNetAsset, recentChanges: [{ id: `j_${Date.now()}`, label: '线索确认', before: `${person.asset.income}万/月`, after: `${updatedAsset.income}万/月`, source: '线索确认' as const, createdAt: Date.now() }, ...(person.recentChanges || [])] }
    set((s) => ({
      people: s.people.map((item) => item.id === personId ? withForecast : item),
      snapshots: [createSnapshot(withForecast), ...s.snapshots],
      timeline: [{ id: `t_${Date.now()}a`, personId, title: TimelineTitle.AiUpdated, createdAt: Date.now() }, ...s.timeline],
    }))
  },
}))
