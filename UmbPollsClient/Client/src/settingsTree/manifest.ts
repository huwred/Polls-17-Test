import { ManifestWorkspace, ManifestWorkspaceView, UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import {
    POLL_TREE_ITEM_ENTITY_TYPE,
    POLL_TREE_ROOT_ENTITY_TYPE,
} from "./types.js";
import PollsWorkspaceContext from "../workspace/polls-workspace-context.js";
import PollsResponsesContext from "../workspace/polls-responses-context.js";

const repositoryManifest: UmbExtensionManifest = {
    type: "repository",
    alias: "Polls.Tree.Repository",
    name: "UmbRepositorySettings",
    api: () => import("./polltree.repository.js")
};

const storeManifest: UmbExtensionManifest = {
    type: "treeStore",
    alias: "Polls.Tree.Store",
    name: "UmbTreeSettingsStore",
    api: () => import("./polltree.store.js")
};

const treeManifest: UmbExtensionManifest = {
    type: "tree",
    kind: "default",
    alias: "Polls.Tree.Tree",
    name: "UmbTreeSettings",
    meta: {
        repositoryAlias: repositoryManifest.alias,
    }
};

const treeItem = {
    type: "treeItem",
    kind: "default",
    alias: "Polls.Tree.Item",
    name: "UmbTreeSettingsItem",
    meta: {
        hideActions: false
    },
    forEntityTypes: [POLL_TREE_ROOT_ENTITY_TYPE, POLL_TREE_ITEM_ENTITY_TYPE]
};

const menuManifest: UmbExtensionManifest = {
    type: "menu",
    alias: "Polls.Tree.Menu",
    name: "Polls Menu",
    meta: {
        label: "Polls!!",
        icon: "icon-bar-chart",
        entityType: POLL_TREE_ITEM_ENTITY_TYPE,
    }
};

const menuitemManifest: UmbExtensionManifest = {
    type: "menuItem",
    kind: "tree",
    alias: "Polls.Tree.MenuItem",
    name: "Polls Menu Item",
    weight: 100,
    meta: {
        label: "Polls Item",
        icon: "icon-bug",
        entityType: POLL_TREE_ITEM_ENTITY_TYPE,
        menus: [menuManifest.alias],
        treeAlias: treeManifest.alias,
        hideTreeRoot: false,
    }
};

const sidebarAppManifest: UmbExtensionManifest = {
    type: "sectionSidebarApp",
    kind: "menu",
    alias: "Polls.Tree.Sidebar",
    name: "Polls Sidebar",
    weight: 300,
    meta: {
        label: "MediaWiz Polls",
        menu: menuManifest.alias,
    },
    conditions: [
        {
            alias: "Umb.Condition.SectionAlias",
            match: "Umb.Section.Settings",
        },
    ]
};


const workspace: ManifestWorkspace = {
    type: 'workspace',
    kind: 'routable',
    alias: 'polls.Workspace',
    name: 'Polls Workspace',
    api: PollsWorkspaceContext,
    meta: {
        entityType: POLL_TREE_ITEM_ENTITY_TYPE,
    }
}

const workspaceView: ManifestWorkspaceView =
{
    type: 'workspaceView',
    name: 'default View',
    alias: 'polls.workspace',
    js: () => import('../workspace/polls-workspace-view.js'),
    weight: 900,
    meta: {
        label: 'Content',
        pathname: 'edit',
        icon: 'icon-bar-chart',
    },
    conditions: [
        {
            alias: UMB_WORKSPACE_CONDITION_ALIAS,
            match: 'polls.Workspace',
        },
    ]
};
const overView: ManifestWorkspaceView =
{
    type: 'workspaceView',
    name: 'over View',
    alias: 'polls.overview',
    js: () => import('../workspace/polls-responses-view.js'),
    weight: 900,
    meta: {
        label: 'Responses',
        pathname: 'overview',
        icon: 'icon-chart',
    },
    conditions: [
        {
            alias: UMB_WORKSPACE_CONDITION_ALIAS,
            match: workspace.alias,
        }
    ]
};
const responseView: ManifestWorkspaceView =
{
    type: 'workspaceView',
    name: 'response View',
    alias: 'polls.responses',
    js: () => import('../workspace/polls-overview-view.js'),
    weight: 100,
    meta: {
        label: 'Polls Overview',
        pathname: 'poll',
        icon: 'icon-lab',
    },
    conditions: [
        {
            alias: UMB_WORKSPACE_CONDITION_ALIAS,
            match: 'polls.Responses',
        },
    ]
};

const responsesWorkspace: ManifestWorkspace =
{
    type: 'workspace',
    kind: 'routable',
    alias: 'polls.Response',
    name: 'Polls Responses',
    api: PollsResponsesContext,  
    meta: {
        entityType: POLL_TREE_ROOT_ENTITY_TYPE,
    }
};


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
    element: () => import('../modals/poll-picker-modal.js')
}

export const manifests: Array<UmbExtensionManifest> = [
    repositoryManifest,
    treeManifest,
    storeManifest,
    treeItem,
    menuManifest,
    menuitemManifest,
    sidebarAppManifest,
    workspace,
    workspaceView,
    responsesWorkspace,
    responseView,
    pollPicker,
    pickerModalManifest,
    overView,

];