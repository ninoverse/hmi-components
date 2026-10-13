import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import type { HmiModal } from '../modal/modal.js';
import { activeElementDeep } from '../shared/dom.js';
import './confirm-dialog.js';
import type { HmiConfirmDialog } from './confirm-dialog.js';
import { ConfirmDialog } from './confirm-dialog.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-confirm-dialog') as HmiConfirmDialog;
    await el.updateComplete;
    // Give the slots' `slotchange` a turn, and the renders it causes.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
    return el;
}

const modal = (el: HmiConfirmDialog) =>
    el.shadowRoot?.querySelector('hmi-modal') as HmiModal;

const dialog = (el: HmiConfirmDialog) =>
    modal(el).shadowRoot?.querySelector('dialog') as HTMLDialogElement;

const button = (el: HmiConfirmDialog, name: 'cancel' | 'confirm') =>
    el.shadowRoot?.querySelector(`hmi-button[part="${name}"]`) as HTMLElement;

const listen = (el: HmiConfirmDialog, type: string) => {
    const events: CustomEvent[] = [];
    el.addEventListener(type, (e) => events.push(e as CustomEvent));
    return events;
};

const enter = () => userEvent.keyboard('{Enter}');

afterEach(() => {
    document.body.replaceChildren();
    document.documentElement.style.overflow = '';
});

