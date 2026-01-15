import { customElement, html, property,state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbModalExtensionElement } from '@umbraco-cms/backoffice/modal';
import type { UmbModalContext } from '@umbraco-cms/backoffice/modal';
import type { PollModalData, PollModalValue } from './poll-modal.token.js';

@customElement('poll-dialog')
export class PollDialogElement
    extends UmbLitElement
    implements UmbModalExtensionElement<PollModalData, PollModalValue> {
    @state()
    text?: string = '';
    @state()
    _options: any[] = [];
    @property()
    preselected = '3';

    @property({ attribute: false })
    modalContext?: UmbModalContext<PollModalData, PollModalValue>;

    @property({ attribute: false })
    data?: PollModalData;

    connectedCallback() {
        super.connectedCallback();
        this._fetchData();
    }

    private _fetchData = async () => {
        const response = await this.fetchPolls();
        this._options = [...response];
    };
    private _onChange(e: CustomEvent) {
        const controlValue = e.target as HTMLSelectElement;
        let test = {
            key: controlValue.value,
            value: controlValue.innerText
        };
        this.modalContext?.updateValue({ poll: test });
        console.log(controlValue.value);
    }
    private _handleCancel() {
        this.modalContext?.submit();
    }

    private _handleSubmit() {
        //this.modalContext?.updateValue({ myData: 'hello world' });
        this.modalContext?.submit();
    }
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

    render() {
        return html`
            <umb-body-layout headline="${this.modalContext?.data.headline ?? "Default headline"}" headline-variant="h5">
                <uui-box headline="Polls">
                    <p>Select a Poll for this node.</p>
                    <uui-combobox-list value=${this.preselected} >
                        ${this._options.map(
                            option =>
                                html`<uui-combobox-list-option value="${option.id}" @click="${this._onChange}" 
                            >${option.name}</uui-combobox-list-option>`
                        )}
                    </uui-combobox-list>
                </uui-box>
                <div slot="actions">
                    <uui-button @click=${this._handleCancel}>Cancel</uui-button>
                    <uui-button @click=${this._handleSubmit} color="positive" look="primary">Submit</uui-button>
                </div>
            </umb-body-layout>
        `;
    }
}

export const element = PollDialogElement;