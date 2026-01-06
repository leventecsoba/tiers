import {ElementID, Tier} from "../constants"
import {dom} from "../dom"

const containerElement = dom.get<HTMLDivElement>(ElementID.TIER_CONTAINER)

export const createTierRowElement = (tier: Tier) => {
    if (!containerElement) {
        return
    }

    const {id, label, hexColor} = tier

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

export const updateTierRowElement = (tierId: string, data: Omit<Tier, "id">) => {
    const element = dom.get(`tier_row_${tierId}`)
    if (!element) {
        return
    }

    const {children} = element
    const {label, hexColor} = data

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

export const removeTierRowElement = (tierId: string) => {
    if (!containerElement) {
        return
    }

    const element = dom.get(`tier_row_${tierId}`)
    if (!element) {
        return
    }

    containerElement.removeChild(element)
    dom.delete(`tier_row_${tierId}`)
}