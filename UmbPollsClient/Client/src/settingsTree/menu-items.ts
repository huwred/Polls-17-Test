import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { PollQuestion } from '../models/poll-question.js';
import { PolQuestionService } from '../models/poll-questionservice.js';
import {
    POLL_TREE_ITEM_ENTITY_TYPE,
} from "./types.js";
import type { UmbMenuItemElement } from '@umbraco-cms/backoffice/menu';

const elementName = 'polls-menu-items';

@customElement(elementName)
class PollsMenuItems extends UmbLitElement implements UmbMenuItemElement {
    @state()
    private _items: PollQuestion[] = []; // Store fetched items
    @state()
    private _loading: boolean = true; // Track loading state
    @state()
    private _error: string | null = null; // Track any errors
    @state()
    private _active: number = -1; // Track active item

    constructor() {
        super();
        this.fetchPolls(); // Start fetching on component load
    }

    // Fetch tree items
    async fetchPolls() {
        try {
            this._loading = true;
            this._items = (await PolQuestionService.GetPolls()); // Fetch root-level items
        } catch (e) {
            this._error = 'Error fetching items';
        } finally {
            this._loading = false;
        }
    }

    // Render items
    //https://localhost:44348/umbraco/section/settings/workspace/polls-workspace-view/edit/2
    renderItems(items: PollQuestion[]): TemplateResult {
        return html`

            ${items.map(element => html`
                <uui-menu-item ?active=${this._active === element.id} 
                href="/section/settings/workspace/polls-workspace-view/edit/${element.id}" 
                label="${element.name}" @click=${() => this._active = element.id}>
                <uui-icon slot="icon" name="icon-bar-chart"></uui-icon>
                <umb-entity-actions-bundle
						slot="actions"
						.entityType=${POLL_TREE_ITEM_ENTITY_TYPE}
						.unique=${element.id}
						.label=${"label"}>
					</umb-entity-actions-bundle>
                </uui-menu-item>
            `)}
        `;
    }

    // Main render function
    render() {

        //Showing loading state
        if (this._loading) {
            return html`<uui-loader></uui-loader>`;
        }

        //Showing error state
        if (this._error) {
            return html`<uui-menu-item active disabled label="Could not load polls!">
        </uui-menu-item>`;
        }

        // Render items if loading is done and no error occurred
        return html`${this.renderItems(this._items)}`;
    }
}



export { PollsMenuItems as element };

declare global {
    interface HTMLElementTagNameMap {
        [elementName]: PollsMenuItems;
    }
}
