import { html, customElement, state, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/property-editor";
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { POLL_MODAL_TOKEN } from "../modals/poll-modal.token.js";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";
import { PollQuestion } from "../workspace/poll-question.js"
//type PollKeyValue = {
//    key: string;
//    value: string;
//};
type ArrayOf<T> = T[];

@customElement("mediawiz-poll-picker")
export class PollPicker extends UmbLitElement implements UmbPropertyEditorUiElement {

    @property()
    public value: ArrayOf<PollQuestion> = [];

    @state()
    _items: ArrayOf<PollQuestion> = [];


    // do I need this?
    connectedCallback() {
        super.connectedCallback();
    }

    #updatePropertyEditorValue() {
        this.value = this._items;
        this.dispatchEvent(new UmbChangeEvent()) 
    }  
    render() {
        return html`
        <uui-ref-list>
            <uui-ref-node name="${this.value == null ? "No Poll Selected" : this.value[0]?.name}">
            <uui-icon slot="icon" name="icon-bar-chart"></uui-icon>
            <uui-action-bar slot="actions"><uui-button label="delete"><uui-icon name="delete"></uui-icon></uui-button></uui-action-bar>
            </uui-ref-node>
        </uui-ref-list>

        <uui-button @click=${this._openModal} id="btn-add" look="placeholder" pristine="" label="Choose a Poll" type="button" color="default"></uui-button>
        `;
    }


    /**
     * Open Modal (Poll Picker)
     * @param id
     */
    async _openModal() {
        const returnedValue =
            await umbOpenModal(this, POLL_MODAL_TOKEN, {
            data: {
                headline: "Select a Poll",
            },
            }).catch(() => undefined);

        this._items = [returnedValue!.poll];
        this.#updatePropertyEditorValue();
    }
}

export {
    PollPicker as default
};
declare global {
    interface HTMLElementTagNameMap {
        'mediawiz-poll-picker': PollPicker;
    }
}