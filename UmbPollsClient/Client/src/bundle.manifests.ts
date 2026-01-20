import { manifests as entrypoints } from "./entrypoints/manifest.js";
import { manifests as tree } from "./settingsTree/manifest.js";
import { manifests as pickers } from "./picker/manifest.js";
import { manifests as workspaces } from "./workspace/manifest.js";


// Job of the bundle is to collate all the manifests from different parts of the extension and load other manifests
// We load this bundle from umbraco-package.json
export const manifests: Array<UmbExtensionManifest> = [...entrypoints, ...tree,...pickers,...workspaces];
