
const pollPicker: UmbExtensionManifest = {
    type: 'propertyEditorUi',
    alias: 'Umbraco.Community.Polls',
    name: 'Poll Picker Property Editor UI',
    js: () => import("../picker/poll-picker.js"),
    "elementName": "mediawiz-poll-picker",
    meta: {
        label: 'Poll Picker',
        propertyEditorSchemaAlias: 'Umbraco.Plain.Json',
        icon: 'icon-bar-chart',
        group: 'pickers',
        supportsReadOnly: true
    }
}
const pickerModalManifest: UmbExtensionManifest = {
    type: 'modal',
    alias: 'Poll.Modal',
    name: 'Poll Modal',
    element: () => import('./poll-picker-modal.js')
}

export const manifests: Array<UmbExtensionManifest> = [
    pollPicker,
    pickerModalManifest,
];