import { UMB_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/workspace";
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { POLLS_WORKSPACE_CONTEXT } from "./polls-workspace-context";

@customElement('polls-workspace-view')
export class PollsWorkspaceView extends UmbElementMixin(LitElement) {
    @state()
    //private _items: Array<string> = [];
    text?: string = '';
    pollid?: string | null = '';
    workspaceAlias: string = 'polls-workspace';



    constructor() {
        super();
        this.provideContext(UMB_WORKSPACE_CONTEXT, this);

        this.consumeContext(POLLS_WORKSPACE_CONTEXT, (context) => {
            context?.pollId.subscribe((pollId) => {
                this.pollid = pollId;

                this.requestUpdate();
            })
        })
    }
    getEntityType(): string {
        return "polls-workspace-view";
    }
    renderPollProps() {
        this.fetchPoll(Number(this.pollid)).then(data => {
            let htmlData = `
            <uui-box headline="Question"><uui-form-layout-item>
            <uui-label for="Question_${data.id}" slot="label" required>Question</uui-label>
                <uui-input id="Question_${data.id}" name="Name" type="text" label="Question" required="" pristine="" value="${data.name}"></uui-input>
                <uui-input id="qid" name="Id" type="number" label="Id" pristine="" value="${data.id}" style="display:none;"></uui-input>
            </uui-form-layout-item>
            <uui-form-layout-item>
            <uui-label slot="label">Answers</uui-label>
            </uui-form-layout-item>`;

            let counter = 0;

            data.answers.forEach(() => {

                htmlData += `
                            <uui-form-layout-item>
                              <uui-input id="${data.answers[counter].id}" name="Answers" type="text" label="Answer"  pristine="" value="${data.answers[counter].value}" >
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
                              <uui-label for="startdate" slot="label" >Start date</uui-label>
                              <uui-input id="startdate" name="StartDate" type="date" label="startdate"  pristine="" value="${data.startDate}" ></uui-input>
                            </uui-form-layout-item>
                            <uui-form-layout-item>
                              <uui-label for="enddate" slot="label" >End date</uui-label>
                              <uui-input id="enddate" name="EndDate" type="date" label="enddate"  pristine="" value="${data.endDate}" ></uui-input>
                            </uui-form-layout-item>
                              <uui-input id="createddate" name="CreatedDate" style="display:none;" type="text" label="createddate"  pristine="" value="${data.createdDate}" ></uui-input>`;

            this.text = htmlData;
        })

        const stringArray = [`${this.text}`] as any;
        stringArray.raw = [`${this.text}`];
        return html(stringArray as TemplateStringsArray);
    }
    override render() {
        return html`<umb-body-layout header-transparent header-fit-height>
                       <section id="settings-dashboard" class="uui-text">
                            <uui-form><form id="MyForm" name="myForm" >
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
                        </section></umb-body-layout>`;

    }

    static override styles = [
        UmbTextStyles,
        css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
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
}

export default PollsWorkspaceView;

declare global {
    interface HTMLElementTagNameMap {
        'polls-workspace-view': PollsWorkspaceView;
    }
}