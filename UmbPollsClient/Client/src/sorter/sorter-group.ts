import type { PollSorterItem } from './sorter-item.js';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, repeat, property, query } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { UmbSorterController } from '@umbraco-cms/backoffice/sorter';

import './sorter-item.js';

export type ModelEntryType = {
	sortid: string;
	id: string;
	name: string;
	sort: number;
	question: number;
};

@customElement('polls-sorter-group')
export class PollsSorterGroup extends UmbElementMixin(LitElement) {
	// Make this element form-associated
	static formAssociated = true;

	private _items?: ModelEntryType[];
	private _internals?: ElementInternals;
	private _form?: HTMLFormElement;

	@property({ type: Array, attribute: false })
	public get items(): ModelEntryType[] {
		return this._items ?? [];
	}
	public set items(value: ModelEntryType[]) {
		// Only set initial model
		if (this._items !== undefined) return;
		this._items = value;
		// Defer sorter initialization until elements are in the DOM
		this.updateComplete.then(() => {
			this.#sorter.setModel(this._items!);
			this.#updateFormValue();
		});
	}

	@query('#new-answer') newValueInp!: HTMLInputElement;
	@query('#question-id') questionId!: HTMLInputElement;

	constructor() {
		super();
		// Attach internals if supported
		try {
			if ('attachInternals' in HTMLElement.prototype) {
				this._internals = this.attachInternals();
			}
		} catch {
			// ignore
		}
	}

	connectedCallback(): void {
		super.connectedCallback();
		// Fallback: hook the closest form's formdata event if ElementInternals not available
		if (!this._internals) {
			this._form = this.closest('form') ?? undefined;
			this._form?.addEventListener('formdata', this.#onFormData);
		}
	}

	disconnectedCallback(): void {
		// Clean up fallback listener
		this._form?.removeEventListener('formdata', this.#onFormData);
		super.disconnectedCallback();
	}

	// Called when form is reset
	formResetCallback() {
		// No-op, but if you keep initial items elsewhere, restore here and update form value
		this.#updateFormValue();
	}

	// Custom validity (example, prevent empty list)
	#validate() {
		if (!this._internals) return;
		const valid = !!this._items && this._items.length > 0 && this._items.every((i) => i.name.trim().length > 0);
		if (!valid) {
			this._internals.setValidity({ customError: true }, 'Please add at least one answer.');
		} else {
			this._internals.setValidity({});
		}
	}

	// Contribute fields to parent form
	#updateFormValue() {
		// Keep validity in sync
		console.log(this._items);
		this.#validate();

		// Build a FormData payload with repeated keys
		const fd = new FormData();
		(this._items ?? []).forEach((item) => {
			fd.append('Answers', item.name);
			fd.append('answerssort', String(item.sort));
			fd.append('answersid', item.id);
		});

		if (this._internals) {
			// ElementInternals can submit multiple fields via FormData
			this._internals.setFormValue(fd);
		}
		// Fallback path handled in #onFormData
	}