describe('hmi-confirm-dialog', () => {
    it('registers', () => {
        expect(customElements.get('hmi-confirm-dialog')).toBeDefined();
    });

    it('renders a modal, closed by default, and opens it from open', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog heading="Delete?"></hmi-confirm-dialog>`,
        );
        expect(dialog(el).open).toBe(false);
        el.open = true;
        await el.updateComplete;
        await modal(el).updateComplete;
        expect(dialog(el).open).toBe(true);
        expect(dialog(el).matches(':modal')).toBe(true);
        expect(el.hasAttribute('open')).toBe(true);
    });

    it('shows the title and description, as plain text or slotted', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog
                open
                heading="Delete?"
                description="This cannot be undone."
            ></hmi-confirm-dialog>`,
        );
        const root = modal(el).shadowRoot as ShadowRoot;
        expect(root.querySelector('[part="title"]')?.textContent?.trim()).toBe(
            'Delete?',
        );
        expect(
            root.querySelector('[part="description"]')?.textContent?.trim(),
        ).toBe('This cannot be undone.');
        expect(dialog(el).getAttribute('aria-labelledby')).toBe('title');
    });

    it('takes a slotted title and description in place of the strings', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open heading="Plain">
                <span slot="title">Rich title</span>
                <span slot="description">Rich description</span>
            </hmi-confirm-dialog>`,
        );
        const root = modal(el).shadowRoot as ShadowRoot;
        expect(root.querySelector('[part="title"]')?.textContent).not.toContain(
            'Plain',
        );
        expect(
            (root.querySelector('slot[name="title"]') as HTMLSlotElement)
                .assignedNodes({ flatten: true })
                .map((n) => n.textContent)
                .join(''),
        ).toBe('Rich title');
        expect(
            (root.querySelector('[part="description"]') as HTMLElement).hidden,
        ).toBe(false);
    });

    it('hides the description when there is none', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open heading="Delete?"></hmi-confirm-dialog>`,
        );
        expect(
            (
                modal(el).shadowRoot?.querySelector(
                    '[part="description"]',
                ) as HTMLElement
            ).hidden,
        ).toBe(true);
    });

    it('labels the buttons Confirm and Cancel by default, from the strings or the slots', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open heading="Delete?"></hmi-confirm-dialog>`,
        );
        expect(button(el, 'confirm').textContent?.trim()).toBe('Confirm');
        expect(button(el, 'cancel').textContent?.trim()).toBe('Cancel');
        const named = await fixture(
            html`<hmi-confirm-dialog
                open
                heading="Delete?"
                confirm-label="Delete"
                cancel-label="Keep"
            ></hmi-confirm-dialog>`,
        );
        expect(button(named, 'confirm').textContent?.trim()).toBe('Delete');
        expect(button(named, 'cancel').textContent?.trim()).toBe('Keep');
        const slotted = await fixture(
            html`<hmi-confirm-dialog open heading="Delete?" confirm-label="Ignored">
                <b slot="confirm-label">Delete forever</b>
            </hmi-confirm-dialog>`,
        );
        const slot = button(slotted, 'confirm').querySelector(
            'slot[name="confirm-label"]',
        ) as HTMLSlotElement;
        expect(slot.assignedNodes()).toHaveLength(1);
    });

    it('makes the confirm button primary, or danger with variant="danger"', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open heading="Delete?"></hmi-confirm-dialog>`,
        );
        expect(button(el, 'confirm').getAttribute('variant')).toBe('primary');
        expect(button(el, 'cancel').getAttribute('variant')).toBe('ghost');
        el.variant = 'danger';
        await el.updateComplete;
        expect(el.getAttribute('variant')).toBe('danger');
        expect(button(el, 'confirm').getAttribute('variant')).toBe('danger');
    });

    it('fires hmi-confirm from the confirm button, and does not close itself', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open heading="Delete?"></hmi-confirm-dialog>`,
        );
        const confirms = listen(el, 'hmi-confirm');
        const cancels = listen(el, 'hmi-cancel');
        button(el, 'confirm').click();
        expect(confirms).toHaveLength(1);
        expect(confirms[0]?.detail).toEqual({});
        expect(confirms[0]?.bubbles).toBe(true);
        expect(confirms[0]?.composed).toBe(true);
        expect(cancels).toHaveLength(0);
        expect(el.open).toBe(true);
    });

    it('fires a cancelable hmi-cancel from the cancel button, and does not close itself', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open heading="Delete?"></hmi-confirm-dialog>`,
        );
        const cancels = listen(el, 'hmi-cancel');
        button(el, 'cancel').click();
        expect(cancels).toHaveLength(1);
        expect(cancels[0]?.cancelable).toBe(true);
        expect(el.open).toBe(true);
    });

    it('turns Escape into hmi-cancel, and keeps the modal’s hmi-close inside', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open heading="Delete?"></hmi-confirm-dialog>`,
        );
        const cancels = listen(el, 'hmi-cancel');
        const closes = listen(el, 'hmi-close');
        await userEvent.keyboard('{Escape}');
        expect(cancels).toHaveLength(1);
        expect(closes).toHaveLength(0);
        expect(dialog(el).matches(':modal')).toBe(true);
    });

    it('turns a press on the backdrop into hmi-cancel', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open heading="Delete?"></hmi-confirm-dialog>`,
        );
        const cancels = listen(el, 'hmi-cancel');
        const box = dialog(el).getBoundingClientRect();
        dialog(el).dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                composed: true,
                clientX: Math.max(0, box.left - 10),
                clientY: Math.max(0, box.top - 10),
            }),
        );
        expect(cancels).toHaveLength(1);
    });

    it('closes when the consumer sets open to false from a listener', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open heading="Delete?"></hmi-confirm-dialog>`,
        );
        el.addEventListener('hmi-cancel', () => {
            el.open = false;
        });
        button(el, 'cancel').click();
        await el.updateComplete;
        await modal(el).updateComplete;
        expect(dialog(el).open).toBe(false);
    });

    it('disables both buttons while loading, but Escape still cancels', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open loading heading="Delete?"></hmi-confirm-dialog>`,
        );
        expect(button(el, 'cancel').hasAttribute('disabled')).toBe(true);
        expect(button(el, 'confirm').hasAttribute('disabled')).toBe(true);
        const cancels = listen(el, 'hmi-cancel');
        const confirms = listen(el, 'hmi-confirm');
        button(el, 'cancel').click();
        button(el, 'confirm').click();
        expect(cancels).toHaveLength(0);
        expect(confirms).toHaveLength(0);
        await userEvent.keyboard('{Escape}');
        expect(cancels).toHaveLength(1);
    });

    it('disables only the confirm button with confirm-disabled', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open confirm-disabled heading="Delete?"></hmi-confirm-dialog>`,
        );
        expect(button(el, 'cancel').hasAttribute('disabled')).toBe(false);
        expect(button(el, 'confirm').hasAttribute('disabled')).toBe(true);
        const confirms = listen(el, 'hmi-confirm');
        button(el, 'confirm').click();
        expect(confirms).toHaveLength(0);
    });

    it('puts focus on the dialog itself on open, as v5 did', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open heading="Delete?"></hmi-confirm-dialog>`,
        );
        expect(activeElementDeep(document)).toBe(dialog(el));
    });

    it('confirms on Enter, once, with focus on the dialog', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open heading="Delete?"></hmi-confirm-dialog>`,
        );
        const confirms = listen(el, 'hmi-confirm');
        await enter();
        expect(confirms).toHaveLength(1);
    });

    it('confirms on Enter from the dialog itself, where nothing keeps the key', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open heading="Delete?"></hmi-confirm-dialog>`,
        );
        const confirms = listen(el, 'hmi-confirm');
        const keydown = new KeyboardEvent('keydown', {
            key: 'Enter',
            bubbles: true,
            composed: true,
            cancelable: true,
        });
        dialog(el).dispatchEvent(keydown);
        expect(confirms).toHaveLength(1);
        expect(keydown.defaultPrevented).toBe(true);
    });

    it('lets Enter on the cancel button cancel, and does not confirm', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open heading="Delete?"></hmi-confirm-dialog>`,
        );
        const cancels = listen(el, 'hmi-cancel');
        const confirms = listen(el, 'hmi-confirm');
        // Tab: from the dialog to the cancel button, the first of its buttons.
        await userEvent.keyboard('{Tab}');
        expect(
            (activeElementDeep(document)?.getRootNode() as ShadowRoot).host,
        ).toBe(button(el, 'cancel'));
        await enter();
        expect(cancels).toHaveLength(1);
        expect(confirms).toHaveLength(0);
    });

    it('confirms on Enter from the cancel button with confirm-on-button, as v5 did', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open confirm-on-button heading="Delete?"></hmi-confirm-dialog>`,
        );
        const cancels = listen(el, 'hmi-cancel');
        const confirms = listen(el, 'hmi-confirm');
        await userEvent.keyboard('{Tab}');
        await enter();
        expect(confirms).toHaveLength(1);
        expect(cancels).toHaveLength(0);
    });

    it('ignores Enter with a modifier key', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open heading="Delete?"></hmi-confirm-dialog>`,
        );
        const confirms = listen(el, 'hmi-confirm');
        for (const init of [
            { shiftKey: true },
            { ctrlKey: true },
            { metaKey: true },
            { altKey: true },
        ]) {
            dialog(el).dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Enter',
                    bubbles: true,
                    composed: true,
                    ...init,
                }),
            );
        }
        expect(confirms).toHaveLength(0);
    });

    it('does not confirm on Enter while loading or with confirm-disabled', async () => {
        for (const attr of ['loading', 'confirm-disabled']) {
            const el = await fixture(
                attr === 'loading'
                    ? html`<hmi-confirm-dialog open loading heading="x"></hmi-confirm-dialog>`
                    : html`<hmi-confirm-dialog open confirm-disabled heading="x"></hmi-confirm-dialog>`,
            );
            const confirms = listen(el, 'hmi-confirm');
            dialog(el).dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Enter',
                    bubbles: true,
                    composed: true,
                }),
            );
            expect(confirms).toHaveLength(0);
            document.body.replaceChildren();
        }
    });

    it('forwards the modal’s parts to the confirm dialog, and adds cancel and confirm', async () => {
        const el = await fixture(
            html`<hmi-confirm-dialog open heading="Delete?"></hmi-confirm-dialog>`,
        );
        expect(modal(el).getAttribute('exportparts')).toBe(
            'base, panel, title, description, actions',
        );
        expect(button(el, 'cancel')).not.toBeNull();
        expect(button(el, 'confirm')).not.toBeNull();
    });
});

describe('ConfirmDialog (React wrapper)', () => {
    it('mounts through the React wrapper, with its properties and events', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const calls: string[] = [];
        await act(async () => {
            root.render(
                createElement(ConfirmDialog, {
                    open: true,
                    heading: 'Delete?',
                    variant: 'danger',
                    confirmLabel: 'Delete',
                    onCancel: () => calls.push('cancel'),
                    onConfirm: () => calls.push('confirm'),
                }),
            );
        });
        const el = host.querySelector('hmi-confirm-dialog') as HmiConfirmDialog;
        await el.updateComplete;
        expect(el.open).toBe(true);
        expect(el.variant).toBe('danger');
        expect(el.confirmLabel).toBe('Delete');
        button(el, 'cancel').click();
        button(el, 'confirm').click();
        expect(calls).toEqual(['cancel', 'confirm']);
        await act(async () => root.unmount());
    });
});
