import { initExport } from "./export"
import {getRandomColor} from "./utils"

const tierContainer = document.getElementById("tier-container") as HTMLDivElement | null
const tierSettingsContainer = document.getElementById("tier-settings-container") as HTMLDivElement | null
const settingsModal = document.getElementById("settings-modal") as HTMLDivElement | null
const buttonContainer = document.getElementById("button-container") as HTMLDivElement | null
const addButtonInput = document.getElementById("add-button-input") as HTMLInputElement | null
const draggableContainer = document.getElementById("draggable-container") as HTMLDivElement | null

const _PEEPO_CLAP = "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"
const _HIDE_FOOTER_TIMEOUT = 2000

let isDragging: boolean = false
let draggedElementObjectURL: string | null = null

interface Tier {
    id: string
    label: string
    hexColor: string
}

let tiersArray: Tier[] = [
    {id: crypto.randomUUID(), label: "S", hexColor: "#fe7f7f"},
    {id: crypto.randomUUID(), label: "A", hexColor: "#FFBF7F"},
    {id: crypto.randomUUID(), label: "B", hexColor: "#FEDF81"},
    {id: crypto.randomUUID(), label: "C", hexColor: "#FEFE7F"},
    {id: crypto.randomUUID(), label: "D", hexColor: "#BEFF7E"},
    {id: crypto.randomUUID(), label: "E", hexColor: "#7EFE7F"}
]

const initAddButton = async () => {
    if (!addButtonInput || !buttonContainer) {
        return
    }

    const handleChange = async () => {
        if (!addButtonInput.files) {
            return
        }

        const filesArray = Array.from(addButtonInput.files)
        for (const file of filesArray) {
            initImageButton(file)
        }
    }

    addButtonInput.addEventListener("change", handleChange)

    const testFile = initTestFile()
    initImageButton(testFile)
}

const initTestFile = () => {
    const fileContent = atob(_PEEPO_CLAP)
    const buffer = new ArrayBuffer(fileContent.length)
    const view = new Uint8Array(buffer)
    for (let i = 0; i < fileContent.length; i++) {
        view[i] = fileContent.charCodeAt(i);
    }
    return new File([buffer], "peepoclap.gif", {type: "image/gif"})
}

const initImageButton = (file: Blob) => {
    if(!buttonContainer) {
        return
    }

    const objectURL = URL.createObjectURL(file)

    const buttonWrapper = document.createElement("div")
    buttonWrapper.classList.add("button-wrapper")
    buttonWrapper.draggable = false

    buttonWrapper.addEventListener("drag", (e) => {
        e.preventDefault()
        e.stopPropagation()
    })

    buttonWrapper.addEventListener("mousedown", () => {
        isDragging = true
        draggedElementObjectURL = objectURL
    })

    const buttonContent = document.createElement("img")
    buttonContent.classList.add("button-content")
    buttonContent.draggable = false
    buttonContent.src = objectURL

    buttonContent.addEventListener("drag", (e) => {
        e.preventDefault()
        e.stopPropagation()
    })

    buttonWrapper.appendChild(buttonContent)
    buttonContainer.appendChild(buttonWrapper)
}

const createDraggedElement = (objectURL: string, initialXPosition: number, initialYPosition: number) => {
    if (!draggableContainer) {
        return
    }

    const dragged = document.createElement("div")
    dragged.setAttribute("id", "dragged")
    dragged.style.left = `calc(${initialXPosition}px - 5rem)`
    dragged.style.top = `calc(${initialYPosition}px - 5rem)`

    const draggedImage = document.createElement("img")
    draggedImage.setAttribute("id", "dragged-img")
    draggedImage.src = objectURL

    dragged.appendChild(draggedImage)
    draggableContainer.appendChild(dragged)
}

const createDragTarget = (dragTargetContainer: Element) => {
    const existingDragTarget = Array.from(dragTargetContainer.children).find((e) => e.id === "drag-target")
    if (existingDragTarget) {
        return
    }
    const dragTarget = document.createElement("div")
    dragTarget.setAttribute("id", "drag-target")
    dragTargetContainer.appendChild(dragTarget)
}

const destroyDragTarget = (dragTargetContainer: Element) => {
    const dragTarget = Array.from(dragTargetContainer.children).find((e) => e.id === "drag-target")
    if (dragTarget) {
        dragTargetContainer.removeChild(dragTarget)
    }
}

