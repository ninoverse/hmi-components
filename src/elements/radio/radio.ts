import { html, type PropertyValues, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { HmiCheckable } from '../shared/checkable.js';
import { checkableStyles } from '../shared/checkable.styles.js';
import { formStyles } from '../shared/form.styles.js';
import { styles } from './radio.styles.js';

export type { CheckedDetail as RadioChangeDetail } from '../shared/checkable.js';

const STEP: Record<string, number> = {
    ArrowDown: 1,
    ArrowRight: 1,
    ArrowUp: -1,
    ArrowLeft: -1,
};

/**
 * A single labelled radio button: a circle with a dot. Radios that share a
 * `name`, in the same form and the same root (the document or one shadow
 * root), are one group: checking one unchecks the others, the arrow keys move
 * between them, and the group has a single tab stop (the checked radio, else the
 * first enabled one). The element does this itself, because a native radio only
 * groups with radios in its own tree and each `hmi-radio` keeps its input in a
 * shadow root. A radio without a `name` stands alone.
 *
 * A checked radio submits `name=value` (`value` defaults to `'on'`), an
 * unchecked one nothing, and `form.reset()` restores each radio's initial state.
 * `required` is group-level: a radio is invalid while it is required and no
 * radio of its group is checked.
 *
 * `hmi-change` fires with `{ checked: true }` when the radio becomes checked.
 * The radio that loses the check fires nothing, as with native radios. To
 * choose from a list of options, use `hmi-radio-group`.
 *
 * @tag hmi-radio
 * @slot - Rich label content, instead of the `label` text.
 * @fires {CustomEvent<RadioChangeDetail>} hmi-change - The radio became checked.
 * @csspart base - The label row: circle and text.
 * @csspart box - The circle.
 * @csspart label - The label text.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 *
 * @example
 * <hmi-radio name="size" value="md" label="Medium"></hmi-radio>
 */
@customElement('hmi-radio')
export class HmiRadio extends HmiCheckable {
    static override styles = [baseStyles, formStyles, checkableStyles, styles];

    /** The radios of this group, in document order, this one included. */
    #peers(): HmiRadio[] {
        const root = this.getRootNode() as Document | ShadowRoot | HTMLElement;
        // No name, or no DOM to search (server rendering): the radio stands alone.
        if (!this.name || typeof root.querySelectorAll !== 'function') {
            return [this];
        }
        return Array.from(root.querySelectorAll<HmiRadio>('hmi-radio')).filter(
            (radio) => radio.name === this.name && radio.form === this.form,
        );
    }

    protected override get inputType(): 'radio' {
        return 'radio';
    }

    protected override get inputRequired(): boolean {
        return this.required && !this.#peers().some((peer) => peer.checked);
    }

    protected override get inputTabindex(): number | undefined {
        const peers = this.#peers();
        if (peers.length < 2) return undefined;
        const tabbable =
            peers.find((peer) => peer.checked) ??
            peers.find((peer) => !peer.isDisabled);
        return tabbable === this ? undefined : -1;
    }

    protected override get setInfo() {
        const peers = this.#peers();
        return { position: peers.indexOf(this) + 1, size: peers.length };
    }

    protected override onInputKeydown(event: KeyboardEvent): void {
        const step = STEP[event.key];
        if (!step) return;
        const enabled = this.#peers().filter((peer) => !peer.isDisabled);
        const next =
            enabled[
                (enabled.indexOf(this) + step + enabled.length) % enabled.length
            ];
        event.preventDefault();
        if (next && next !== this) next.#select();
    }

    #select(): void {
        this.input?.focus();
        this.input?.click();
    }

    override updated(changed: PropertyValues<this>): void {
        super.updated(changed);
        const others = this.#peers().filter((peer) => peer !== this);
        if (changed.has('checked') && this.checked) {
            for (const peer of others) {
                if (peer.checked) peer.checked = false;
            }
        }
        // A peer's tab stop, set position and `required` depend on this state.
        if (
            changed.has('checked') ||
            changed.has('name') ||
            changed.has('disabled')
        ) {
            for (const peer of others) peer.requestUpdate();
        }
    }

    protected renderIndicator(): TemplateResult {
        return html`<span part="box" class="box" aria-hidden="true"></span>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-radio': HmiRadio;
    }
}
