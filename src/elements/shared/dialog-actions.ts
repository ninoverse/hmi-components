import { html, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../button/button.js';
import type { ButtonSize } from '../button/button.js';

/** A serializable dialog action, rendered as a button. */
export interface DialogAction {
    /** The button text. */
    label: string;
    /** The value `onAction` is called with when the button is activated. */
    value: string;
    /** The button's variant. @default 'secondary' */
    variant?: 'primary' | 'secondary' | 'danger';
}

/**
 * The buttons of a dialog's `actions` array, in order. The dialog group (modal,
 * drawer) renders them in the footer, as the fallback of its `actions` slot, and
 * a table's `actions` cells reuse them. `onAction` receives the activated
 * action's `value`: the element turns it into `hmi-action`. `size` sets every
 * button's size; the default is the button's own.
 */
export function renderDialogActions(
    actions: readonly DialogAction[],
    onAction: (value: string) => void,
    size?: ButtonSize,
): TemplateResult[] {
    return actions.map(
        (action) =>
            html`<hmi-button
                part="action"
                variant=${action.variant ?? 'secondary'}
                size=${ifDefined(size)}
                @click=${() => onAction(action.value)}
                >${action.label}</hmi-button
            >`,
    );
}
