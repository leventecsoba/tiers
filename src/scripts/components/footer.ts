import {ElementID} from "../constants"
import {dom} from "../dom"

const _TIMEOUT = 2000

const footerElement = dom.get<HTMLDivElement>(ElementID.FOOTER)
const footerToggleElement = dom.get<HTMLDivElement>(ElementID.FOOTER_TOGGLE)

let timeout: ReturnType<typeof setTimeout> | null = null

const openFooter = () => {
    footerElement?.classList.remove("hide", "blur")
}

const blurFooter = () => {
    footerElement?.classList.add("blur")
}

const hideFooter = () => {
    footerElement?.classList.add("hide")
}

const handleClick = () => {
    if (!footerElement) {
        return
    }
    const isHidden = footerElement.classList.contains("hide")
    if (isHidden) {
        openFooter()
    } else {
        hideFooter()
    }
}

const handleMouseEnter = () => {
    openFooter()
    if (timeout === null) {
        return
    }
    clearTimeout(timeout)
    timeout = null
}

const handleMouseLeave = () => {
    blurFooter()
    timeout = setTimeout(hideFooter, _TIMEOUT)
}


export const initFooter = () => {
    if (!footerElement || !footerToggleElement) {
        return
    }
    footerElement.addEventListener("mouseenter", handleMouseEnter)
    footerElement.addEventListener("mouseleave", handleMouseLeave)
    footerToggleElement.addEventListener("click", handleClick)
}