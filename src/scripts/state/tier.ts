import { Tier } from '../constants'

interface TierState {
  tiers: Tier[]
}

const state: TierState = {
  tiers: [],
}

export const addTier = (data: Omit<Tier, 'id'>) => {
  const newTier = { ...data, id: crypto.randomUUID() }
  state.tiers.push(newTier)
  return newTier
}

export const updateTier = (tierId: string, data: Omit<Tier, 'id'>) => {
  const index = state.tiers.findIndex((tier) => tier.id === tierId)
  if (index === -1) {
    return
  }
  state.tiers[index] = { id: tierId, ...data }
}

export const removeTier = (tierId: string) => {
  const index = state.tiers.findIndex((tier) => tier.id === tierId)
  if (index === -1) {
    return
  }
  state.tiers.splice(index, 1)
}
