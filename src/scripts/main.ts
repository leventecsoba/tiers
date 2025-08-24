import {initExport} from "./export"
import {initDragging} from "./dragging";

import {getRandomColor} from "./utils"

// @ts-ignore
const isDevMode = import.meta.env.DEV

const tierContainer = document.getElementById("tier-container") as HTMLDivElement | null
const tierSettingsContainer = document.getElementById("tier-settings-container") as HTMLDivElement | null
const settingsModal = document.getElementById("settings-modal") as HTMLDivElement | null

const _HIDE_FOOTER_TIMEOUT = 2000

interface Tier {
    id: string
    label: string
    hexColor: string
}

const tiersArray: Tier[] = [
    {id: crypto.randomUUID(), label: "S", hexColor: "#fe7f7f"},
    {id: crypto.randomUUID(), label: "A", hexColor: "#FFBF7F"},
    {id: crypto.randomUUID(), label: "B", hexColor: "#FEDF81"},
    {id: crypto.randomUUID(), label: "C", hexColor: "#FEFE7F"},
    {id: crypto.randomUUID(), label: "D", hexColor: "#BEFF7E"},
    {id: crypto.randomUUID(), label: "E", hexColor: "#7EFE7F"}
]

const initFooterToggle = () => {
    let footerTimeout: number | null = null;

    const footer = document.getElementById("footer")
    const footerToggle = document.getElementById("footer-toggle")

    if (!footer || !footerToggle) {
        return
    }

    const showFooter = () => {
        footer.classList.remove("hide", "blur")
    }

    const hideFooter = () => {
        footer.classList.add("hide")
    }

    const handleClick = () => {
        const isHidden = Array.from(footer.classList).includes("hide")
        if (isHidden) {
            showFooter()
        } else {
            hideFooter()
        }
    }

    footerToggle.addEventListener("click", handleClick)

    const handleMouseEnter = () => {
        showFooter()
        if (footerTimeout === null) {
            return
        }
        clearTimeout(footerTimeout)
        footerTimeout = null
    }

    const handleMouseLeave = () => {
        footer.classList.add("blur")
        footerTimeout = setTimeout(hideFooter, _HIDE_FOOTER_TIMEOUT)
    }

    footer.addEventListener("mouseenter", handleMouseEnter)
    footer.addEventListener("mouseleave", handleMouseLeave)
}

const initTiers = (tiers: Tier[]) => {
    if (!tierContainer || !tierSettingsContainer) {
        return
    }
    for (let i = 0; i < tiers.length; i++) {
        const tier = tiers[i]

        if (tierContainer.children.length > i) {
            updateTierRow(i)
        } else {
            createTierRow(tier)
        }

        if (tierSettingsContainer.children.length > i) {
            updateTierSettingsRow(i)
        } else {
            createTierSettingsRow(tier)
        }
    }
}

const createTierRow = (tier: Tier) => {
    const {label, hexColor} = tier

    if (!tierContainer) {
        return
    }

    const tierLabel = document.createElement("span")
    tierLabel.innerText = label

    const tierLevel = document.createElement("div")
    tierLevel.classList.add("tier-level")
    tierLevel.style.backgroundColor = hexColor
    tierLevel.appendChild(tierLabel)

    const tierContent = document.createElement("div")
    tierContent.classList.add("tier-content", "drag-target-container")

    const tierRow = document.createElement("div")
    tierRow.classList.add("tier-row")
    tierRow.appendChild(tierLevel)
    tierRow.appendChild(tierContent)

    tierContainer.appendChild(tierRow)
}

