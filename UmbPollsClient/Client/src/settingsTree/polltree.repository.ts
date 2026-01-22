import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UmbTreeRepositoryBase } from "@umbraco-cms/backoffice/tree";
import { POLL_TREE_STORE_CONTEXT } from "./polltree.store";
import {
  POLL_TREE_ROOT_ENTITY_TYPE,
  PollTreeItemModel,
  PollTreeRootModel,
} from "./types";
import { PollTreeDataSource } from "./polltree.data-source";

export class PollTreeRepository
    extends UmbTreeRepositoryBase<PollTreeItemModel, PollTreeRootModel>
  implements UmbApi
{
  constructor(host: UmbControllerHost) {
      super(host, PollTreeDataSource, POLL_TREE_STORE_CONTEXT);
      console.log("PollTreeRepository constructed");
  }

    async requestTreeRoot() {
        console.log("PollTreeRepository requestTreeRoot called");
      var data: PollTreeRootModel = {
      unique: null,
      entityType: POLL_TREE_ROOT_ENTITY_TYPE,
      name: "Polls",
      icon: "icon-folder",
          hasChildren: true,
      isFolder: true,
    };

    return { data };
  }
}

export { PollTreeRepository as api };
