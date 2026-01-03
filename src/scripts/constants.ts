export const ElementID = {
    TIER_CONTAINER: "tier-container",
    TIER_SETTINGS_CONTAINER: "tier-settings-container",
    SETTINGS_MODAL: "settings-modal",
    SETTINGS_MODAL_OPEN_BUTTON: "settings-modal-open-button",
    NEW_TIER_COLOR_INPUT_LABEL: "new-tier-color-input-label",
    NEW_TIER_COLOR_INPUT: "new-tier-color-input",
    NEW_TIER_LABEL_INPUT: "new-tier-label-input",
    NEW_TIER_ADD_BUTTON: "new-tier-add-button",
    IMAGE_BACKGROUND_COLOR_INPUT_LABEL: "image-background-color-input-label",
    IMAGE_BACKGROUND_COLOR_INPUT: "image-background-color-input",
    FOOTER: "footer",
    FOOTER_TOGGLE: "footer-toggle",
    DRAGGABLE_CONTAINER: "draggable-container",
    DRAG_GHOST_CONTAINER: "drag-ghost-container",
    FILE_INPUT: "file-input",
    EXPORT_BUTTON: "export-button",
} as const

export type ElementID = (typeof ElementID)[keyof typeof ElementID]

export const isDevMode = import.meta.env.DEV

export interface Tier {
    label: string
    hexColor: string
}

export interface Draggable {
    dataURI: string
}