const createTierContentItem = (dragTargetContainer: Element, objectURL: string) => {
    const tierContentItem = document.createElement("img")
    tierContentItem.classList.add("tier-content-item")
    tierContentItem.src = objectURL
    tierContentItem.draggable = false

    tierContentItem.addEventListener("drag", (e) => {
        e.preventDefault()
        e.stopPropagation()
    })

    tierContentItem.addEventListener("mousedown", () => {
        isDragging = true
        draggedElementObjectURL = objectURL
        tierContentItem.setAttribute("id", "drag-source")
    })

    const dragTarget = Array.from(dragTargetContainer.children).find((e) => e.id === "drag-target")
    if (!dragTarget) {
        return
    }
    dragTargetContainer.replaceChild(tierContentItem, dragTarget)
}

const resetDraggingProperties = () => {
    const draggedElement = document.getElementById("dragged")
    const draggedElementContainer = draggedElement?.parentElement
    if (draggedElementContainer) {
        draggedElementContainer.removeChild(draggedElement)
    }

    const dragSource = document.getElementById("drag-source")
    const dragSourceContainer = dragSource?.parentElement
    if (dragSourceContainer) {
        dragSourceContainer.removeChild(dragSource)
    }

    if (draggedElementObjectURL) {
        // URL.revokeObjectURL(draggedElementObjectURL)
        draggedElementObjectURL = null
    }

    isDragging = false
}

const initDragging = () => {
    window.addEventListener("mouseup", () => {
        if (!isDragging || !draggedElementObjectURL) {
            return
        }

        const dragTarget = document.getElementById("drag-target")
        const dragTargetContainer = dragTarget?.parentElement
        if (!dragTargetContainer) {
            resetDraggingProperties()
            return
        }

        createTierContentItem(dragTargetContainer, draggedElementObjectURL)
        resetDraggingProperties()
    })

    window.addEventListener("mousemove", (e) => {
        const {pageX, pageY, clientX, clientY} = e

        if (!isDragging || !draggedElementObjectURL) {
            return
        }

        const draggedElement = document.getElementById("dragged")
        if (!draggedElement) {
            createDraggedElement(draggedElementObjectURL, pageX, pageY)
            return
        }
        
        draggedElement.style.left = `calc(${pageX}px - 5rem)`
        draggedElement.style.top = `calc(${pageY}px - 5rem)`

        const dragTargetContainers = document.getElementsByClassName("drag-target-container")
        for (const dragTargetContainer of Array.from(dragTargetContainers)) {
            const dragTargetContainerBoundingRect = dragTargetContainer.getBoundingClientRect()

            const {x: dragTargetContainerX, y: dragTargetContainerY} = dragTargetContainerBoundingRect
            const {width: dragTargetContainerWidth, height: dragTargetContainerHeight} = dragTargetContainerBoundingRect

            const doesXOverlap = clientX > dragTargetContainerX && clientX < dragTargetContainerX + dragTargetContainerWidth
            const doesYOverlap = clientY > dragTargetContainerY && clientY < dragTargetContainerY + dragTargetContainerHeight

            if (doesXOverlap && doesYOverlap) {
                createDragTarget(dragTargetContainer)
            } else {
                destroyDragTarget(dragTargetContainer)
            }
        }
    })
}

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

const handleFooterPasteEvent = (pasteEvent: ClipboardEvent) => {
    const footer = document.getElementById("footer")
    const buttonContainer = document.getElementById("button-container")
    if (!footer || !buttonContainer) {
        return
    }

    const isBlurred = footer.classList.contains("blur")
    if (isBlurred) {
        return
    }

    const {clipboardData} = pasteEvent
    if (!clipboardData) {
        return
    }

    const clipboardDataItems = Array.from(clipboardData.items)
    for (const item of clipboardDataItems) {
        const file = item.getAsFile()
        if (!file) {
            continue
        }
        initImageButton(file)
    }
}

const initPasteHandler = () => {
    window.addEventListener("paste", handleFooterPasteEvent)
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


    // TEMP --> FOR TESTING
    openSettingsModal()
}

const initModals = () => {
    initSettingsModal()
}

initTiers(tiersArray)
initAddButton()
initDragging()
initFooterToggle()
initPasteHandler()
initModals()
initExport()