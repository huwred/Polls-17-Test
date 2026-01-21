import type { ManifestEntityAction } from '@umbraco-cms/backoffice/entity-action';
import {
    POLL_TREE_ITEM_ENTITY_TYPE,
    POLL_TREE_ROOT_ENTITY_TYPE
} from "../types.js";


const entityActionManifests: Array<ManifestEntityAction> = [
    {
        type: 'entityAction',
        alias: 'deletePoll',
        name: 'Delete Poll',
        kind: 'default',
        api: () => import('./delete-poll.api.ts'),
        forEntityTypes: [POLL_TREE_ITEM_ENTITY_TYPE],
        meta: {
            icon: 'delete',
            label: 'Delete'
        },
    },
    {
        type: 'entityAction',
        alias: 'addPoll',
        name: 'Add Poll',
        kind: 'default',
        api: () => import('./add-poll.api.ts'),
        forEntityTypes: [POLL_TREE_ROOT_ENTITY_TYPE],
        meta: {
            icon: 'add',
            label: 'New Poll'
        },
    },
];


export const menuManifests = [  ...entityActionManifests];