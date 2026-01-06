import { Draggable } from '../constants'

interface DraggableState {
  selectedDraggableId: string | null
  draggables: Draggable[]
}

const state: DraggableState = {
  selectedDraggableId: null,
  draggables: [],
}

export const setSelectedDraggableId = (id: string | null) => {
  state.selectedDraggableId = id
}

export const getSelectedDraggable = () => {
  const selectedDraggableId = state.selectedDraggableId
  if (!selectedDraggableId) {
    return null
  }

  const selectedDraggable = state.draggables.find((e) => e.id === selectedDraggableId)
  if (!selectedDraggable) {
    return null
  }

  return selectedDraggable
}

export const addDraggable = (data: Omit<Draggable, 'id'>) => {
  const newDraggable = { ...data, id: crypto.randomUUID() }
  state.draggables.push(newDraggable)
  return newDraggable
}

export const updateDraggable = (draggableId: string, data: Omit<Draggable, 'id'>) => {
  const index = state.draggables.findIndex((draggable) => draggable.id === draggableId)
  if (index === -1) {
    return
  }
  state.draggables[index] = { id: draggableId, ...data }
}

export const removeDraggable = (draggableId: string) => {
  const index = state.draggables.findIndex((tier) => tier.id === draggableId)
  if (index === -1) {
    return
  }
  state.draggables.splice(index, 1)
}
