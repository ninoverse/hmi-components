import { html, isServer, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { baseStyles } from '../shared/base.styles.js';
import { supportsPopover } from '../shared/dom.js';
import { emit } from '../shared/events.js';
import { renderLiquidFilter } from '../shared/panel.js';
import { statusIcon } from '../shared/status-icon.js';
import {
    getToasts,
    pauseToast,
    resumeToast,
    subscribeToasts,
    type ToastItem,
    toast,
} from '../shared/toast.js';
import { styles } from './toast.styles.js';

export type {
    ToastContent,
    ToastItem,
    ToastOptions,
    ToastVariant,
} from '../shared/toast.js';
export { toast } from '../shared/toast.js';

/** Detail of `hmi-dismiss`. */
export interface ToastDismissDetail {
    /** The id `toast.show()` returned for the toast. */
    id: number;
}

const closeIcon = html`<svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    aria-hidden="true"
>
    <path d="M4 4l8 8M12 4l-8 8" />
</svg>`;

type HoldReason = 'pointer' | 'focus';

/**
 * Toast stack: shows the toasts that `toast.show()` queues, pinned to the bottom
 * right of the screen. Mount one near your app root and raise toasts from
 * anywhere with the `toast` object (`toast.success('Saved', 'Changes are live.')`;
 * `import { toast } from '@ninoverse/hmi-components/wc/toast'`, or `HmiElements.toast`
 * in the drop-in bundle). Each toast has a `variant` (`info`, `success`, `warning`
 * or `danger`), an optional `title` and `body` and a `duration` in milliseconds
 * (4000 by default, `0` to stay until dismissed). `title` and `body` are text, or a
 * DOM node the caller built.
 *
 * The stack is a `popover="manual"` element in the top layer, so the page's
 * overflow cannot clip it. It stays open while the element is connected, as an
 * empty live region (`aria-live="polite"`) that each toast, a `status`, is announced
 * from. A toast's clock stops while the pointer is over it or focus is inside it, and
 * goes on with the time it had left. The close button asks to dismiss it with the
 * cancelable `hmi-dismiss`; the timer and `toast.dismiss(id)` fire nothing.
 *
 * A modal dialog (modal, drawer, confirm-dialog, command-palette) makes everything
 * outside it inert, and the toast stack is outside it. A toast that is up when a
 * dialog opens, or raised while one is open, stays under the dialog's scrim,
 * dimmed, and cannot be clicked or announced until the dialog closes; its clock keeps
 * running. v5 drew it above the dialog and clickable.
 *
 * Mount one stack: every `<hmi-toast>` shows the whole queue. A queue belongs to one
 * copy of the module, so the `wc/toast` module and the drop-in bundle each have their
 * own.
 *
 * @tag hmi-toast
 * @fires {CustomEvent<ToastDismissDetail>} hmi-dismiss - The user pressed a toast's close button. Cancelable: `preventDefault()` keeps the toast. Not fired for the timer or `toast.dismiss(id)`.
 * @csspart base - The stack.
 * @csspart list - The stack, under its role name.
 * @csspart toast - One toast. `data-variant` is its variant, and `data-leaving` is `true` while it plays its exit animation.
 * @csspart panel - One toast, under its panel-group name.
 * @csspart icon - A toast's status icon.
 * @csspart content - The title and the body of a toast.
 * @csspart title - A toast's heading line.
 * @csspart body - A toast's message line.
 * @csspart close - A toast's close button.
 *
 * @example
 * <hmi-toast></hmi-toast>
 * <script type="module">
 *   import { toast } from '@ninoverse/hmi-components/wc/toast';
 *   toast.success('Saved', 'Changes synced to the cloud.');
 * </script>
 */
@customElement('hmi-toast')
export class HmiToast extends LitElement {
    static override styles = [baseStyles, styles];

    /** Accessible name of each toast's close button. @default 'Dismiss' */
    @property({ attribute: 'dismiss-label' }) accessor dismissLabel = 'Dismiss';

    @state() private accessor items: readonly ToastItem[] = [];

    @query('.list') private accessor list!: HTMLElement;

    #unsubscribe: (() => void) | undefined;
    // What is holding a toast's clock: the pointer over it, focus inside it.
    #holds = new Map<number, Set<HoldReason>>();

    override connectedCallback(): void {
        super.connectedCallback();
        if (isServer) return;
        this.items = getToasts();
        this.#unsubscribe = subscribeToasts((next) => {
            this.items = next;
            // A toast that has left no longer holds anything.
            for (const id of this.#holds.keys()) {
                if (!next.some((item) => item.id === id))
                    this.#holds.delete(id);
            }
        });
        if (this.hasUpdated) this.#open();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.#unsubscribe?.();
        this.#unsubscribe = undefined;
        // Nothing here will tell the clocks that the pointer has left.
        for (const id of this.#holds.keys()) resumeToast(id);
        this.#holds.clear();
    }

    protected override updated(): void {
        if (!isServer) this.#open();
    }

    // The stack stays open while the element is connected: it is the live region
    // that announces a toast, and one that appeared with its first toast would not.
    #open(): void {
        const list = this.list;
        // An update can still be queued when the element has just been taken out.
        if (!this.isConnected || !list || !supportsPopover()) return;
        if (list.matches(':popover-open')) return;
        list.showPopover();
    }

    #hold(id: number, reason: HoldReason, on: boolean): void {
        const reasons = this.#holds.get(id) ?? new Set<HoldReason>();
        const held = reasons.size > 0;
        if (on) reasons.add(reason);
        else reasons.delete(reason);
        if (reasons.size > 0) this.#holds.set(id, reasons);
        else this.#holds.delete(id);
        if (!held && reasons.size > 0) pauseToast(id);
        else if (held && reasons.size === 0) resumeToast(id);
    }

    // The close button asks; a listener that cancels keeps the toast.
    #dismiss(id: number): void {
        const proceed = emit<ToastDismissDetail>(
            this,
            'hmi-dismiss',
            { id },
            { cancelable: true },
        );
        if (proceed) toast.dismiss(id);
    }

    #renderToast(item: ToastItem): TemplateResult {
        const { id } = item;
        return html`<div
            part="toast panel"
            class="toast"
            role="status"
            data-variant=${item.variant}
            data-leaving=${item.leaving ? 'true' : 'false'}
            @pointerenter=${() => this.#hold(id, 'pointer', true)}
            @pointerleave=${() => this.#hold(id, 'pointer', false)}
            @focusin=${() => this.#hold(id, 'focus', true)}
            @focusout=${(event: FocusEvent) => {
                const inside = (event.currentTarget as Node).contains(
                    event.relatedTarget as Node | null,
                );
                if (!inside) this.#hold(id, 'focus', false);
            }}
        >
            <span part="icon" class="icon">${statusIcon(item.variant)}</span>
            <div part="content" class="content">
                ${item.title ? html`<p part="title" class="title">${item.title}</p>` : nothing}
                ${item.body ? html`<p part="body" class="body">${item.body}</p>` : nothing}
            </div>
            <button
                part="close"
                class="close"
                type="button"
                aria-label=${this.dismissLabel}
                @click=${() => this.#dismiss(id)}
            >
                ${closeIcon}
            </button>
        </div>`;
    }

    override render() {
        return html`${renderLiquidFilter()}
            <div part="base list" class="list" popover="manual" aria-live="polite">
                ${repeat(
                    this.items,
                    (item) => item.id,
                    (item) => this.#renderToast(item),
                )}
            </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-toast': HmiToast;
    }
}
