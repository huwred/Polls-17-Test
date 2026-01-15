import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  UmbTreeAncestorsOfRequestArgs,
  UmbTreeChildrenOfRequestArgs,
  UmbTreeRootItemsRequestArgs,
  UmbTreeServerDataSourceBase,
} from "@umbraco-cms/backoffice/tree";
import { OurTreeItemResponseModel, UmbPollsClientService } from "../api";
import {
  OUR_TREE_ITEM_ENTITY_TYPE,
  OUR_TREE_ROOT_ENTITY_TYPE,
  OurTreeItemModel,
} from "./types";

export class OurTreeDataSource extends UmbTreeServerDataSourceBase<any, any> {
  constructor(host: UmbControllerHost) {
    super(host, {
      getRootItems,
      getChildrenOf,
      getAncestorsOf,
      mapper,
    });
  }
}

const getAncestorsOf = async (args: UmbTreeAncestorsOfRequestArgs) => {
    console.log("Getting ancestors for:", args.treeItem.unique);
    return await UmbPollsClientService.getAncestors({
    query: { id: args.treeItem.unique },
  });
};

const getRootItems = async (args: UmbTreeRootItemsRequestArgs) => {
    console.log("Getting root items with args:", args);
    return await UmbPollsClientService.getPolls({
        query: { skip: args.skip, take: args.take },
    });
};
const getChildrenOf = async (args: UmbTreeChildrenOfRequestArgs) => {
    console.log("Getting children for:", args.parent?.unique);
  if (args.parent?.unique === null) {
    return await getRootItems(args);
  } else {
      return await UmbPollsClientService.getChildren({
      query: { parent: args.parent.unique },
    });
  }
};

const mapper = (item: OurTreeItemResponseModel): OurTreeItemModel => {
    console.log("Mapping item:", item);
  return {
    unique: item.id ?? "",
    parent: { unique: null, entityType: OUR_TREE_ROOT_ENTITY_TYPE },
    name: item.name ?? "unknown",
    entityType: OUR_TREE_ITEM_ENTITY_TYPE,
    hasChildren: false, //item.hasChildren,
    isFolder: false,
    icon: item.icon ?? "icon-bug",
  };
};
