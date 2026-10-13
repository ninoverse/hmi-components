import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../button/button.js';
import { activeElementDeep } from '../shared/dom.js';
import './modal.js';
import type {
    DialogAction,
    HmiModal,
    ModalActionDetail,
    ModalCloseDetail,
} from './modal.js';
import { Modal } from './modal.react.js';

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-modal') as HmiModal;
    await el.updateComplete;
    // Give the slots' `slotchange` a turn, and the render it causes.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
    return el;
}

const dialog = (el: HmiModal) =>
    el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;

const part = (el: HmiModal, name: string) =>
    el.shadowRoot?.querySelector(`[part~="${name}"]`) as HTMLElement | null;

const listen = <T>(el: HmiModal, type: string) => {
    const events: CustomEvent<T>[] = [];
    el.addEventListener(type, (e) => events.push(e as CustomEvent<T>));
    return events;
};

const ACTIONS: DialogAction[] = [
    { label: 'Cancel', value: 'cancel' },
    { label: 'Save', value: 'save', variant: 'primary' },
    { label: 'Delete', value: 'delete', variant: 'danger' },
];

afterEach(() => {
    document.body.replaceChildren();
    document.documentElement.style.overflow = '';
});

describe('hmi-modal', () => {
    it('registers', () => {
        expect(customElements.get('hmi-modal')).toBeDefined();
    });

    it('is closed by default, and opens as a modal dialog from open', async () => {
        const el = await fixture(html`<hmi-modal></hmi-modal>`);
        expect(dialog(el).open).toBe(false);
        el.open = true;
        await el.updateComplete;
        expect(dialog(el).open).toBe(true);
        // `showModal()` puts it in the top layer and makes the page inert.
        expect(dialog(el).matches(':modal')).toBe(true);
    });

    it('opens from the open attribute, and reflects open', async () => {
        const el = await fixture(html`<hmi-modal open></hmi-modal>`);
        expect(dialog(el).open).toBe(true);
        el.open = false;
        await el.updateComplete;
        expect(el.hasAttribute('open')).toBe(false);
        expect(dialog(el).open).toBe(false);
    });

    it('exposes the dialog as base and panel, with the panel tokens', async () => {
        const el = await fixture(
            html`<hmi-modal
                open
                style="--panel-bg-strong: rgb(1, 2, 3); --on-background: rgb(4, 5, 6)"
            ></hmi-modal>`,
        );
        expect(part(el, 'base')).toBe(dialog(el));
        expect(part(el, 'panel')).toBe(dialog(el));
        const style = getComputedStyle(dialog(el));
        expect(style.backgroundColor).toBe('rgb(1, 2, 3)');
        expect(style.color).toBe('rgb(4, 5, 6)');
    });

    it('sizes the panel from size: 55 base units, or 75 when large', async () => {
        const el = await fixture(html`<hmi-modal open></hmi-modal>`);
        expect(getComputedStyle(dialog(el)).maxWidth).toBe('440px');
        el.size = 'large';
        await el.updateComplete;
        expect(el.getAttribute('size')).toBe('large');
        expect(getComputedStyle(dialog(el)).maxWidth).toBe('600px');
    });

    it('shows heading and description as the defaults of their slots', async () => {
        const el = await fixture(
            html`<hmi-modal
                open
                heading="Confirm publish"
                description="Visible to anyone with the link."
            ></hmi-modal>`,
        );
        expect(part(el, 'title')?.textContent?.trim()).toBe('Confirm publish');
        expect(part(el, 'title')?.tagName).toBe('H2');
        expect(part(el, 'description')?.textContent?.trim()).toBe(
            'Visible to anyone with the link.',
        );
    });

    it('names the dialog by its title and describes it by its description', async () => {
        const el = await fixture(
            html`<hmi-modal open heading="Edit" description="Changes apply at once."></hmi-modal>`,
        );
        expect(dialog(el).getAttribute('aria-labelledby')).toBe('title');
        expect(dialog(el).getAttribute('aria-describedby')).toBe('description');
        expect(dialog(el).hasAttribute('aria-label')).toBe(false);
        expect(
            el.shadowRoot?.getElementById('title')?.textContent?.trim(),
        ).toBe('Edit');
    });

    it('takes a slotted title and description in place of the strings', async () => {
        const el = await fixture(
            html`<hmi-modal open heading="Plain">
                <span slot="title">Rich <em>title</em></span>
                <span slot="description">Rich description</span>
            </hmi-modal>`,
        );
        expect(
            (
                el.shadowRoot?.querySelector(
                    'slot[name="title"]',
                ) as HTMLSlotElement
            ).assignedNodes(),
        ).toHaveLength(1);
        expect(dialog(el).getAttribute('aria-labelledby')).toBe('title');
        // The string is only the default: the slotted title replaces it.
        expect(part(el, 'title')?.textContent).not.toContain('Plain');
        expect(part(el, 'description')?.hidden).toBe(false);
    });

    it('hides the title, the description and the footer when there is nothing for them', async () => {
        const el = await fixture(html`<hmi-modal open>body</hmi-modal>`);
        expect(part(el, 'title')?.hidden).toBe(true);
        expect(part(el, 'description')?.hidden).toBe(true);
        expect(part(el, 'actions')?.hidden).toBe(true);
        expect(dialog(el).hasAttribute('aria-labelledby')).toBe(false);
        expect(dialog(el).hasAttribute('aria-describedby')).toBe(false);
    });

    it('names a dialog with no title from label', async () => {
        const el = await fixture(
            html`<hmi-modal open label="Image preview"></hmi-modal>`,
        );
        expect(dialog(el).getAttribute('aria-label')).toBe('Image preview');
        expect(dialog(el).hasAttribute('aria-labelledby')).toBe(false);
    });

    it('prefers the title over label for the name', async () => {
        const el = await fixture(
            html`<hmi-modal open heading="Edit" label="Ignored"></hmi-modal>`,
        );
        expect(dialog(el).hasAttribute('aria-label')).toBe(false);
        expect(dialog(el).getAttribute('aria-labelledby')).toBe('title');
    });

    it('renders the actions array as buttons, secondary unless said otherwise', async () => {
        const el = await fixture(
            html`<hmi-modal open .actions=${ACTIONS}></hmi-modal>`,
        );
        const buttons = Array.from(
            el.shadowRoot?.querySelectorAll('hmi-button[part="action"]') ?? [],
        );
        expect(buttons.map((b) => b.textContent?.trim())).toEqual([
            'Cancel',
            'Save',
            'Delete',
        ]);
        expect(buttons.map((b) => b.getAttribute('variant'))).toEqual([
            'secondary',
            'primary',
            'danger',
        ]);
        expect(part(el, 'actions')?.hidden).toBe(false);
    });

    it('takes actions as a property only: the attribute is ignored', async () => {
        const el = await fixture(
            html`<hmi-modal open actions='[{"label":"A","value":"a"}]'></hmi-modal>`,
        );
        expect(part(el, 'actions')?.hidden).toBe(true);
    });

    it('fires hmi-action with the value of the activated action, and stays open', async () => {
        const el = await fixture(
            html`<hmi-modal open .actions=${ACTIONS}></hmi-modal>`,
        );
        const events = listen<ModalActionDetail>(el, 'hmi-action');
        (
            el.shadowRoot?.querySelectorAll('hmi-button')[1] as HTMLElement
        ).click();
        expect(events.map((e) => e.detail)).toEqual([{ value: 'save' }]);
        expect(events[0]?.bubbles).toBe(true);
        expect(events[0]?.composed).toBe(true);
        expect(el.open).toBe(true);
    });

    it('lets slotted actions replace the array', async () => {
        const el = await fixture(
            html`<hmi-modal open .actions=${ACTIONS}>
                <hmi-button slot="actions">Close</hmi-button>
            </hmi-modal>`,
        );
        const slot = el.shadowRoot?.querySelector(
            'slot[name="actions"]',
        ) as HTMLSlotElement;
        expect(slot.assignedElements()).toHaveLength(1);
        expect(part(el, 'actions')?.hidden).toBe(false);
    });

    it('asks to close on Escape with hmi-close, and stays open until open is set to false', async () => {
        const el = await fixture(
            html`<hmi-modal open heading="Edit"></hmi-modal>`,
        );
        const events = listen<ModalCloseDetail>(el, 'hmi-close');
        await userEvent.keyboard('{Escape}');
        expect(events.map((e) => e.detail)).toEqual([{ reason: 'escape' }]);
        expect(events[0]?.cancelable).toBe(true);
        expect(events[0]?.bubbles).toBe(true);
        expect(events[0]?.composed).toBe(true);
        expect(el.open).toBe(true);
        expect(dialog(el).open).toBe(true);
    });

    it('keeps the dialog open through repeated Escape presses, where the browser would close it', async () => {
        const el = await fixture(
            html`<hmi-modal open heading="Edit"></hmi-modal>`,
        );
        const events = listen<ModalCloseDetail>(el, 'hmi-close');
        await userEvent.keyboard('{Escape}');
        await userEvent.keyboard('{Escape}');
        await userEvent.keyboard('{Escape}');
        await new Promise((resolve) => setTimeout(resolve, 20));
        expect(events.length).toBeGreaterThanOrEqual(3);
        expect(dialog(el).matches(':modal')).toBe(true);
        expect(el.open).toBe(true);
    });

    it('closes when the consumer sets open to false from the hmi-close listener', async () => {
        const el = await fixture(
            html`<hmi-modal open heading="Edit"></hmi-modal>`,
        );
        el.addEventListener('hmi-close', () => {
            el.open = false;
        });
        await userEvent.keyboard('{Escape}');
        await el.updateComplete;
        expect(dialog(el).open).toBe(false);
    });

    it('asks to close on a press outside the panel, through the backdrop', async () => {
        const el = await fixture(
            html`<hmi-modal open heading="Edit"></hmi-modal>`,
        );
        const events = listen<ModalCloseDetail>(el, 'hmi-close');
        const box = dialog(el).getBoundingClientRect();
        // A press on the backdrop is delivered to the dialog, outside its box.
        dialog(el).dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                composed: true,
                clientX: Math.max(0, box.left - 10),
                clientY: Math.max(0, box.top - 10),
            }),
        );
        expect(events.map((e) => e.detail)).toEqual([{ reason: 'backdrop' }]);
        expect(el.open).toBe(true);
    });

    it('does not ask to close on a press inside the panel, its padding included', async () => {
        const el = await fixture(
            html`<hmi-modal open heading="Edit"></hmi-modal>`,
        );
        const events = listen<ModalCloseDetail>(el, 'hmi-close');
        const box = dialog(el).getBoundingClientRect();
        dialog(el).dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                composed: true,
                clientX: box.left + 2,
                clientY: box.top + 2,
            }),
        );
        part(el, 'title')?.dispatchEvent(
            new MouseEvent('mousedown', { bubbles: true, composed: true }),
        );
        expect(events).toHaveLength(0);
    });

    it('stops the page scrolling while open, and lets it scroll again on close', async () => {
        const el = await fixture(html`<hmi-modal></hmi-modal>`);
        expect(document.documentElement.style.overflow).toBe('');
        el.open = true;
        await el.updateComplete;
        expect(document.documentElement.style.overflow).toBe('hidden');
        el.open = false;
        await el.updateComplete;
        expect(document.documentElement.style.overflow).toBe('');
    });

    it('lets the page scroll again when removed while open', async () => {
        const el = await fixture(html`<hmi-modal open></hmi-modal>`);
        expect(document.documentElement.style.overflow).toBe('hidden');
        el.remove();
        expect(document.documentElement.style.overflow).toBe('');
    });

    it('moves focus into the dialog on open, and back to what had it on close', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<button id="trigger">Open</button>
                <hmi-modal heading="Edit"><button id="inside">Inside</button></hmi-modal>`,
            host,
        );
        const el = host.querySelector('hmi-modal') as HmiModal;
        await el.updateComplete;
        const trigger = host.querySelector('#trigger') as HTMLButtonElement;
        trigger.focus();
        el.open = true;
        await el.updateComplete;
        const active = activeElementDeep(document);
        expect(active?.id).toBe('inside');
        el.open = false;
        await el.updateComplete;
        expect(activeElementDeep(document)).toBe(trigger);
    });

    it('opens again when taken out of the document and put back while open', async () => {
        const el = await fixture(
            html`<hmi-modal open heading="Edit"></hmi-modal>`,
        );
        const other = document.createElement('div');
        document.body.append(other);
        el.remove();
        other.append(el);
        await el.updateComplete;
        expect(dialog(el).matches(':modal')).toBe(true);
        expect(document.documentElement.style.overflow).toBe('hidden');
    });

    it('gives its panel the spring-in animation only while open', async () => {
        // The animation shorthand needs the motion tokens the theme defines.
        const el = await fixture(
            html`<hmi-modal
                style="--duration-medium-2: 200ms; --easing-spring: ease"
            ></hmi-modal>`,
        );
        expect(getComputedStyle(dialog(el)).animationName).toBe('none');
        el.open = true;
        await el.updateComplete;
        expect(getComputedStyle(dialog(el)).animationName).toContain(
            'modal-in',
        );
    });
});

describe('Modal (React wrapper)', () => {
    it('mounts through the React wrapper, with its properties and events', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const closes: ModalCloseDetail[] = [];
        const actions: string[] = [];
        await act(async () => {
            root.render(
                createElement(
                    Modal,
                    {
                        open: true,
                        heading: 'Edit',
                        size: 'large',
                        actions: ACTIONS,
                        onClose: (e) => closes.push(e.detail),
                        onAction: (e) => actions.push(e.detail.value),
                    },
                    createElement('p', null, 'Body'),
                ),
            );
        });
        const el = host.querySelector('hmi-modal') as HmiModal;
        await el.updateComplete;
        expect(el.open).toBe(true);
        expect(el.size).toBe('large');
        expect(dialog(el).open).toBe(true);
        await userEvent.keyboard('{Escape}');
        expect(closes).toEqual([{ reason: 'escape' }]);
        (
            el.shadowRoot?.querySelectorAll('hmi-button')[2] as HTMLElement
        ).click();
        expect(actions).toEqual(['delete']);
        await act(async () => root.unmount());
    });
});
