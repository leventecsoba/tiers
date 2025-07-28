let isDragging: boolean = false
let draggedElementObjectURL: string | null = null

const PEEPO_CLAP = "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"

const initAddButton = () => {
    const addButtonInput = document.getElementById("add-button-input") as HTMLInputElement
    const buttonContainer = document.getElementById("button-container")
    if (!addButtonInput || !buttonContainer) {
        return
    }
    addButtonInput.addEventListener("change", () => {
        if (!addButtonInput.files) {
            return
        }
        const filesArray = Array.from(addButtonInput.files)
        for (const file of filesArray) {
            const imageButton = initImageButton(file)
            buttonContainer.appendChild(imageButton)
        }
    })

    const testFile = initTestFile()
    const imageButton = initImageButton(testFile)
    buttonContainer.appendChild(imageButton)
}

const initTestFile = () => {
    const fileContent = atob(PEEPO_CLAP)
    const buffer = new ArrayBuffer(fileContent.length)
    const view = new Uint8Array(buffer)
    for (let i = 0; i < fileContent.length; i++) {
        view[i] = fileContent.charCodeAt(i);
    }
    return new File([buffer], "peepoclap.gif", {type: "image/gif"})
}

const initImageButton = (file: File): HTMLDivElement => {
    const container = document.createElement("div")
    container.classList.add("image-button-container")
    container.draggable = false

    container.addEventListener("drag", (e) => {
        e.preventDefault()
        e.stopPropagation()
    })

    container.addEventListener("mousedown", () => {
        isDragging = true
        draggedElementObjectURL = URL.createObjectURL(file)
    })

    const div = document.createElement("div")
    const backgroundImageObjectURL = URL.createObjectURL(file)
    div.style.background = `url(${backgroundImageObjectURL}) center center / contain no-repeat var(--ternary-color)`
    div.classList.add("image-button")
    div.draggable = false

    div.addEventListener("drag", (e) => {
        e.preventDefault()
        e.stopPropagation()
    })

    container.appendChild(div)
    return container
}

const createDraggableElement = (objectURL: string, initialXPosition: number, initialYPosition: number) => {
    const dragged = document.createElement("div")
    dragged.setAttribute("id", "dragged")
    dragged.style.left = `calc(${initialXPosition}px - 5rem)`
    dragged.style.top = `calc(${initialYPosition}px - 5rem)`

    const draggedImage = document.createElement("div")
    draggedImage.setAttribute("id", "dragged-img")
    draggedImage.style.background = `url(${objectURL}) center center / contain no-repeat var(--ternary-color)`
    dragged.appendChild(draggedImage)

    const container = document.getElementById("draggable-container")
    if (!container) {
        return null
    }
    container.appendChild(dragged)
}

const createTierContentPlaceholder = (tierContent: Element) => {
    const existingPlaceholder = [...tierContent.children].find((e) => e.id === "tier-content-placeholder")
    if (existingPlaceholder) {
        return
    }
    const placeholder = document.createElement("div")
    placeholder.setAttribute("id", "tier-content-placeholder")
    tierContent.appendChild(placeholder)
}

const destroyTierContentPlaceholder = (tierContent: Element) => {
    const placeholder = [...tierContent.children].find((e) => e.id === "tier-content-placeholder")
    if (placeholder) {
        tierContent.removeChild(placeholder)
    }
}

const createTierContentItem = (tierContent: Element, objectURL: string) => {
    const tierContentItem = document.createElement("div")
    tierContentItem.classList.add("tier-content-item")
    tierContentItem.style.background = `url(${objectURL}) center center / contain no-repeat var(--ternary-color)`

    const placeholder = [...tierContent.children].find((e) => e.id === "tier-content-placeholder")
    if (!placeholder) {
        return
    }
    tierContent.replaceChild(tierContentItem, placeholder)
}

const resetDraggingProperties = () => {
    const container = document.getElementById("draggable-container")
    const draggedElement = document.getElementById("dragged")
    if (container && draggedElement) {
        container.removeChild(draggedElement)
    }

    if (draggedElementObjectURL) {
        URL.revokeObjectURL(draggedElementObjectURL)
    }
    draggedElementObjectURL = null

    isDragging = false
}

const initDragging = () => {
    window.addEventListener("mouseup", () => {
        if (!isDragging) {
            resetDraggingProperties()
            return
        }

        const tierContentPlaceholder = document.getElementById("tier-content-placeholder")
        const tierContent = tierContentPlaceholder?.parentElement
        if (!tierContent) {
            resetDraggingProperties()
            return
        }

        if (draggedElementObjectURL) {
            createTierContentItem(tierContent, draggedElementObjectURL)
        } else {
            destroyTierContentPlaceholder(tierContent)
        }

        resetDraggingProperties()
    })

    window.addEventListener("mousemove", (e) => {
        if (!isDragging || !draggedElementObjectURL) {
            return
        }
        const draggedElement = document.getElementById("dragged")
        if (!draggedElement) {
            createDraggableElement(draggedElementObjectURL, e.clientX, e.clientY)
            return
        }
        draggedElement.style.left = `calc(${e.clientX}px - 5rem)`
        draggedElement.style.top = `calc(${e.clientY}px - 5rem)`

        const tierContents = document.getElementsByClassName("tier-content")
        for (const tierContent of tierContents) {
            const tierContentBoundingRect = tierContent.getBoundingClientRect()

            const doesXOverlap = e.clientX > tierContentBoundingRect.x && e.clientX < tierContentBoundingRect.x + tierContentBoundingRect.width
            const doesYOverlap = e.clientY > tierContentBoundingRect.y && e.clientY < tierContentBoundingRect.y + tierContentBoundingRect.height

            if (doesXOverlap && doesYOverlap) {
                createTierContentPlaceholder(tierContent)
            } else {
                destroyTierContentPlaceholder(tierContent)
            }
        }
    })
}

initAddButton()
initDragging()