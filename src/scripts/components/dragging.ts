import { addDraggable, getSelectedDraggable, setSelectedDraggableId } from '../state/draggable'

import { Draggable, ElementID, isDevMode } from '../constants'
import { getDataURIFromFile, getTestFile } from '../utils'
import { dom } from '../dom'

const dragGhostContainerElement = dom.get<HTMLDivElement>(ElementID.DRAG_GHOST_CONTAINER)
const draggableContainerElement = dom.get<HTMLDivElement>(ElementID.DRAGGABLE_CONTAINER)
const fileInputElement = dom.get<HTMLInputElement>(ElementID.FILE_INPUT)
const footerElement = dom.get<HTMLDivElement>(ElementID.FOOTER)

const createDraggableElement = (draggable: Draggable) => {
  if (!draggableContainerElement) {
    return
  }

  const buttonWrapper = document.createElement('div')
  buttonWrapper.classList.add('button-wrapper', 'draggable')
  buttonWrapper.draggable = false
  buttonWrapper.dataset.draggableId = draggable.id

  buttonWrapper.addEventListener('drag', (e) => {
    e.preventDefault()
    e.stopPropagation()
  })

  const buttonContent = document.createElement('img')
  buttonContent.classList.add('button-content')
  buttonContent.draggable = false
  buttonContent.src = draggable.dataURI

  buttonContent.addEventListener('drag', (e) => {
    e.preventDefault()
    e.stopPropagation()
  })

  buttonWrapper.appendChild(buttonContent)
  draggableContainerElement.appendChild(buttonWrapper)
}

const createDragGhost = (draggable: Draggable, initialXPosition: number, initialYPosition: number) => {
  if (!dragGhostContainerElement) {
    return
  }

  const dragGhost = document.createElement('div')
  dragGhost.setAttribute('id', 'drag-ghost')
  dragGhost.style.left = `calc(${initialXPosition}px - 5rem)`
  dragGhost.style.top = `calc(${initialYPosition}px - 5rem)`

  const dragGhostImage = document.createElement('img')
  dragGhostImage.setAttribute('id', 'drag-ghost-image')
  dragGhostImage.src = draggable.dataURI

  dragGhost.appendChild(dragGhostImage)
  dragGhostContainerElement.appendChild(dragGhost)
}

const removeDragGhost = () => {
  const dragGhostElement = document.getElementById('drag-ghost')
  const dragGhostContainerElement = dragGhostElement?.parentElement
  if (!dragGhostContainerElement) {
    return
  }
  dragGhostContainerElement.removeChild(dragGhostElement)
}

const createDragTarget = (dragTargetContainer: Element) => {
  const dragTarget = document.createElement('div')
  dragTarget.setAttribute('id', 'drag-target')
  dragTargetContainer.appendChild(dragTarget)
}

const removeDragTarget = (dragTargetElement: HTMLDivElement) => {
  const dragTargetContainerElement = dragTargetElement?.parentElement
  if (!dragTargetContainerElement) {
    return
  }
  dragTargetContainerElement.removeChild(dragTargetElement)
}

const createTierContentItem = (draggable: Draggable) => {
  const dragTargetElement = document.getElementById('drag-target')
  const dragTargetContainerElement = dragTargetElement?.parentElement
  if (!dragTargetContainerElement) {
    return
  }

  const tierContentItem = document.createElement('img')
  tierContentItem.classList.add('tier-content-item')
  tierContentItem.src = draggable.dataURI
  tierContentItem.draggable = false
  tierContentItem.dataset.draggableId = draggable.id

  tierContentItem.addEventListener('drag', (e) => {
    e.preventDefault()
    e.stopPropagation()
  })

  dragTargetContainerElement.replaceChild(tierContentItem, dragTargetElement)
}

const removeDragSource = () => {
  const dragSourceElement = document.getElementById('drag-source')
  const dragSourceContainerElement = dragSourceElement?.parentElement
  if (!dragSourceContainerElement) {
    return
  }
  dragSourceContainerElement.removeChild(dragSourceElement)
}

