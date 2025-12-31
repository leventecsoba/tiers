import {ElementID, Tier} from "../constants"
import {getRandomColor} from "../utils"
import {tierState} from "../state"
import {dom} from "../dom"

const newTierColorInputElement = dom.get<HTMLInputElement>(ElementID.NEW_TIER_COLOR_INPUT)
const newTierColorInputLabelElement = dom.get<HTMLLabelElement>(ElementID.NEW_TIER_COLOR_INPUT_LABEL)
const newTierLabelInputElement = dom.get<HTMLInputElement>(ElementID.NEW_TIER_LABEL_INPUT)
const newTierAddButtonElement = dom.get<HTMLDivElement>(ElementID.NEW_TIER_ADD_BUTTON)

const getNewTier = (): Tier | null => {
    if (!newTierColorInputElement || !newTierLabelInputElement) {
        return null
    }
    return {label: newTierLabelInputElement.value, hexColor: newTierColorInputElement.value}
}

const handleInput = () => {
    if (!newTierColorInputElement || !newTierColorInputLabelElement) {
        return
    }
    newTierColorInputLabelElement.style.backgroundColor = newTierColorInputElement.value
}

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Enter") {
        return
    }

    const newTier = getNewTier()
    if (!newTier) {
        return
    }

    tierState.add(newTier)
    resetNewTierInputValues()
}

const handleClick = () => {
    const newTier = getNewTier()
    if (!newTier) {
        return
    }

    tierState.add(newTier)
    resetNewTierInputValues()
}

export const resetNewTierInputValues = () => {
    if (!newTierColorInputElement || !newTierColorInputLabelElement || !newTierLabelInputElement) {
        return
    }

    newTierColorInputElement.value = getRandomColor()
    newTierColorInputLabelElement.style.backgroundColor = newTierColorInputElement.value
    newTierLabelInputElement.value = ""
}

export const initNewTierInput = () => {
    if (!newTierColorInputElement || !newTierLabelInputElement || !newTierAddButtonElement) {
        return
    }

    resetNewTierInputValues()

    newTierColorInputElement.addEventListener("input", handleInput)
    newTierLabelInputElement.addEventListener("keydown", handleKeyDown)
    newTierAddButtonElement.addEventListener("click", handleClick)
}