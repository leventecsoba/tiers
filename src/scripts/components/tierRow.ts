import {ElementID, Tier} from "../constants"
import {tierState} from "../state"
import {dom} from "../dom"

const containerElement = dom.get<HTMLDivElement>(ElementID.TIER_CONTAINER)

const createTierRow = (id: string, newTier: Tier) => {
    if (!containerElement) {
        return
    }

    const {label, hexColor} = newTier

    const tierLabel = document.createElement("span")
    tierLabel.innerText = label

    const tierLevel = document.createElement("div")
    tierLevel.classList.add("tier-level")
    tierLevel.style.backgroundColor = hexColor
    tierLevel.appendChild(tierLabel)

    const tierContent = document.createElement("div")
    tierContent.classList.add("tier-content", "drag-target-container")

    const tierRow = document.createElement("div")
    tierRow.setAttribute("id", `tier_row_${id}`)
    tierRow.classList.add("tier-row")
    tierRow.appendChild(tierLevel)
    tierRow.appendChild(tierContent)

    containerElement.appendChild(tierRow)
}

const updateTierRow = (id: string, updatedTier: Tier) => {
    const element = dom.get(`tier_row_${id}`)
    if (!element) {
        return
    }

    const {children} = element
    const {label, hexColor} = updatedTier

    const tierLevel = children[0] as HTMLDivElement
    if (!tierLevel) {
        return
    }
    tierLevel.style.backgroundColor = hexColor

    const tierLabelElements = tierLevel.getElementsByTagName("span")
    if (!tierLabelElements.length) {
        return
    }

    const tierLabel = tierLabelElements[0] as HTMLSpanElement
    tierLabel.innerText = label
}

const removeTierRow = (id: string) => {
    if (!containerElement) {
        return
    }

    const element = dom.get(`tier_row_${id}`)
    if (!element) {
        return
    }

    containerElement.removeChild(element)
    dom.delete(`tier_row_${id}`)
}


export const initTierRows = () => {
    tierState.subscribe({type: "add", callback: createTierRow})
    tierState.subscribe({type: "update", callback: updateTierRow})
    tierState.subscribe({type: "remove", callback: removeTierRow})
}