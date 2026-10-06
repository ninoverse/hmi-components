import { html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { HmiCheckable } from '../shared/checkable.js';
import { checkableStyles } from '../shared/checkable.styles.js';
import { formStyles } from '../shared/form.styles.js';
import { styles } from './checkbox.styles.js';

export type { CheckedDetail as CheckboxChangeDetail } from '../shared/checkable.js';

/**
 * Labelled checkbox: a boxed toggle with a check glyph. A native form control:
 * a checked box submits `name=value` (`'on'` by default), `form.reset()`
 * restores the initial state, and `required` makes an unchecked box invalid.
 *
 * `hmi-change` fires on every toggle with `{ checked }`. The element owns its
 * state: to veto a toggle, set `checked` back from a listener. The inline text
 * is `label`, or the default slot for richer content; `hint` and `error` render
 * below. `aria-*` on the host does not name the inner input, so name it with
 * `label`.
 *
 * @tag hmi-checkbox
 * @slot - Rich label content, instead of the `label` text.
 * @fires {CustomEvent<CheckboxChangeDetail>} hmi-change - The state was toggled.
 * @csspart base - The label row: box and text.
 * @csspart box - The check box.
 * @csspart label - The label text.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 *
 * @example
 * <hmi-checkbox name="terms" label="Accept terms" required></hmi-checkbox>
 */
@customElement('hmi-checkbox')
export class HmiCheckbox extends HmiCheckable {
    static override styles = [baseStyles, formStyles, checkableStyles, styles];

    protected renderIndicator(): TemplateResult {
        return html`<span part="box" class="box" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </span>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-checkbox': HmiCheckbox;
    }
}
