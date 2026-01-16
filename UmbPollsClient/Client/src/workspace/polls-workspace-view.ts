import { UMB_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/workspace";
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { POLLS_WORKSPACE_CONTEXT } from "./polls-workspace-context";

@customElement('polls-workspace-view')
export class PollsWorkspaceView extends UmbElementMixin(LitElement) {
    @state()
    text?: string = '';
    pollid?: string | null = '';
    workspaceAlias: string = 'polls-workspace';



    constructor() {
        super();
        this.provideContext(UMB_WORKSPACE_CONTEXT, this);
        this.consumeContext(POLLS_WORKSPACE_CONTEXT, (context) => {
            context?.pollId.subscribe((pollId) => {
                this.pollid = pollId;
                //removed requestUpdate from here to avoid multiple render
                //this.requestUpdate();
            })
        })
    }
    getEntityType(): string {
        return "polls-workspace-view";
    }
    renderPollProps() {

        this.fetchPoll(Number(this.pollid)).then(data => {
            let counter = 0;
            let htmlData = `
            <uui-box headline="Question">
                <div slot="header">
                    <uui-input style="--auto-width-text-margin-right: 50px" id="Question_${data.id}" name="Name" type="text" label="Question" required="" pristine="" value="${data.name}"></uui-input>
                </div>
                    <uui-input id="qid" name="Id" type="number" label="Id" pristine="" value="${data.id}" style="display:none;"></uui-input>
                    <uui-label>Answers</uui-label>
                `;

            if (data.answers.length === 0) {
                htmlData += `
                <uui-form-layout-item>
                    <uui-label slot="label" required>No Answers defined</uui-label>
                </uui-form-layout-item>`;
            }
            data.answers.forEach(() => {
                htmlData += `
                    <uui-form-layout-item>
                        <uui-input pristine="" title="Sort Order" type="number" label="label" step="1" value="${data.answers[counter].index}" min="0" max="10"></uui-input>
                        <uui-input id="${'Answer' + data.answers[counter].id}" name="Answers" type="text" label="Answer"  pristine="" value="${data.answers[counter].value}" >
                            <div slot="append" style=" padding-left:var(--uui-size-2, 6px)">
                            <uui-icon-registry-essential>
                                <uui-icon name="delete"></uui-icon>
                            </uui-icon-registry-essential>
                            </div>
                        </uui-input>

                        <uui-input id="sort_${data.answers[counter].id}" name="answerssort" type="text" label="Id" pristine="" value="${data.answers[counter].index}" style="display:none;"></uui-input>
                        <uui-input id="id_${data.answers[counter].id}" name="answersid" type="text" label="Id" pristine="" value="${data.answers[counter].id}" style="display:none;"></uui-input>
                    </uui-form-layout-item>`;
                counter++;
            })

            htmlData += `
            <uui-form-layout-item>
                <uui-label slot="label">Add Answer</uui-label>
                <span slot="description">
                    Form item accepts a sort order + description, keep it short.
                </span>
                <uui-input pristine="" title="Sort Order" type="number" label="label" step="1" value="10" min="0" max="10"></uui-input>
                <uui-input name="Answers" type="text" label="label"  pristine="" value="" placeholder="Add another Answer">
                    <div slot="append" style=" padding-left:var(--uui-size-2, 6px)">
                    <uui-icon-registry-essential>
                        <uui-icon name="icon-badge-add" color="color-green" title="Add Answer"></uui-icon>
                    </uui-icon-registry-essential>
                    </div>
                </uui-input>
            </uui-form-layout-item>
            <uui-form-layout-item><uui-label>Poll Start + End dates</uui-label></uui-form-layout-item>
            <uui-form-layout-item>
                <uui-input id="startdate" name="StartDate" type="date" label="startdate"  pristine="" value="${data.startDate}" ></uui-input>
                <uui-input id="enddate" name="EndDate" type="date" label="enddate"  pristine="" value="${data.endDate}" ></uui-input>
            </uui-form-layout-item>
            <uui-input id="createddate" name="CreatedDate" style="display:none;" type="text" label="createddate"  pristine="" value="${data.createdDate}" ></uui-input>
            </uui-box>`;

            this.text = htmlData;

        })

        const stringArray = [`${this.text}`] as any;
        stringArray.raw = [`${this.text}`];
        return html(stringArray as TemplateStringsArray);
    }
    override render() {
        return html`
        <umb-body-layout header-transparent header-fit-height>
            <section id="settings-dashboard" class="uui-text">
                <uui-form>
                <form id="MyForm" 
                @submit="${(u: { preventDefault: () => void; target: any; }) => {
                    u.preventDefault();
                    this.#handleSave(u);
                }}"
                name="myForm" >
                ${this.renderPollProps()}
                <div class="actions">
					<uui-button
						label="save"
						color="positive"
						look="primary"
						type="submit"

						>Save</uui-button
                </div>
                </form></uui-form>
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

    async #handleSave(u: { target: any; }) {
        alert("save");
        const i = u.target;
        if (!i.checkValidity()) return;
        const formData = new FormData(i);

        const response = await fetch('/post-question', { // Change to your server endpoint
            method: 'POST',
            body: formData
        });
        const result = await response.text(); // Or response.json()
        alert('Server response: ' + result);

        return Promise.resolve(result);
    }
}

export default PollsWorkspaceView;

declare global {
    interface HTMLElementTagNameMap {
        'polls-workspace-view': PollsWorkspaceView;
    }
}