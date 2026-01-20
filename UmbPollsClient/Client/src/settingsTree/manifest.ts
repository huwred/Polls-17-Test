import {
    POLL_TREE_ITEM_ENTITY_TYPE,
    POLL_TREE_ROOT_ENTITY_TYPE,
} from "./types.js";


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



export const manifests: Array<UmbExtensionManifest> = [
    repositoryManifest,
    treeManifest,
    storeManifest,
    sidebarAppManifest,
    treeItem,
    menuManifest,
    menuitemManifest,


];