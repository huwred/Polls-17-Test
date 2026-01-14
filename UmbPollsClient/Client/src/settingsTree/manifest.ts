import { ManifestWorkspace, UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import {
    OUR_TREE_ITEM_ENTITY_TYPE,
    OUR_TREE_ROOT_ENTITY_TYPE,
} from "./types.js";
import PollsWorkspaceContext from "../workspace/polls-workspace-context.js";

const repositoryManifest: UmbExtensionManifest = {
    type: "repository",
    alias: "Our.Tree.Repository",
    name: "UmbRepositorySettings",
    api: () => import("./ourtree.repository.js"),
};

const storeManifest: UmbExtensionManifest = {
    type: "treeStore",
    alias: "Our.Tree.Store",
    name: "UmbTreeSettingsStore",
    api: () => import("./ourtree.store.js"),
};

const treeManifest: UmbExtensionManifest = {
    type: "tree",
    kind: "default",
    alias: "Our.Tree.Tree",
    name: "UmbTreeSettings",
    meta: {
        repositoryAlias: repositoryManifest.alias,
    },
};

const treeItem = {
    type: "treeItem",
    kind: "default",
    alias: "Our.Tree.Item",
    name: "UmbTreeSettingsItem",
    forEntityTypes: [OUR_TREE_ROOT_ENTITY_TYPE, OUR_TREE_ITEM_ENTITY_TYPE],
};

const menuManifest: UmbExtensionManifest = {
    type: "menu",
    alias: "Our.Tree.Menu",
    name: "Polls Menu",
    meta: {
        label: "Polls!!",
        icon: "icon-bar-chart",
        entityType: OUR_TREE_ITEM_ENTITY_TYPE,
    },
};

const menuitemManifest: UmbExtensionManifest = {
    type: "menuItem",
    kind: "tree",
    alias: "Our.Tree.MenuItem",
    name: "Polls Menu Item",
    weight: 100,
    meta: {
        label: "Polls Item",
        icon: "icon-bug",
        entityType: OUR_TREE_ITEM_ENTITY_TYPE,
        menus: [menuManifest.alias],
        treeAlias: treeManifest.alias,
        hideTreeRoot: false,
    },
};

const sidebarAppManifest: UmbExtensionManifest = {
    type: "sectionSidebarApp",
    kind: "menu",
    alias: "Our.Tree.Sidebar",
    name: "Polls Sidebar",
    weight: 600,
    meta: {
        label: "MediaWiz Polls",
        menu: menuManifest.alias,
    },
    conditions: [
        {
            alias: "Umb.Condition.SectionAlias",
            match: "Umb.Section.Settings",
        },
    ],
};

/*const workspace: UmbExtensionManifest = {
    type: 'workspace',
    kind: 'routable',
    alias: 'polls.Workspace',
    name: 'Polls Workspace',
    element: () => import('../workspace/workspace.element'),
    meta: {
        entityType: OUR_TREE_ITEM_ENTITY_TYPE,
    },
};*/

const workspace: ManifestWorkspace = {
    type: 'workspace',
    kind: 'routable',
    alias: 'polls.Workspace',
    name: 'Polls Workspace',
    api: PollsWorkspaceContext,
    meta: {
        entityType: OUR_TREE_ITEM_ENTITY_TYPE,
    },
}

const workspaceView: UmbExtensionManifest =
{
    type: 'workspaceView',
    name: 'Polls Workspace View',
    alias: 'polls.workspaceView',
    js: () => import('../workspace/polls-workspace-view.js'),
    weight: 900,
    meta: {
        label: 'Polls Workspace View',
        pathname: 'poll',
        icon: 'icon-lab',
    },
    conditions: [
        {
            alias: UMB_WORKSPACE_CONDITION_ALIAS,
            match: 'polls.Workspace',
        },
    ],
};

export const manifests: Array<UmbExtensionManifest> = [
    repositoryManifest,
    treeManifest,
    storeManifest,
    treeItem,
    menuManifest,
    menuitemManifest,
    sidebarAppManifest,
    workspace,
    workspaceView
];