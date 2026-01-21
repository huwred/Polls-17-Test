import { UmbEntityActionBase, type ManifestEntityActionDefaultKind } from "@umbraco-cms/backoffice/entity-action";
import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";

export class PollDelete extends UmbEntityActionBase<ManifestEntityActionDefaultKind> {

    override async execute() {
        if (this.args.unique == null)
            throw new Error('Unique id is required to delete a Poll');

        let id = parseInt(this.args.unique);

        umbConfirmModal(this, { headline: 'Delete Poll',color:'danger', content: 'Are you sure you want to delete?' })
            .then(async () => {
                const headers: Headers = new Headers()
                headers.set('Content-Type', 'application/json')
                headers.set('Accept', 'application/json')
                const response = await fetch('/delete-question/' + id, {
                    method: 'DELETE',
                    headers: headers
                })

                const data = await response.json()
                if (response.ok) {
                    const poll = data
                    if (poll) {
                        return Promise.resolve(poll);
                    } else {
                        return Promise.reject(new Error(`No polls found`))
                    }
                } else {
                    // handle the errors
                    const error = 'unknown'
                    console.warn(`⚠️ Error ${response.status}:`, data.message || data);
                    return Promise.reject(error)
                }
            })
            .catch(() => {
                return Promise.resolve('cancel');
            })
    }

}

export default PollDelete;