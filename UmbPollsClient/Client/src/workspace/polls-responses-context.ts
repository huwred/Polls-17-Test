import { UmbContextBase } from "@umbraco-cms/backoffice/class-api";
import {
    UMB_WORKSPACE_CONTEXT,
    UmbRoutableWorkspaceContext,
    UmbWorkspaceContext,
    UmbWorkspaceRouteManager,
} from "@umbraco-cms/backoffice/workspace";
import { POLL_TREE_ROOT_ENTITY_TYPE } from "../settingsTree/types";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import PollsWorkspaceElement from "./workspace.element";

export default class PollsResponsesContext
    extends UmbContextBase
    implements UmbWorkspaceContext, UmbRoutableWorkspaceContext {
    workspaceAlias = "polls.Responses";

    routes = new UmbWorkspaceRouteManager(this);

    constructor(host: UmbControllerHost) {
        super(host, UMB_WORKSPACE_CONTEXT.toString());
        this.provideContext(POLLS_RESPONSE_CONTEXT, this);

        this.routes.setRoutes([
            {
                path: "edit/:unique",
                component: PollsWorkspaceElement,
                setup: (_component, info) => {
                    console.log(info.match.params.unique);
                    //this.#pollId.setValue(info.match.params.unique);
                },
            },
        ]);
    }

    getEntityType(): string {
        return POLL_TREE_ROOT_ENTITY_TYPE;
    }
}

export const POLLS_RESPONSE_CONTEXT =
    new UmbContextToken<PollsResponsesContext>("scriptManagerDetailContext");