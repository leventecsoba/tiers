import {initImageBackgroundColorInput} from "./components/imageBackgroundColorInput"
import {createTierSettingsRowElement} from "./components/tierSettingsRow"
import {initDraggingComponents} from "./components/dragging"
import {initSettingsModal} from "./components/settingsModal"
import {initNewTierInput} from "./components/newTierInput"
import {initExportButton} from "./components/exportButton"
import {createTierRowElement} from "./components/tierRow"
import {initFooter} from "./components/footer"

import {addTier} from "./state/tier"

import {initialTierData} from "./constants"

// Initialize components

initImageBackgroundColorInput()
initDraggingComponents()
initSettingsModal()
initNewTierInput()
initExportButton()
initFooter()

initialTierData.forEach((data) => {
    const tier = addTier(data)
    createTierRowElement(tier)
    createTierSettingsRowElement(tier)
})
