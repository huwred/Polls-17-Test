export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Our Community Polls Entrypoint",
    alias: "MediaWizPolls.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