const updateTierRow = (index: number) => {
    const tierRow = tierContainer?.children[index]
    const tier = tiersArray[index]
    if (!tierRow || !tier) {
        return
    }

    const {children} = tierRow
    const {label, hexColor} = tier

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

const removeTierRow = (index: number) => {
    if (!tierContainer) {
        return
    }
    const tierRow = tierContainer.children[index]
    if (!tierRow) {
        return
    }
    tierContainer.removeChild(tierRow)
}

const createTierSettingsRow = (tier: Tier, focus: boolean = false) => {
    const {id: tierId, label, hexColor} = tier

    if (!tierSettingsContainer) {
        return
    }

    const tierColorInput = document.createElement("input")
    tierColorInput.setAttribute("type", "color")
    tierColorInput.setAttribute("value", hexColor)
    tierColorInput.classList.add("tier-settings-color-input")
    tierColorInput.hidden = true

    const tierColorInputLabel = document.createElement("label")
    tierColorInputLabel.classList.add("tier-settings-color-input-label")
    tierColorInputLabel.style.backgroundColor = hexColor
    tierColorInputLabel.appendChild(tierColorInput)

    const tierLabelInput = document.createElement("input")
    tierLabelInput.classList.add("tier-settings-label-input")
    tierLabelInput.value = label

    tierColorInput.addEventListener("input", () => {
        tierColorInputLabel.style.backgroundColor = tierColorInput.value

        const index = tiersArray.findIndex(tier => tier.id === tierId)
        tiersArray[index] = {id: tierId, label: tierLabelInput.value, hexColor: tierColorInput.value}
        updateTierRow(index)
    })

    tierLabelInput.addEventListener("input", () => {

        const index = tiersArray.findIndex(tier => tier.id === tierId)
        tiersArray[index] = {id: tierId, label: tierLabelInput.value, hexColor: tierColorInput.value}
        updateTierRow(index)
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

        const index = tiersArray.findIndex(tier => tier.id === tierId)
        tiersArray.splice(index, 1)
        removeTierRow(index)
        removeTierSettingsRow(index)
    })

    const tierSettingsRow = document.createElement("div")
    tierSettingsRow.classList.add("tier-settings-row")
    tierSettingsRow.appendChild(tierColorInputLabel)
    tierSettingsRow.appendChild(tierLabelInput)
    tierSettingsRow.appendChild(deleteButton)

    tierSettingsContainer.appendChild(tierSettingsRow)

    if (focus) {
        tierLabelInput.focus()
    }
}

const updateTierSettingsRow = (index: number) => {
    const tierSettingsRow = tierSettingsContainer?.children[index]
    const tier = tiersArray[index]
    if (!tierSettingsRow || !tier) {
        return
    }

    const {children} = tierSettingsRow
    const {label, hexColor} = tier

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

const removeTierSettingsRow = (index: number) => {
    if (!tierSettingsContainer) {
        return
    }
    const tierSettingsRow = tierSettingsContainer.children[index]
    if (!tierSettingsRow) {
        return
    }
    tierSettingsContainer.removeChild(tierSettingsRow)
}

const initSettingsModal = () => {
    const openButton = document.getElementById("settings-modal-open-button")

    const newTierColorInputLabel = document.getElementById("new-tier-color-input-label") as HTMLLabelElement | null
    const newTierColorInput = document.getElementById("new-tier-color-input") as HTMLInputElement | null
    const newTierLabelInput = document.getElementById("new-tier-label-input") as HTMLInputElement | null
    const newTierAddButton = document.getElementById("new-tier-add-button") as HTMLDivElement | null

    if (!settingsModal || !openButton || !newTierColorInputLabel || !newTierColorInput || !newTierLabelInput || !newTierAddButton) {
        return
    }

    const initNewTierInputValues = () => {
        newTierColorInput.value = getRandomColor()
        newTierColorInputLabel.style.backgroundColor = newTierColorInput.value
        newTierLabelInput.value = ""
    }

    const createNewTier = () => {
        const newTier = {id: crypto.randomUUID(), label: newTierLabelInput.value, hexColor: newTierColorInput.value}
        tiersArray.push(newTier)
        createTierRow(newTier)
        createTierSettingsRow(newTier, true)
        initNewTierInputValues()
    }

    const openSettingsModal = () => {
        settingsModal.classList.remove("hide")
        initNewTierInputValues()
    }

    const hideSettingsModal = () => {
        settingsModal.classList.add("hide")
    }

    openButton.addEventListener("click", (e) => {
        e.stopPropagation()
        openSettingsModal()
    })


    newTierColorInput.addEventListener("input", () => {
        newTierColorInputLabel.style.backgroundColor = newTierColorInput.value
    })

    newTierLabelInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") {
            return
        }
        createNewTier()
    })

    newTierAddButton.addEventListener("click", () => {
        createNewTier()
    })

    window.addEventListener("keyup", (e) => {
        if (e.key !== "Escape") {
            return
        }
        if (settingsModal.classList.contains("hide")) {
            return
        }
        hideSettingsModal()
    })

    window.addEventListener("click", (mouseEvent) => {
        const {clientX: mouseX, clientY: mouseY} = mouseEvent

        const isHidden = settingsModal.classList.contains("hide")
        if (isHidden) {
            return
        }

        const modalContentElements = settingsModal.getElementsByClassName("modal-content")
        if (!modalContentElements.length) {
            return
        }

        const settingsModalContent = modalContentElements[0] as HTMLDivElement
        const {x, y, height, width} = settingsModalContent.getBoundingClientRect()

        const isClickOutsideModalContent = mouseX < x || mouseX > x + width || mouseY < y || mouseY > y + height
        if (!isClickOutsideModalContent) {
            return
        }

        hideSettingsModal()
    })

    if (isDevMode) {
        openSettingsModal()
    }
}

const initModals = () => {
    initSettingsModal()
}

initTiers(tiersArray)
initDragging()
initFooterToggle()
initModals()
initExport()