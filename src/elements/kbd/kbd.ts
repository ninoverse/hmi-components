import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './kbd.styles.js';

export type KbdSize = 'small' | 'medium';

const SIZES: readonly string[] = ['small', 'medium'];

/**
 * Renders one keyboard key as a key cap.
 *
 * A symbol, such as `⌘` or `⇧`, is read out as its glyph, if at all: give
 * it a `label` to name it, `<hmi-kbd label="Command">⌘</hmi-kbd>`, and
 * screen readers hear the label in place of the glyph. With an empty slot the
 * label is the cap's text; with neither, nothing is drawn.
 *
 * A shortcut is several keys, composed by the page. Wrap them in a `<kbd>`,
 * as HTML marks up a key combination, and keep it on one line:
 * `<kbd style="white-space: nowrap"><hmi-kbd>Ctrl</hmi-kbd> + <hmi-kbd>K</hmi-kbd></kbd>`.
 *
 * The label is 12px (10px small) at the default `--hmi-base`, and grows with
 * the text around it past that, three quarters of its size (five eighths
 * small), so a key in a heading keeps up with it.
 *
 * @tag hmi-kbd
 * @slot - Key label (e.g. `⌘`, `Ctrl`).
 * @csspart base - The key cap.
 * @cssprop --kbd-font - The cap's font. Falls back to `--font-display`; the journal and pixel structures set it to `--font-default`.
 */
@customElement('hmi-kbd')
export class HmiKbd extends LitElement {
    static override styles = [baseStyles, styles];

    /** Key cap size; any other value is medium, with a console warning. @default 'medium' */
    @property({ reflect: true }) accessor size: KbdSize = 'medium';

    /** The key's name for screen readers, read in place of the slotted glyph. @default '' */
    @property() accessor label = '';

    /* Until the slot is read, it counts as filled, so a server render keeps
       the cap. */
    @state() private accessor empty = false;

    override willUpdate(changed: Map<PropertyKey, unknown>) {
        if (changed.has('size') && !SIZES.includes(this.size)) {
            console.warn(
                `hmi-kbd: size must be 'small' or 'medium'; '${String(this.size)}' is drawn as medium.`,
            );
        }
    }

    override firstUpdated() {
        this.#read();
    }

    #read() {
        const slot = this.renderRoot.querySelector('slot');
        this.empty = !(slot?.assignedNodes({ flatten: true }) ?? []).some(
            (node) =>
                node.nodeType === Node.ELEMENT_NODE ||
                Boolean(node.textContent?.trim()),
        );
    }

    override render() {
        const named = this.label !== '';
        return html`<kbd part="base" class="base" ?hidden=${this.empty && !named}
            ><span class="keys" aria-hidden=${named ? 'true' : nothing}
                ><slot @slotchange=${this.#read}></slot></span
            >${
                named
                    ? html`<span class=${this.empty ? 'text' : 'name'}>${this.label}</span>`
                    : nothing
            }</kbd
        >`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-kbd': HmiKbd;
    }
}
