import { UMB_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/workspace";
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, state, repeat } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { POLLS_WORKSPACE_CONTEXT } from "./polls-workspace-context";
import { umbConfirmModal } from '@umbraco-cms/backoffice/modal';
import { PollQuestionService } from "../models/poll-questionservice";

@customElement('polls-responses-view')
export class PollsResponseView extends UmbElementMixin(LitElement) {
    @state()
    text?: string = '';
    pollid?: string | null = '';
    workspaceAlias: string = 'polls-response';
    @state()
    private _poll: any;


    constructor() {
        super();
        this.provideContext(UMB_WORKSPACE_CONTEXT, this);
        this.consumeContext(POLLS_WORKSPACE_CONTEXT, (context) => {
            context?.pollId.subscribe((pollId: string | null | undefined) => {
                this.pollid = pollId;
                //removed requestUpdate from here to avoid multiple render
                //this.requestUpdate();
            });
            this.fetchPolls().then(data => {
                if (!this._poll) {
                    this._poll = data;

                }
            });
        })
    }
    getEntityType(): string {
        return "polls-responses-view";
    }

    private async fetchPolls() {
        const poll = await PollQuestionService.GetOverviewById(Number(this.pollid));
        return Promise.resolve(poll);

    }

    async #handleDelete(u: { target: any }) {
        umbConfirmModal(this, { headline: 'Delete All the Responses',color:'danger', content: 'Are you sure you want to delete?' })
            .then(async () => {
                const dataId = u.target?.dataset?.id;
                let poll = await PollQuestionService.DeleteResponses(dataId);
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

    render() {
        if (!this._poll) {
            return html``;
        }

        return html`
            <umb-body-layout header-transparent header-fit-height>
                <section id="settings-dashboard" class="uui-text">
                    <uui-box headline="${this._poll.name}" >
                        <uui-action-bar slot="header-actions">
                            <uui-button label="Delete" ?disabled=${this._poll.responses.length === 0} look="placeholder" pristine="" @click="${(u: { preventDefault: () => void; target: any; }) => {
                                u.preventDefault();
                                this.#handleDelete(u);
                            }}" ><uui-icon name="delete" data-id="${this._poll.id}"></uui-icon>
                            </uui-button>
                        </uui-action-bar>
                        <span slot="header">
                            ${this._poll.responses.length ?? 'Unknown'} responses
                        </span> 
                        <uui-ref-list>
                        ${repeat(this._poll.answers, (item: any) => item.key, (item) =>
                            html`
                                <uui-ref-node name="${item.value}">
                                <uui-icon slot="icon" name="icon-bar-chart"></uui-icon>
                                <uui-label class="progress-bar" role="progressbar" aria - valuenow="${item.percentage}" aria - valuemin="0" aria - valuemax="100">
                                    <div class="progress" style="width:${item.percentage}%"><span class="progress-text">${item.percentage}%</span></div>
                                </uui-label>
                                <uui-label slot="detail">(responses ${item.responses?.length})</uui-label>
                                </uui-ref-node> `
                        )}
                       </uui-ref-list>
                    </uui-box>
                </section>
            </umb-body-layout>`;
    }

    static override styles = [
        UmbTextStyles,
        css`
        :host {
            display: block;
            padding: var(--uui-size-layout-1);
        }
        #settings-dashboard{
            display: grid;
            grid-gap: var(--uui-size-7);
            grid-template-columns: repeat(2, 1fr);
            padding: var(--uui-size-layout-1);
        }
        .progress-bar {
            width: 60%;
            max-width: 200px;
            height: 20px;
            background-color: #f0f0f0;
            border-radius: 5px;
            overflow: hidden;
        }
 
        .progress {
            height: 100%;
            background-color: #007BFF;
            width: 50%; /* This represents the percentage filled */
        }
        .progress-text {
            color: white;
            text-align: center;
            display: block;
        }
    `,
    ];

}

export default PollsResponseView;

declare global {
    interface HTMLElementTagNameMap {
        'polls-responses-view': PollsResponseView;
    }
}