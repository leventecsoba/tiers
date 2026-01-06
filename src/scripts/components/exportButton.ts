import { ElementID } from '../constants'
import { dom } from '../dom'

const tierContainer = dom.get<HTMLDivElement>(ElementID.TIER_CONTAINER)
const exportButton = dom.get<HTMLDivElement>(ElementID.EXPORT_BUTTON)

const getSerializedStylesheets = () => {
  const styleSheetArray = Array.from(document.styleSheets)
  const cssRulesArray = styleSheetArray
    .map((styleSheet) => {
      try {
        const { cssRules } = styleSheet
        return Array.from(cssRules)
      } catch {
        console.error('Can not access stylesheet')
        return []
      }
    })
    .flat()
  const cssTextArray = cssRulesArray.map(({ cssText }) => cssText)
  return cssTextArray.join(' ')
}

const blobCallback = (blob: Blob | null) => {
  if (!blob) {
    return
  }

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.download = 'tiers.png'
  link.href = url

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const handleLoad = (e: Event) => {
  const image = e.target as HTMLImageElement
  if (!image) {
    return
  }

  const { height, width } = image

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  context.drawImage(image, 0, 0)
  canvas.toBlob(blobCallback, 'image/png')
}

const handleError = () => {
  console.error('Error during loading image')
}

export const exportHTMLElement = (htmlElement: HTMLElement) => {
  const { offsetHeight, offsetWidth } = htmlElement

  const serializer = new XMLSerializer()
  const serializedHTML = serializer.serializeToString(htmlElement)
  const serializedCSS = getSerializedStylesheets()

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${offsetWidth}" height="${offsetHeight}">
      <style type="text/css">
        ${serializedCSS}
      </style>
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="box-sizing: border-box; width: ${offsetWidth}px; height: ${offsetHeight}px;">
          ${serializedHTML}
        </div>
      </foreignObject>
    </svg>
  `

  const image = new Image(offsetWidth, offsetHeight)

  image.addEventListener('load', handleLoad)
  image.addEventListener('error', handleError)

  image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}

const handleClick = () => {
  if (!tierContainer) {
    return
  }
  exportHTMLElement(tierContainer)
}

export const initExportButton = () => {
  if (!exportButton) {
    return
  }
  exportButton.addEventListener('click', handleClick)
}
