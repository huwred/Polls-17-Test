import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

@customElement('poll-sorter-item')
export class PollSorterItem extends UmbElementMixin(LitElement) {


	@property({ type: String, reflect: true })
	id: string = '';
	@property({ type: Number, reflect: true })
	sort!: number;
	@property({ type: String, reflect: true })
	name: string = '';
	@property({ type: Number, reflect: true })
	question!: number;
	// TODO: Does it make any different to have this as a property?
	@property({ type: Boolean, reflect: true, attribute: 'drag-placeholder' })
	umbDragPlaceholder = false;

	override render() {
		return html`
			<div>
			<slot></slot>
			<slot name="action"></slot>
            <uui-input style="display:none;" id="${'Answer' + this.id}" name="Answers" type="text" label="Answer"  pristine="" value="${this.name}" ></uui-input>
			<uui-input style="display:none;" id="sort_${this.id}" pristine="" name="answerssort" type="number" label="label" value="${this.sort}" min="0" max="100" ></uui-input>
            <uui-input style="display:none;" id="id_${this.id}" name="answersid" type="text" label="Id" pristine="" value="${this.id}" ></uui-input>
            <uui-input style="display:none;" id="question_${this.id}" name="questionid" type="text" label="QuestionId" pristine="" value="${this.question}" ></uui-input>
			</div>
		`;
	}

	static override styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				padding:.25rem;
				border: 1px dashed var(--uui-color-border);
				border-radius: var(--uui-border-radius);
				margin-bottom: 3px;
				--uui-icon-color:green;
			}
			:host ([action]){
				margin:10px;

			}
			:host([drag-placeholder]) {
				opacity: 0.2;
			}

			div {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			::slotted(*) {
			  padding-left: .1rem;
			}
			::slotted([slot="action"]) {
			  padding-left: .3rem;
			  cursor: hand;
			  --uui-icon-color:red;
			}
			slot:not([name]) {
				padding:.3rem;
				cursor: move;
			}
		`,
	];
}

export default PollSorterItem;

declare global {
	interface HTMLElementTagNameMap {
		'poll-sorter-item': PollSorterItem;
	}
}