import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbUniqueTreeStore } from "@umbraco-cms/backoffice/tree";

export class PollTreeStore extends UmbUniqueTreeStore {
  constructor(host: UmbControllerHost) {
    super(host, POLL_TREE_STORE_CONTEXT.toString());
  }
}

export { PollTreeStore as api };

export const POLL_TREE_STORE_CONTEXT = new UmbContextToken<PollTreeStore>(
  "POLL_TREE_STORE_CONTEXT"
);
