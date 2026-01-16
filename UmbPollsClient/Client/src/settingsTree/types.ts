import {
  UmbTreeItemModel,
  UmbTreeRootModel,
} from "@umbraco-cms/backoffice/tree";

export const POLL_TREE_ROOT_ENTITY_TYPE = "polls-workspace-root";
export const POLL_TREE_ITEM_ENTITY_TYPE = "polls-workspace-view";

export interface PollTreeItemModel extends UmbTreeItemModel {
  entityType: typeof POLL_TREE_ITEM_ENTITY_TYPE;
}

export interface PollTreeRootModel extends UmbTreeRootModel {
  entityType: typeof POLL_TREE_ROOT_ENTITY_TYPE;
}
