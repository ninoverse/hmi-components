import { html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
    HmiInput,
    type InputType,
    type InputValueDetail,
} from '../input/input.js';
import { styles as inputStyles } from '../input/input.styles.js';
import { baseStyles } from '../shared/base.styles.js';
import { formStyles } from '../shared/form.styles.js';
import { styles } from './search-input.styles.js';

/** Detail of `hmi-input` and `hmi-change`: the field's current value. */
export type SearchInputValueDetail = InputValueDetail;

/**
 * `hmi-input` preconfigured for search: a leading search icon, `type="search"`
 * and a `Search…` placeholder. It extends `HmiInput`, so everything there
 * applies: a native form control, the `label`, `hint` and `error` text,
 * `hmi-input` per keystroke and `hmi-change` on commit, and the `right-icon`
 * slot.
 *
 * The field is always `type="search"` (the browser's own clear button stays):
 * the inherited `type` property is ignored. The built-in icon is the fallback of
 * the `left-icon` slot, so a slotted icon replaces it.
 *
 * @tag hmi-search-input
 * @slot left-icon - Replaces the built-in search icon.
 * @slot right-icon - Icon after the text.
 * @fires {CustomEvent<SearchInputValueDetail>} hmi-input - The value changed (every keystroke).
 * @fires {CustomEvent<SearchInputValueDetail>} hmi-change - The value was committed.
 * @csspart base - The bordered field box.
 * @csspart control - The native input.
 * @csspart label - The label.
 * @csspart icon - An icon slot.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 *
 * @example
 * <hmi-search-input name="q" label="Search"></hmi-search-input>
 */
@customElement('hmi-search-input')
export class HmiSearchInput extends HmiInput {
    static override styles = [baseStyles, formStyles, inputStyles, styles];

    constructor() {
        super();
        this.placeholder = 'Search…';
    }

    protected override get inputType(): InputType {
        return 'search';
    }

    protected override renderLeading(): TemplateResult {
        return html`<slot name="left-icon" part="icon"
            ><span class="search-icon" aria-hidden="true"
                ><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                    <circle cx="7" cy="7" r="4.5" />
                    <path d="M10.5 10.5L13.5 13.5" /></svg></span
        ></slot>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-search-input': HmiSearchInput;
    }
}
