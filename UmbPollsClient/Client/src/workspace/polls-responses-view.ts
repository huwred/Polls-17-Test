import { UMB_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/workspace";
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { POLLS_RESPONSE_CONTEXT } from "./polls-responses-context";

@customElement('polls-responses-view')
export class PollsResponseView extends UmbElementMixin(LitElement) {
    @state()
    text?: string = '';
    pollid?: string | null = '';
    workspaceAlias: string = 'polls-response';



    constructor() {
        super();
        this.provideContext(UMB_WORKSPACE_CONTEXT, this);
        this.consumeContext(POLLS_RESPONSE_CONTEXT, (context) => {
            console.log("context", context);
            this.requestUpdate();
        })
    }
    getEntityType(): string {
        return "polls-responses-view";
    }

    render() {
        return html`
        <umb-body-layout header-transparent header-fit-height>
            <section id="settings-dashboard" class="uui-text">
                ${this.renderPollResponses()} 
               
            </section>

        </umb-body-layout>`;

    }
    renderPollResponses() {
        this.fetchPolls().then(data => {
            console.log(data);
            let counter = data.length
            let htmlBody = ``
            for (var i = 0; i < counter; i++) {
                let htmlHead = `<uui-box headline="${data[i].name}" >
                    <uui-button slot="header-actions" look="placeholder" pristine="" href="/umbraco/section/settings/workspace/polls-workspace-view/edit/${data[i].id}" target="_self">Edit</uui-button>
                            <uui-ref-list>`
                let htmlData = ``
                data[i].answers.forEach((element: any) => {
                    htmlData += `
                    <uui-ref-node name="${element.value}" detail="(responses ${element.responses.length})">
                    <uui-icon slot="icon" name="icon-bar-chart"></uui-icon>

<uui-label class="progress-bar" role="progressbar" aria - valuenow="${element.percentage}" aria - valuemin="0" aria - valuemax="100">
    <div class="progress" style="width:${element.percentage}%"><span class="progress-text">${element.percentage}%</span></div>
</uui-label>

                    </uui-ref-node>`
                })
                let htmlClose = `</uui-ref-list>
            <span slot="header">

                ${data[i].responseCount ?? 'Unknown'} responses
            </span>                
                </uui-box>`
                htmlBody += `${htmlHead}${htmlData}${htmlClose}`
            }
            this.text = `${htmlBody}`;

        })
        const stringArray = [`${this.text}`] as any;
        stringArray.raw = [`${this.text}`];
        return html(stringArray as TemplateStringsArray);
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
        grid-template-columns: repeat(3, 1fr);
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
            return Promise.reject(error)
        }
    }
}

export default PollsResponseView;

declare global {
    interface HTMLElementTagNameMap {
        'polls-responses-view': PollsResponseView;
    }
}