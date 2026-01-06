import { removeTier, updateTier } from '../state/tier'

import { ElementID, Tier } from '../constants'
import { dom } from '../dom'

import { removeTierRowElement, updateTierRowElement } from './tierRow'

const containerElement = dom.get<HTMLDivElement>(ElementID.TIER_SETTINGS_CONTAINER)

export const createTierSettingsRowElement = (tier: Tier) => {
  if (!containerElement) {
    return
  }

  const { id, label, hexColor } = tier

  const tierColorInput = document.createElement('input')
  tierColorInput.setAttribute('type', 'color')
  tierColorInput.setAttribute('value', hexColor)
  tierColorInput.classList.add('color-input')

  const tierColorInputLabel = document.createElement('label')
  tierColorInputLabel.classList.add('color-input-label')
  tierColorInputLabel.style.backgroundColor = hexColor
  tierColorInputLabel.appendChild(tierColorInput)

  const tierLabelInput = document.createElement('input')
  tierLabelInput.classList.add('tier-settings-label-input')
  tierLabelInput.value = label

  tierColorInput.addEventListener('input', () => {
    const data = { hexColor: tierColorInput.value, label: tierLabelInput.value }
    updateTier(id, data)
    updateTierRowElement(id, data)
    updateTierSettingsRowElement(id, data)
  })

  tierLabelInput.addEventListener('input', () => {
    const data = { hexColor: tierColorInput.value, label: tierLabelInput.value }
    updateTier(id, data)
    updateTierRowElement(id, data)
    updateTierSettingsRowElement(id, data)
  })

  const deleteButtonIconReference = document.createElementNS('http://www.w3.org/2000/svg', 'use')
  deleteButtonIconReference.setAttribute('href', '#bi-x')

  const deleteButtonSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  deleteButtonSVG.setAttribute('width', '16')
  deleteButtonSVG.setAttribute('height', '16')
  deleteButtonSVG.appendChild(deleteButtonIconReference)

  const deleteButton = document.createElement('div')
  deleteButton.classList.add('tier-settings-delete-button')
  deleteButton.appendChild(deleteButtonSVG)

  deleteButton.addEventListener('click', () => {
    removeTier(id)
    removeTierRowElement(id)
    removeTierSettingsRowElement(id)
  })

  const tierSettingsRow = document.createElement('div')
  tierSettingsRow.setAttribute('id', `tier_settings_row_${id}`)
  tierSettingsRow.classList.add('tier-settings-row')
  tierSettingsRow.appendChild(tierColorInputLabel)
  tierSettingsRow.appendChild(tierLabelInput)
  tierSettingsRow.appendChild(deleteButton)

  containerElement.appendChild(tierSettingsRow)

  // if (focus) {
  //     tierLabelInput.focus()
  // }
}

const updateTierSettingsRowElement = (tierId: string, data: Omit<Tier, 'id'>) => {
  const element = dom.get(`tier_settings_row_${tierId}`)
  if (!element) {
    return
  }

  const { children } = element
  const { label, hexColor } = data

  const tierColorInputLabel = children[0] as HTMLLabelElement
  if (!tierColorInputLabel) {
    return
  }

  tierColorInputLabel.style.backgroundColor = hexColor

  const tierColorInputElements = tierColorInputLabel.getElementsByTagName('input')
  if (!tierColorInputElements.length) {
    return
  }

  const tierColorInput = tierColorInputElements[0] as HTMLInputElement
  tierColorInput.setAttribute('value', hexColor)

  const tierLabelInput = children[1] as HTMLInputElement
  if (!tierLabelInput) {
    return
  }
  tierLabelInput.value = label
}

const removeTierSettingsRowElement = (tierId: string) => {
  if (!containerElement) {
    return
  }

  const element = dom.get(`tier_settings_row_${tierId}`)
  if (!element) {
    return
  }

  containerElement.removeChild(element)
  dom.delete(`tier_settings_row_${tierId}`)
}
