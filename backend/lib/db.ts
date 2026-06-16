import { demoClues, demoMoneyItems, demoProfile, demoSnapshots, demoUserId } from '../data/mock/profiles'
import type { Clue, MoneyItem, Profile, Snapshot } from './types'

const profiles = new Map<string, Profile>([[demoProfile.id, demoProfile]])
const clues = new Map<string, Clue>(demoClues.map((item) => [item.id, item]))
const moneyItems = new Map<string, MoneyItem>(demoMoneyItems.map((item) => [item.id, item]))
const snapshots = new Map<string, Snapshot>(demoSnapshots.map((item) => [item.id, item]))

export function getUserId(headers: Headers) {
  return headers.get('x-user-id') || demoUserId
}

export const db = {
  listProfiles(userId: string) { return [...profiles.values()].filter((item) => item.userId === userId) },
  getProfile(userId: string, id: string) { return profiles.get(id)?.userId === userId ? profiles.get(id) : undefined },
  upsertProfile(profile: Profile) { profiles.set(profile.id, profile); return profile },
  listMoneyItems(profileId: string) { return [...moneyItems.values()].filter((item) => item.profileId === profileId) },
  listClues(userId: string, profileId?: string) { return [...clues.values()].filter((item) => item.userId === userId && (!profileId || item.profileId === profileId)) },
  addClue(clue: Clue) { clues.set(clue.id, clue); return clue },
  listSnapshots(userId: string, profileId: string) { return [...snapshots.values()].filter((item) => item.userId === userId && item.profileId === profileId) },
  addSnapshot(snapshot: Snapshot) { snapshots.set(snapshot.id, snapshot); return snapshot },
}
