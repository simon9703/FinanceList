import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { ClueType, RiskLevel, StructureTag, TimelineTitle } from '@/config/profile'
import {
  mockDefaultClueConfidence,
  mockDefaultPersonName,
  mockInitialClues,
  mockInitialPeople,
  mockInitialTimeline,
  mockNewPersonAsset,
  mockNewPersonStructure,
} from '@/mock/profile'
import { analyzeProfile } from '@/services/ai'
import type { Clue, Person, TimelineItem } from '@/types/profile'

type CreatePersonInput = Pick<Person, 'name' | 'ageRange' | 'city' | 'job'> & {
  house: string
  car: string
  income: string
  debt: string
}

type State = {
  people: Person[]
  clues: Clue[]
  timeline: TimelineItem[]
  createPerson: (input: CreatePersonInput) => string
  addClue: (personId: string, content: string) => Promise<void>
  rerunAnalysis: (personId: string) => Promise<void>
}

export const useProfileStore = create<State>((set, get) => ({
  people: mockInitialPeople,
  clues: mockInitialClues,
  timeline: mockInitialTimeline,
  createPerson: (input) => {
    const id = `p_${Date.now()}`
    const hasHouse = input.house.includes('房')
    const hasCarValue = input.car.includes('万')
    const person: Person = {
      id,
      name: input.name || mockDefaultPersonName,
      ageRange: input.ageRange,
      city: input.city,
      job: input.job,
      asset: { ...mockNewPersonAsset, debt: input.debt ? mockNewPersonAsset.debt : 0 },
      structure: hasHouse
        ? { ...mockNewPersonStructure.withHouse, carRatio: hasCarValue ? mockNewPersonStructure.withHouse.carRatio : 4 }
        : mockNewPersonStructure.withoutHouse,
      tags: [StructureTag.Pending],
      riskLevel: RiskLevel.Medium,
      updatedAt: Date.now(),
    }
    set((s) => ({
      people: [person, ...s.people],
      timeline: [{ id: `t_${Date.now()}`, personId: id, title: TimelineTitle.Created, createdAt: Date.now() }, ...s.timeline],
    }))
    return id
  },
  addClue: async (personId, content) => {
    const clue: Clue = {
      id: `c_${Date.now()}`,
      personId,
      content,
      type: ClueType.LifeSignal,
      confidence: mockDefaultClueConfidence,
      createdAt: Date.now(),
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
    const analysis = await analyzeProfile(person, get().clues.filter((clue) => clue.personId === personId))
    set((s) => ({
      people: s.people.map((item) => item.id === personId
        ? {
          ...item,
          tags: [analysis.structureTag, `风险：${analysis.riskLevel}`, analysis.summary],
          summary: analysis.summary,
          riskLevel: analysis.riskLevel,
          updatedAt: Date.now(),
        }
        : item),
      timeline: [{ id: `t_${Date.now()}a`, personId, title: TimelineTitle.AiUpdated, createdAt: Date.now() }, ...s.timeline],
    }))
  },
}))
