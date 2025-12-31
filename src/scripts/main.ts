import {initImageBackgroundColorInput} from "./components/imageBackgroundColorInput"
import {initTierSettingsRows} from "./components/tierSettingsRow"
import {initSettingsModal} from "./components/settingsModal"
import {initNewTierInput} from "./components/newTierInput"
import {initTierRows} from "./components/tierRow"
import {initFooter} from "./components/footer"

import {initDragging} from "./dragging"
import {initExport} from "./export"
import {tierState} from "./state"

const tiers = [
    {id: crypto.randomUUID(), label: "S", hexColor: "#fe7f7f"},
    {id: crypto.randomUUID(), label: "A", hexColor: "#FFBF7F"},
    {id: crypto.randomUUID(), label: "B", hexColor: "#FEDF81"},
    {id: crypto.randomUUID(), label: "C", hexColor: "#FEFE7F"},
    {id: crypto.randomUUID(), label: "D", hexColor: "#BEFF7E"},
    {id: crypto.randomUUID(), label: "E", hexColor: "#7EFE7F"}
]

initDragging()
initExport()

// TODO:
// Event delegation (for draggable elements) - performance and scalability

initFooter()
initImageBackgroundColorInput()
initSettingsModal()
initNewTierInput()
initTierRows()
initTierSettingsRows()

tiers.forEach((tier) => {
    tierState.add(tier)
})
