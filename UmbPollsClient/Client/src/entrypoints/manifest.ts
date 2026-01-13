export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Umb Polls Client Entrypoint",
    alias: "UmbPollsClient.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
