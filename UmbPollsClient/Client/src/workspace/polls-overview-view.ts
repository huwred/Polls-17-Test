import { UMB_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/workspace";
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, state, repeat } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { POLLS_RESPONSE_CONTEXT } from "./polls-responses-context";
import { umbConfirmModal } from '@umbraco-cms/backoffice/modal';

@customElement('polls-overview')
export class PollsResponseView extends UmbElementMixin(LitElement) {
    @state()
    text?: string = '';
    pollid?: string | null = '';
    workspaceAlias: string = 'polls-overview';

    @state()
    private _polls: any;

    constructor() {
        super();
        this.provideContext(UMB_WORKSPACE_CONTEXT, this);
        this.consumeContext(POLLS_RESPONSE_CONTEXT, () => {
            this.requestUpdate();
        })
    }

    getEntityType(): string {
        return "polls-overview";
    }

    render() {
        this.fetchPolls().then(data => {
            this._polls = data;
        });
        if (!this._polls) {
            return html`
                <umb-body-layout header-transparent header-fit-height>
                    <section id="settings-dashboard" class="uui-text">
                    <uui-button label="Edit" look="placeholder" pristine="" href="/umbraco/section/settings/workspace/polls-workspace-view/edit/-1" target="_self">Create a Poll</uui-button>
                    </section>
                </umb-body-layout>
            `;
        }
        return html`
        <umb-body-layout header-transparent header-fit-height>
            <section id="settings-dashboard" class="uui-text">
                <uui-button label="Edit" look="placeholder" pristine="" href="/umbraco/section/settings/workspace/polls-workspace-view/edit/-1" target="_self">Create a Poll</uui-button>
            </section>
            <section id="polls-dashboard" class="uui-text">
            ${repeat(this._polls, (item: any) => item.key, (item) =>
                html`<uui-box headline="${item.name}" >
                        <uui-action-bar slot="header-actions">
                            <uui-button label="Edit" look="placeholder" pristine="" href="/umbraco/section/settings/workspace/polls-workspace-view/edit/${item.id}" target="_self"><uui-icon name="edit"></uui-icon></uui-button>
                            <uui-button label="Delete"  look="placeholder" pristine="" @click="${(u: { preventDefault: () => void; target: any; }) => {
                                u.preventDefault();
                                this.#handleDelete(u);
                                }}" ><uui-icon name="delete" data-id="${item.id}"></uui-icon>
                            </uui-button>
                        </uui-action-bar>
                        <uui-ref-list>
                            ${repeat(item.answers.sort((a: any, b: any) => Number(a.index) - Number(b.index)), (answer: any) => answer.key, (answer) =>
                                html`
                                    <uui-ref-node name="${answer.value}" detail="(responses ${answer.responses.length})">
                                        <uui-icon slot="icon" name="icon-bar-chart"></uui-icon>
                                        <uui-label class="progress-bar" role="progressbar" aria - valuenow="${answer.percentage}" aria - valuemin="0" aria - valuemax="100">
                                            <div class="progress" style="width:${answer.percentage}%"><span class="progress-text">${answer.percentage}%</span></div>
                                        </uui-label>
                                    </uui-ref-node>`
                            )}
                        </uui-ref-list>
                        <span slot="header">
                            ${item.responseCount ?? 'Unknown'} responses
                        </span>                
                    </uui-box>
                `)}
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
      #polls-dashboard{
        display: grid;
        grid-gap: var(--uui-size-7);
        grid-template-columns: repeat(2, 1fr);
        padding: var(--uui-size-layout-1);
      }
            #settings-dashboard{
        display: grid;
        grid-gap: var(--uui-size-7);
        grid-template-columns: repeat(1, 1fr);
        padding: var(--uui-size-layout-1);
      }
.progress-bar {
    width: 60%;
    max-width: 300px;
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

    private async fetchPolls() {
        const headers: Headers = new Headers()
        headers.set('Content-Type', 'application/json')
        headers.set('Accept', 'application/json')
        const response = await fetch('/get-overview/', {
            method: 'GET',
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
    }

    async #handleDelete(u: { target: any }) {
        const dataId = u.target?.dataset?.id;

        umbConfirmModal(this, { headline: 'Delete Poll', content: 'Do you confirm?' })
            .then(async () => {
                const headers: Headers = new Headers()
                headers.set('Content-Type', 'application/json')
                headers.set('Accept', 'application/json')
                const response = await fetch('/delete-question/' + dataId, {
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

export default PollsResponseView;

declare global {
    interface HTMLElementTagNameMap {
        'polls-overview': PollsResponseView;
    }
}