const getHoveredDragTargetContainerElement = (clientX: number, clientY: number) => {
  const dragTargetContainerElements = document.getElementsByClassName('drag-target-container')
  for (const dragTargetContainerElement of Array.from(dragTargetContainerElements)) {
    const boundingRect = dragTargetContainerElement.getBoundingClientRect()
    const { x, y, width, height } = boundingRect

    const doesXOverlap = clientX > x && clientX < x + width
    const doesYOverlap = clientY > y && clientY < y + height

    if (doesXOverlap && doesYOverlap) {
      return dragTargetContainerElement
    }
  }

  return null
}

const handleMouseUp = () => {
  const draggable = getSelectedDraggable()
  if (!draggable) {
    return
  }

  createTierContentItem(draggable)
  removeDragGhost()
  removeDragSource()

  setSelectedDraggableId(null)
}

const handleMouseMove = (e: MouseEvent) => {
  const { pageX, pageY, clientX, clientY } = e

  const draggable = getSelectedDraggable()
  if (!draggable) {
    return
  }

  const dragGhost = document.getElementById('drag-ghost')
  if (!dragGhost) {
    createDragGhost(draggable, pageX, pageY)
    return
  }

  dragGhost.style.left = `calc(${pageX}px - 5rem)`
  dragGhost.style.top = `calc(${pageY}px - 5rem)`

  const dragTargetElement = document.getElementById('drag-target') as HTMLDivElement
  const hoveredDragTargetContainerElement = getHoveredDragTargetContainerElement(clientX, clientY)

  if (hoveredDragTargetContainerElement) {
    if (!dragTargetElement) {
      createDragTarget(hoveredDragTargetContainerElement)
    } else if (dragTargetElement.parentElement !== hoveredDragTargetContainerElement) {
      hoveredDragTargetContainerElement.appendChild(dragTargetElement)
    }
  } else if (dragTargetElement) {
    removeDragTarget(dragTargetElement)
  }
}

const handleChange = async () => {
  if (!fileInputElement) {
    return
  }

  const { files } = fileInputElement
  if (!files) {
    return
  }

  const filesArray = Array.from(files)
  for (const file of filesArray) {
    const dataURI = await getDataURIFromFile(file)
    if (!dataURI) {
      continue
    }

    const draggable = addDraggable({ dataURI })
    createDraggableElement(draggable)
  }
}

const handlePaste = async (e: ClipboardEvent) => {
  if (!footerElement) {
    return
  }

  const isBlurred = footerElement.classList.contains('blur')
  if (isBlurred) {
    return
  }

  const { clipboardData } = e
  if (!clipboardData) {
    return
  }

  const clipboardDataItems = Array.from(clipboardData.items)
  for (const item of clipboardDataItems) {
    const file = item.getAsFile()
    if (!file) {
      continue
    }

    const dataURI = await getDataURIFromFile(file)
    if (!dataURI) {
      continue
    }

    const draggable = addDraggable({ dataURI })
    createDraggableElement(draggable)
  }
}

const handleDraggableContainerMouseDown = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const draggableElement = target.closest<HTMLDivElement>('.draggable')
  if (!draggableElement) {
    return
  }

  const { draggableId } = draggableElement.dataset
  if (!draggableId) {
    return
  }

  setSelectedDraggableId(draggableId)
}

const handleMouseDown = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const tierContentItemElement = target.closest<HTMLImageElement>('.tier-content-item')
  if (!tierContentItemElement) {
    return
  }

  const { draggableId } = tierContentItemElement.dataset
  if (!draggableId) {
    return
  }

  setSelectedDraggableId(draggableId)

  tierContentItemElement.setAttribute('id', 'drag-source')
}

export const initDraggingComponents = async () => {
  if (!fileInputElement || !draggableContainerElement) {
    return
  }

  fileInputElement.addEventListener('change', handleChange)
  draggableContainerElement.addEventListener('mousedown', handleDraggableContainerMouseDown)

  window.addEventListener('paste', handlePaste)
  window.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)

  if (isDevMode) {
    const testFile = getTestFile()

    const dataURI = await getDataURIFromFile(testFile)
    if (!dataURI) {
      return
    }

    const draggable = addDraggable({ dataURI })
    createDraggableElement(draggable)
  }
}
