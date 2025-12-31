import {ElementID, Tier} from "../constants"
import {tierState} from "../state"
import {dom} from "../dom"

const containerElement = dom.get<HTMLDivElement>(ElementID.TIER_SETTINGS_CONTAINER)

const createTierSettingsRow = (id: string, newTier: Tier) => {
    if (!containerElement) {
        return
    }

    const {label, hexColor} = newTier

    const tierColorInput = document.createElement("input")
    tierColorInput.setAttribute("type", "color")
    tierColorInput.setAttribute("value", hexColor)
    tierColorInput.classList.add("color-input")

    const tierColorInputLabel = document.createElement("label")
    tierColorInputLabel.classList.add("color-input-label")
    tierColorInputLabel.style.backgroundColor = hexColor
    tierColorInputLabel.appendChild(tierColorInput)

    const tierLabelInput = document.createElement("input")
    tierLabelInput.classList.add("tier-settings-label-input")
    tierLabelInput.value = label

    tierColorInput.addEventListener("input", () => {
        tierState.update(id, {hexColor: tierColorInput.value, label: tierLabelInput.value})
    })

    tierLabelInput.addEventListener("input", () => {
        tierState.update(id, {hexColor: tierColorInput.value, label: tierLabelInput.value})
    })

    const deleteButtonIconReference = document.createElementNS("http://www.w3.org/2000/svg", "use")
    deleteButtonIconReference.setAttribute("href", "#bi-x")

    const deleteButtonSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    deleteButtonSVG.setAttribute("width", "16")
    deleteButtonSVG.setAttribute("height", "16")
    deleteButtonSVG.appendChild(deleteButtonIconReference)

    const deleteButton = document.createElement("div")
    deleteButton.classList.add("tier-settings-delete-button")
    deleteButton.appendChild(deleteButtonSVG)

    deleteButton.addEventListener("click", () => {
        tierState.remove(id)
    })

    const tierSettingsRow = document.createElement("div")
    tierSettingsRow.setAttribute("id", `tier_settings_row_${id}`)
    tierSettingsRow.classList.add("tier-settings-row")
    tierSettingsRow.appendChild(tierColorInputLabel)
    tierSettingsRow.appendChild(tierLabelInput)
    tierSettingsRow.appendChild(deleteButton)

    containerElement.appendChild(tierSettingsRow)

    // if (focus) {
    //     tierLabelInput.focus()
    // }
}

const updateTierSettingsRow = (id: string, updatedTier: Tier) => {
    const element = dom.get(`tier_settings_row_${id}`)
    if (!element) {
        return
    }

    const {children} = element
    const {label, hexColor} = updatedTier

    const tierColorInputLabel = children[0] as HTMLLabelElement
    if (!tierColorInputLabel) {
        return
    }

    tierColorInputLabel.style.backgroundColor = hexColor

    const tierColorInputElements = tierColorInputLabel.getElementsByTagName("input")
    if (!tierColorInputElements.length) {
        return
    }

    const tierColorInput = tierColorInputElements[0] as HTMLInputElement
    tierColorInput.setAttribute("value", hexColor)

    const tierLabelInput = children[1] as HTMLInputElement
    if (!tierLabelInput) {
        return
    }
    tierLabelInput.value = label
}

const removeTierSettingsRow = (id: string) => {
    if (!containerElement) {
        return
    }

    const element = dom.get(`tier_settings_row_${id}`)
    if (!element) {
        return
    }

    containerElement.removeChild(element)
    dom.delete(`tier_settings_row_${id}`)
}


export const initTierSettingsRows = () => {
    tierState.subscribe({type: "add", callback: createTierSettingsRow})
    tierState.subscribe({type: "update", callback: updateTierSettingsRow})
    tierState.subscribe({type: "remove", callback: removeTierSettingsRow})
}