import {getDataURIFromFile, getTestFile} from "./utils"

// @ts-ignore
const isDevMode = import.meta.env.DEV

interface Draggable {
    id: string
    file: File
}

let selectedDraggable: Draggable | null = null

const createDraggable = async (file: File) => {
    const draggableContainer = document.getElementById("button-container") as HTMLDivElement | null
    if (!draggableContainer) {
        return
    }

    const dataURI = await getDataURIFromFile(file)
    if (!dataURI) {
        return
    }

    const draggable: Draggable = {id: crypto.randomUUID(), file}

    const buttonWrapper = document.createElement("div")
    buttonWrapper.classList.add("button-wrapper")
    buttonWrapper.draggable = false

    buttonWrapper.addEventListener("drag", (e) => {
        e.preventDefault()
        e.stopPropagation()
    })

    buttonWrapper.addEventListener("mousedown", () => {
        selectedDraggable = draggable
    })

    const buttonContent = document.createElement("img")
    buttonContent.classList.add("button-content")
    buttonContent.draggable = false
    buttonContent.src = dataURI;

    buttonContent.addEventListener("drag", (e) => {
        e.preventDefault()
        e.stopPropagation()
    })

    buttonWrapper.appendChild(buttonContent)
    draggableContainer.appendChild(buttonWrapper)
}

const createDraggedElement = async (draggable: Draggable, initialXPosition: number, initialYPosition: number) => {
    const draggedElementContainer = document.getElementById("dragged-container")
    if (!draggedElementContainer) {
        return
    }

    const dataURI = await getDataURIFromFile(draggable.file)
    if (!dataURI) {
        return
    }

    const dragged = document.createElement("div")
    dragged.setAttribute("id", "dragged")
    dragged.style.left = `calc(${initialXPosition}px - 5rem)`
    dragged.style.top = `calc(${initialYPosition}px - 5rem)`

    const draggedImage = document.createElement("img")
    draggedImage.setAttribute("id", "dragged-img")
    draggedImage.src = dataURI

    dragged.appendChild(draggedImage)
    draggedElementContainer.appendChild(dragged)
}

const dropDraggedElement = async (draggable: Draggable) => {
    const dragTarget = document.getElementById("drag-target")
    if (!dragTarget?.parentElement) {
        return
    }

    const dataURI = await getDataURIFromFile(draggable.file)
    if (!dataURI) {
        return
    }

    const tierContentItem = document.createElement("img")
    tierContentItem.classList.add("tier-content-item")
    tierContentItem.src = dataURI
    tierContentItem.draggable = false

    tierContentItem.addEventListener("drag", (e) => {
        e.preventDefault()
        e.stopPropagation()
    })

    tierContentItem.addEventListener("mousedown", () => {
        selectedDraggable = draggable
        tierContentItem.setAttribute("id", "drag-source")
    })

    dragTarget.parentElement.replaceChild(tierContentItem, dragTarget)
}

const createDragTarget = (dragTargetContainer: Element) => {
    const existingDragTarget = document.getElementById("drag-target")
    if (existingDragTarget) {
        return
    }
    const dragTarget = document.createElement("div")
    dragTarget.setAttribute("id", "drag-target")
    dragTargetContainer.appendChild(dragTarget)
}

const destroyDragTarget = (dragTargetContainer: Element) => {
    const dragTarget = dragTargetContainer.querySelector("#drag-target")
    if (!dragTarget) {
        return
    }
    dragTargetContainer.removeChild(dragTarget)
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

    selectedDraggable = null
}

const initDraggingEvents = () => {
    const handleMouseUp = async () => {
        if (!selectedDraggable) {
            return
        }
        await dropDraggedElement(selectedDraggable)
        resetDraggingProperties()
    }

    const handleMouseDown = async (e: MouseEvent) => {
        const {pageX, pageY, clientX, clientY} = e

        if (!selectedDraggable) {
            return
        }

        const draggedElement = document.getElementById("dragged")
        if (!draggedElement) {
            await createDraggedElement(selectedDraggable, pageX, pageY)
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
    }

    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mousemove", handleMouseDown)
}

const handleDraggableFileInputChange = async (e: Event) => {
    const {files} = e.target as HTMLInputElement
    if (!files) {
        return
    }
    const filesArray = Array.from(files)
    for (const file of filesArray) {
        await createDraggable(file)
    }
}

const initDraggableFileInput = async () => {
    const draggableFileInput = document.getElementById("add-button-input")
    if (!draggableFileInput) {
        return
    }

    draggableFileInput.addEventListener("change", handleDraggableFileInputChange)
}

const handleDraggableContainerPaste = async (e: ClipboardEvent) => {
    const {clipboardData} = e
    if (!clipboardData) {
        return
    }
    const clipboardDataItems = Array.from(clipboardData.items)
    for (const item of clipboardDataItems) {
        const file = item.getAsFile()
        if (!file) {
            continue
        }
        await createDraggable(file)
    }
}

const initDraggableContainer = async () => {

    const handlePaste = async (e: ClipboardEvent) => {
        const footer = document.getElementById("footer")
        if (!footer) {
            return
        }

        const isBlurred = footer.classList.contains("blur")
        if (isBlurred) {
            return
        }

        await handleDraggableContainerPaste(e)
    }

    window.addEventListener("paste", handlePaste)
}

export const initDragging = async () => {
    await initDraggableFileInput()
    await initDraggableContainer()
    initDraggingEvents()

    if (isDevMode) {
        const testFile = getTestFile()
        await createDraggable(testFile)
    }
}