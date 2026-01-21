import { UmbEntityActionBase, type ManifestEntityActionDefaultKind } from "@umbraco-cms/backoffice/entity-action";

export class PollAdd extends UmbEntityActionBase<ManifestEntityActionDefaultKind> {

    override async getHref() {
        return `section/settings/workspace/polls-workspace-view/edit/-1`;
    }

}

export default PollAdd;