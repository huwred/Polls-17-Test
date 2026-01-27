import { UmbEntityActionBase, type ManifestEntityActionDefaultKind } from "@umbraco-cms/backoffice/entity-action";
import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { PollQuestionService } from "../../models/poll-questionservice";

export class PollDelete extends UmbEntityActionBase<ManifestEntityActionDefaultKind> {

    override async execute() {
        if (this.args.unique == null)
            throw new Error('Unique id is required to delete a Poll');

        let id = parseInt(this.args.unique);

        umbConfirmModal(this, { headline: 'Delete Poll',color:'danger', content: 'Are you sure you want to delete?' })
            .then(async () => {
                const poll = await PollQuestionService.Delete(id);
                if (poll) {
                    return Promise.resolve(poll);
                } else {
                    return Promise.reject(new Error(`No polls found`))
                }

            })
            .catch(() => {
                return Promise.resolve('cancel');
            })
    }

}

export default PollDelete;