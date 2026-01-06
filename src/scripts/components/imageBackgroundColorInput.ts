import { ElementID } from '../constants'
import { dom } from '../dom'

const _IMAGE_BACKGROUND_COLOR_VARIABLE = '--image-background-color'

const imageBackgroundColorInputElement = dom.get<HTMLInputElement>(ElementID.IMAGE_BACKGROUND_COLOR_INPUT)
const imageBackgroundColorInputLabelElement = dom.get<HTMLLabelElement>(ElementID.IMAGE_BACKGROUND_COLOR_INPUT_LABEL)

const handleInput = () => {
  if (!imageBackgroundColorInputElement || !imageBackgroundColorInputLabelElement) {
    return
  }
  document.documentElement.style.setProperty(_IMAGE_BACKGROUND_COLOR_VARIABLE, imageBackgroundColorInputElement.value)
  imageBackgroundColorInputLabelElement.style.backgroundColor = imageBackgroundColorInputElement.value
}

export const resetImageBackgroundColorInputValues = () => {
  if (!imageBackgroundColorInputElement || !imageBackgroundColorInputLabelElement) {
    return
  }
  const rootElementStyle = getComputedStyle(document.documentElement, null)
  imageBackgroundColorInputElement.value = rootElementStyle.getPropertyValue(_IMAGE_BACKGROUND_COLOR_VARIABLE)
  imageBackgroundColorInputLabelElement.style.backgroundColor = imageBackgroundColorInputElement.value
}

export const initImageBackgroundColorInput = () => {
  if (!imageBackgroundColorInputElement) {
    return
  }

  resetImageBackgroundColorInputValues()

  imageBackgroundColorInputElement.addEventListener('input', handleInput)
}
