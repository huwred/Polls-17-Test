import { UMB_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/workspace";
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, state, query } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { POLLS_WORKSPACE_CONTEXT } from "./polls-workspace-context";
import { umbConfirmModal } from '@umbraco-cms/backoffice/modal';
import '../sorter/sorter-group.js';

@customElement('polls-workspace-view')

export class PollsWorkspaceView extends UmbElementMixin(LitElement) {
    @state()
    text?: string = '';
    pollid?: string | null = '';
    workspaceAlias: string = 'polls-workspace';

    @state()
    private _answers: any;
    @state()
    private _poll: any;

    @query('#key-value-new-sort')
    newSortInp!: HTMLInputElement;

    @query('#key-value-new-value')
    newValueInp!: HTMLInputElement;

    constructor() {
        super();
        this.provideContext(UMB_WORKSPACE_CONTEXT, this);
        this.consumeContext(POLLS_WORKSPACE_CONTEXT, (context) => {
            context?.pollId.subscribe((pollId) => {
                this.pollid = pollId;
            })
        })
    }

    getEntityType(): string {
        return "polls-workspace-view";
    }

    renderPollAnswers() {
        if (this.pollid == "-1") {
            return html`
            <uui-form-layout-item>
                <uui-label slot="label" required>You must save the question before adding answers</uui-label>
            </uui-form-layout-item>
            `;
        }
        if (this._answers?.length === 0) {
            return html`
            <uui-form-layout-item>
                <uui-label slot="label" required>No Answers defined</uui-label>
            </uui-form-layout-item>
            <uui-form-layout-item>
                <uui-label slot="label">Add new Answer</uui-label>
                <span slot="description">
                    Form item accepts a sort order + description, keep it short.
                </span>
                <uui-input id="key-value-new-sort" pristine="" title="Sort Order" type="number" label="label" step="1" value="10" min="0" max="10"></uui-input>
                <uui-input id="key-value-new-value" name="Answers" type="text" label="label"  pristine="" value="" placeholder="Add another Answer">
                    <div slot="append"  >
                        <uui-icon name="icon-badge-add" @click="${this.#addAnswer}"></uui-icon>
                    </div>
                </uui-input>
            </uui-form-layout-item>
            `;
        }
        return html`
			<uui-form-layout-item>
				<polls-sorter-group .items=${(this._answers ?? []).map((a: any) => ({
                    sortid: crypto.randomUUID(),
                    id: a.id,
                    sort: Number(a.index),
                    name: a.value,
                    question: a.questionId
                })) }></polls-sorter-group>
			</uui-form-layout-item>
            <uui-form-layout-item>
            <hr>
            </uui-form-layout-item>

            `;
    }

    override render() {

       this.fetchPoll(Number(this.pollid)).then(data => {
            if (!this._answers) {
                this._answers = data.answers;
                this._answers.sort((a: any, b: any) => Number(a.index) - Number(b.index));
            }
            this._poll = data;
       });
        if (!this._poll) {
            return html``;
        }
        return html`
        <umb-body-layout header-transparent header-fit-height>
            <section id="settings-dashboard" class="uui-text">
                <uui-form>
                <form id="MyForm" name="myForm"
                    @submit="${(u: { preventDefault: () => void; target: any; }) => {
                        u.preventDefault();
                        this.#handleSave(u).then((result) => {
                            let currentURL = window.location.href;
                            if (currentURL.endsWith("/-1")) {
                                let id: string | undefined;

                                // Try to parse result as JSON and get id property
                                try {
                                    const parsed = typeof result === 'string' ? JSON.parse(result) : result;
                                    id = parsed?.id;
                                } catch {
                                    // If result is not JSON, id remains undefined
                                }

                                if (id) {
                                    location.href = currentURL.replace("-1", id);
                                }
                            } else {
                                location.reload();
                            }

                        });

                    }}">
                    <uui-box headline="Question">
                        <div slot="header">
                            <uui-input style="--auto-width-text-margin-right: 50px;width:30em;" autowidth="" id="Question_${this._poll.id}" name="Name" type="text" label="Question" required="" pristine="" value="${this._poll.name}"></uui-input>
                        </div>
                        <uui-action-bar slot="header-actions">
                            <uui-button label="Delete"  look="placeholder" pristine="" @click="${(u: { preventDefault: () => void; target: any; }) => {
                                u.preventDefault();
                                this.#handleDelete(u);
                            }}" ><uui-icon name="delete" data-id="${this._poll.id}"></uui-icon>
                            </uui-button>
                        </uui-action-bar>

                        <uui-input id="qid" name="Id" type="number" label="Id" pristine="" value="${this._poll.id}" style="display:none;"></uui-input>
                        <uui-label>Answers</uui-label>

                        ${this.renderPollAnswers() }
                        <uui-form-layout-item>
                            <span slot="description">
                                Add Start and/or End date to control when a poll is displayed.
                            </span><uui-label>Poll Start + End dates</uui-label>            
                        </uui-form-layout-item>
                        <uui-form-layout-item>
                            <uui-input id="startdate" name="StartDate" type="datetime-local" label="startdate"  pristine="" value="${this._poll.startDate}" ></uui-input>
                            <uui-input id="enddate" name="EndDate" type="datetime-local" label="enddate"  pristine="" value="${this._poll.endDate}" ></uui-input>
                        </uui-form-layout-item>
                        <uui-input id="createddate" name="CreatedDate" style="display:none;" type="text" label="createddate"  pristine="" value="${this._poll.createdDate}" ></uui-input>
                        <div class="actions">
					        <uui-button
						        label="save"
						        color="positive"
						        look="primary"
						        type="submit">Save</uui-button>
                        </div>
                    </uui-box>
                </form>
                </uui-form>
            </section>
        </umb-body-layout>`;

    }

    static override styles = [
        UmbTextStyles,
        css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
        --uui-button-height: ;
      }
      :host slot[name="header-actions"]{
          margin-left:1rem !important;
      }
    `,
    ];

    private async fetchPoll(pollnum: number) {
        const headers: Headers = new Headers()
        headers.set('Content-Type', 'application/json')
        headers.set('Accept', 'application/json')
        const response = await fetch('/get-question/' + pollnum, {
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
            return Promise.reject(error)
        }
    }

    async #handleDelete(u: { target: any }) {
        const dataId = u.target?.dataset?.id;
        umbConfirmModal(this, {
            headline: 'Delete Poll',
            content: this.localize.term("defaultdialogs_confirmdelete"),
            color: 'danger',
            confirmLabel: this.localize.term("actions_delete"),
        })
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

    #addAnswer() {
        let newValueTrimmed = this.newValueInp.value.trim();
        let newSortTrimmed = this.newSortInp.value.trim();

        this._answers.push({ id: 0, value: newValueTrimmed, index: newSortTrimmed });

        // Ensure array is sorted by numeric index (ascending)
        this._answers.sort((a: any, b: any) => Number(a.index) - Number(b.index));

        //reset the values
        this.newSortInp.value = '1';
        this.newValueInp.value = '';
    }

    async #handleSave(u: { target: any; }) {
        const i = u.target;

        if (!i.checkValidity()) return;
        const formData = new FormData(i);

        const response = await fetch('/post-question', { // Change to your server endpoint
            method: 'POST',
            body: formData
        });
        const result = await response.text(); // Or response.json()
        return Promise.resolve(result);
    }
}

export default PollsWorkspaceView;

declare global {
    interface HTMLElementTagNameMap {
        'polls-workspace-view': PollsWorkspaceView;
    }
}