	// Fallback: append our data to the FormData right before submission
	#onFormData = (e: FormDataEvent) => {
		console.log(this._items);
		(this._items ?? []).forEach((item) => {
			e.formData.append('Answers', item.name);
			e.formData.append('answerssort', String(item.sort));
			e.formData.append('answersid', item.id);
		});
	};

	// Ensure sorter is initialized whenever items change after renders
	protected override updated(changed: Map<string, unknown>) {
		super.updated(changed);
		if (changed.has('items')) {
			// Elements exist now; refresh mapping
			this.#sorter.setModel(this._items ?? []);
		}
	}

	// Sorter: use stable ids for element and model
	#sorter = new UmbSorterController<ModelEntryType, PollSorterItem>(this, {
		getUniqueOfElement: (element) => element.getAttribute('sortid') ?? '', // read reflected attribute
		getUniqueOfModel: (modelEntry) => String(modelEntry.sortid),            // ensure string
		identifier: 'mediawiz-polls-sorters',
		itemSelector: 'poll-sorter-item',
		containerSelector: '.sorter-container',
		onChange: ({ model }) => {
			const oldValue = this._items;
			model.forEach((row, index) => (row.sort = index));
			this._items = model;
			this.requestUpdate('items', oldValue);
			this.#updateFormValue();
		},
	});

	removeItem = (item: ModelEntryType) => {
		const oldValue = this._items;
		this._items = this._items!.filter((r) => r.sortid !== item.sortid);
		this.requestUpdate('items', oldValue);
		// After render, refresh sorter mapping
		this.updateComplete.then(() => this.#sorter.setModel(this._items!));
		this.#updateFormValue();
	};

	addItem() {
		const newVal = this.newValueInp.value.trim();
		if (!newVal) return;
		const qId = this.questionId.value;
		const newId = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`;
		const oldValue = this._items;
		this._items = [...(this._items ?? []), { sortid: newId, id: "0", name: newVal, sort: 9, question: Number(qId) }];
		this._items.forEach((row, index) => (row.sort = index));
		this.newValueInp.value = '';
		this.requestUpdate('items', oldValue);
		// Refresh sorter after DOM updates so elements exist
		this.updateComplete.then(() => this.#sorter.setModel(this._items!));
		this.#updateFormValue();
	}

	override render() {
		return html`
			<div class="sorter-container">
				${repeat(
					this.items,
					(item) => item.id, // key by id
					(item) => html`
						<poll-sorter-item style="width: fit-content;" sortid=${item.sortid} name=${item.name} id=${item.id} sort=${item.sort} question="${item.question}">
							<uui-icon name="icon-grip" class="handle" aria-hidden="true"></uui-icon>

							<uui-input
							  slot="action"
							  id="${item.sortid}"
							  name="Answers"
							  type="text"
							  label="Answer"
							  pristine=""
							  .value=${item.name}
							  @input=${(e: InputEvent) => {
								const target = e.target as HTMLInputElement;
								const oldValue = this._items;
								// immutable update so Lit re-renders and keeps ids stable
								this._items = this.items.map(i => i.sortid === item.sortid ? { ...i, name: target.value } : i);
								this.requestUpdate('items', oldValue);
								this.updateComplete.then(() => this.#sorter.setModel(this._items!));
								this.#updateFormValue();
							  }}>
							  <div slot="append" style="padding-left:var(--uui-size-2, 6px)">
								<uui-icon-registry-essential>
									<uui-icon color="red" data-id="${item.sortid}" title="Remove Answer" name="delete" @click=${() => this.removeItem(item)}></uui-icon>
								</uui-icon-registry-essential>
							  </div>
							</uui-input>
						</poll-sorter-item>
					`,
				)}
			</div>

			<uui-form-layout-item>
				<uui-label slot="label">Add new Answer</uui-label>
				<span slot="description">Form item accepts a sort order + description, keep it short.</span>
				<uui-input style="display:none;" id="question-id" name="Question" type="text" pristine value="${this.items[0]?.question ?? ''}"></uui-input>
				<uui-input id="new-answer" name="Answers" type="text" pristine value="" placeholder="Add another Answer">
					<div slot="append">
						<uui-icon name="icon-badge-add" @click=${() => this.addItem()}></uui-icon>
					</div>
				</uui-input>
			</uui-form-layout-item>
		`;
	}

	static override styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				width: max-content;
				border-radius: calc(var(--uui-border-radius) * 2);
				padding: var(--uui-size-space-1);
			}
			.sorter-placeholder {
				opacity: 0.2;
			}
			.sorter-container {
				min-height: 20px;
			}
		`,

	];
}

export default PollsSorterGroup;

declare global {
	interface HTMLElementTagNameMap {
		'polls-sorter-group': PollsSorterGroup;
	}
}