import { ManifestWorkspace, ManifestWorkspaceView, UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import {
    POLL_TREE_ITEM_ENTITY_TYPE,
    POLL_TREE_ROOT_ENTITY_TYPE,
} from "../settingsTree/types.js";
import PollsWorkspaceContext from "../workspace/polls-workspace-context.js";
import PollsResponsesContext from "../workspace/polls-responses-context.js";

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

export const manifests: Array<UmbExtensionManifest> = [
    workspace,
    workspaceView,
    responsesWorkspace,
    responseView,
    overView,
];