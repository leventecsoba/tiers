import { ElementID, isDevMode } from '../constants'
import { dom } from '../dom'

import { resetImageBackgroundColorInputValues } from './imageBackgroundColorInput'
import { resetNewTierInputValues } from './newTierInput'

const settingsModalElement = dom.get<HTMLDivElement>(ElementID.SETTINGS_MODAL)
const settingsModalOpenButtonElement = dom.get<HTMLDivElement>(ElementID.SETTINGS_MODAL_OPEN_BUTTON)

const openSettingsModal = () => {
  settingsModalElement?.classList.remove('hide')
  resetNewTierInputValues()
  resetImageBackgroundColorInputValues()
}

const hideSettingsModal = () => {
  settingsModalElement?.classList.add('hide')
}

const handleKeyUp = (e: KeyboardEvent) => {
  if (!settingsModalElement) {
    return
  }

  if (e.key !== 'Escape') {
    return
  }

  const isHidden = settingsModalElement.classList.contains('hide')
  if (isHidden) {
    return
  }

  hideSettingsModal()
}

const handleClick = (e: MouseEvent) => {
  if (!settingsModalElement) {
    return
  }

  const { clientX: mouseX, clientY: mouseY } = e

  const isHidden = settingsModalElement.classList.contains('hide')
  if (isHidden) {
    return
  }

  const modalContentElements = settingsModalElement.getElementsByClassName('modal-content')
  if (!modalContentElements.length) {
    return
  }

  const settingsModalContent = modalContentElements[0] as HTMLDivElement
  const { x, y, height, width } = settingsModalContent.getBoundingClientRect()

  const isClickOutsideModalContent = mouseX < x || mouseX > x + width || mouseY < y || mouseY > y + height
  if (!isClickOutsideModalContent) {
    return
  }

  hideSettingsModal()
}

const handleSettingsModalOpenButtonClick = (e: MouseEvent) => {
  e.stopPropagation()
  openSettingsModal()
}

export const initSettingsModal = () => {
  if (!settingsModalOpenButtonElement) {
    return
  }

  settingsModalOpenButtonElement.addEventListener('click', handleSettingsModalOpenButtonClick)

  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('click', handleClick)

  if (isDevMode) {
    openSettingsModal()
  }
}
