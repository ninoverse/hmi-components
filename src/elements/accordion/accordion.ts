import { html, LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { styles } from './accordion.styles.js';

/** One section of an accordion. */
export interface AccordionItem {
    /** The header text: plain text, or the fallback of the `title-<index>` slot. */
    title: string;
    /** The panel text: plain text, or the fallback of the `body-<index>` slot. */
    body: string;
    /** The trigger cannot be toggled. @default false */
    disabled?: boolean;
}

/** Detail of `hmi-open-change`: the indices of the open sections, sorted. */
export interface AccordionOpenChangeDetail {
    open: number[];
}

/**
 * Vertically stacked, collapsible sections. Each trigger is a button with
 * `aria-expanded`, and each panel is a region labelled by its trigger. The
 * panel of a closed section is `inert`: its content cannot take focus and is
 * skipped by assistive technology.
 *
 * `hmi-open-change` fires with `{ open }`, the sorted indices of the open
 * sections, when the user toggles one. The event has its own name because a
 * control inside a panel fires `hmi-change`, which also bubbles through the
 * accordion. The element owns `open`: to veto a toggle, set `open` back from a
 * listener. Without `multiple`, opening a section closes the others.
 *
 * A section's `title` and `body` are text. For richer content, slot an element
 * named `title-<index>` or `body-<index>` (the item's position, from 0), which
 * replaces that text.
 *
 * @tag hmi-accordion
 * @slot title-<index> - Rich title for the section at that position.
 * @slot body-<index> - Rich body for the section at that position.
 * @fires {CustomEvent<AccordionOpenChangeDetail>} hmi-open-change - The user toggled a section.
 * @csspart base - The stack of sections.
 * @csspart item - One section.
 * @csspart trigger - A section's header button.
 * @csspart title - A section's title.
 * @csspart chevron - A section's chevron.
 * @csspart panel - A section's panel.
 * @csspart body - A section's body.
 *
 * @example
 * <hmi-accordion multiple></hmi-accordion>
 * <!-- then, from script: accordion.items = [{ title, body }]; accordion.defaultOpen = [0]; -->
 */
@customElement('hmi-accordion')
export class HmiAccordion extends LitElement {
    static override styles = [baseStyles, styles];

    /** The sections. A property only: there is no attribute. @default [] */
    @property({ type: Array, attribute: false })
    accessor items: AccordionItem[] = [];

    /** Allow several sections to be open at once. @default false */
    @property({ type: Boolean }) accessor multiple = false;

    /** The indices of the open sections. Seeded from `defaultOpen` when empty at first render. A property only. @default [] */
    @property({ type: Array, attribute: false }) accessor open: number[] = [];

    /** Indices open at first render, when `open` is not set. A property only. */
    @property({ type: Array, attribute: false }) accessor defaultOpen:
        | number[]
        | undefined;

    override willUpdate(changed: PropertyValues<this>): void {
        if (
            !this.hasUpdated &&
            this.open.length === 0 &&
            this.defaultOpen !== undefined
        ) {
            this.open = [...this.defaultOpen];
        }
        super.willUpdate(changed);
    }

    #toggle(index: number): void {
        const next = new Set(this.multiple ? this.open : []);
        if (this.open.includes(index)) next.delete(index);
        else next.add(index);
        this.open = Array.from(next).sort((a, b) => a - b);
        emit<AccordionOpenChangeDetail>(this, 'hmi-open-change', {
            open: this.open,
        });
    }

    override render() {
        return html`<div part="base" class="base">
            ${this.items.map((item, index) => {
                const isOpen = this.open.includes(index);
                return html`<div part="item" class="item">
                    <button
                        part="trigger"
                        class="trigger"
                        type="button"
                        id=${`h-${index}`}
                        aria-expanded=${isOpen ? 'true' : 'false'}
                        aria-controls=${`p-${index}`}
                        ?disabled=${item.disabled}
                        @click=${() => this.#toggle(index)}
                    >
                        <span part="title" class="title"
                            ><slot name=${`title-${index}`}>${item.title}</slot></span
                        >
                        <span part="chevron" class="chevron" aria-hidden="true">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 6l4 4 4-4" />
                            </svg>
                        </span>
                    </button>
                    <section
                        part="panel"
                        class="panel"
                        id=${`p-${index}`}
                        aria-labelledby=${`h-${index}`}
                        data-open=${isOpen ? 'true' : 'false'}
                        ?inert=${!isOpen}
                    >
                        <div class="panel-inner">
                            <div part="body" class="body"
                                ><slot name=${`body-${index}`}>${item.body}</slot></div
                            >
                        </div>
                    </section>
                </div>`;
            })}
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-accordion': HmiAccordion;
    }
}
