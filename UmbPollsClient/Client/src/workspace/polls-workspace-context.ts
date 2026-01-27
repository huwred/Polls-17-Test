import { UmbContextBase } from "@umbraco-cms/backoffice/class-api";
import {
    UMB_WORKSPACE_CONTEXT,
    type UmbRoutableWorkspaceContext,
    type UmbWorkspaceContext,
    UmbWorkspaceRouteManager,
} from "@umbraco-cms/backoffice/workspace";
import { POLL_TREE_ITEM_ENTITY_TYPE } from "../settingsTree/types";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import PollsWorkspaceElement from "./workspace.element";
import { UmbStringState } from "@umbraco-cms/backoffice/observable-api";

export default class PollsWorkspaceContext
    extends UmbContextBase
    implements UmbWorkspaceContext, UmbRoutableWorkspaceContext {
    workspaceAlias = "polls.Workspace";

    routes = new UmbWorkspaceRouteManager(this);

    #pollId = new UmbStringState(undefined);
    public readonly pollId = this.#pollId.asObservable();

    constructor(host: UmbControllerHost) {
        super(host, UMB_WORKSPACE_CONTEXT.toString());
        this.provideContext(POLLS_WORKSPACE_CONTEXT, this);

        this.routes.setRoutes([
            {
                path: "edit/:unique",
                component: PollsWorkspaceElement,
                setup: (_component, info) => {
                    this.#pollId.setValue(info.match.params.unique);
                },
            },
        ]);
    }

    getEntityType(): string {
        return POLL_TREE_ITEM_ENTITY_TYPE;
    }
}

export const POLLS_WORKSPACE_CONTEXT =
    new UmbContextToken<PollsWorkspaceContext>("scriptManagerDetailContext");