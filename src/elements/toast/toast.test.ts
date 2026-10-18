import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import '../modal/modal.js';
import { getToasts, resetToasts } from '../shared/toast.js';
import './toast.js';
import { type HmiToast, type ToastDismissDetail, toast } from './toast.js';
import { toast as reactToast, ToastHost } from './toast.react.js';

async function fixture(
    template: ReturnType<typeof html> = html`<hmi-toast></hmi-toast>`,
) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-toast') as HmiToast;
    await el.updateComplete;
    return el;
}

const list = (el: HmiToast) =>
    el.shadowRoot?.querySelector('.list') as HTMLElement;
const toasts = (el: HmiToast) =>
    Array.from(el.shadowRoot?.querySelectorAll<HTMLElement>('.toast') ?? []);
const part = (node: Element | null | undefined, name: string) =>
    node?.querySelector<HTMLElement>(`[part~="${name}"]`) ?? null;
const text = (node: Element | null | undefined) => node?.textContent?.trim();
const closeButton = (item: HTMLElement) =>
    part(item, 'close') as HTMLButtonElement;
const listen = <T>(el: HmiToast, type: string) => {
    const events: CustomEvent<T>[] = [];
    el.addEventListener(type, (e) => events.push(e as CustomEvent<T>));
    return events;
};
const settle = async (el: HmiToast) => {
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
};

beforeEach(async () => {
    await page.viewport(1000, 800);
});

afterEach(async () => {
    resetToasts();
    document.body.replaceChildren();
    const park = document.createElement('div');
    park.style.cssText =
        'position: fixed; left: 0; top: 0; width: 20px; height: 20px';
    document.body.append(park);
    await userEvent.hover(park);
    park.remove();
});

describe('hmi-toast', () => {
    it('registers', () => {
        expect(customElements.get('hmi-toast')).toBeDefined();
    });

    describe('the stack', () => {
        it('is a manual popover that is open while the element is connected, and a polite live region', async () => {
            const el = await fixture();
            const stack = list(el);
            expect(stack.getAttribute('popover')).toBe('manual');
            expect(stack.matches(':popover-open')).toBe(true);
            expect(stack.getAttribute('aria-live')).toBe('polite');
            expect(stack.getAttribute('part')).toBe('base list');
        });

        it('takes no room while it is empty, and does not catch the pointer', async () => {
            const el = await fixture();
            const box = list(el).getBoundingClientRect();
            expect(box.width).toBe(0);
            expect(box.height).toBe(0);
            expect(getComputedStyle(list(el)).pointerEvents).toBe('none');
        });

        it('is pinned 3 base units from the bottom right, over the page', async () => {
            const el = await fixture();
            toast.info('Hello', 'There', { duration: 0 });
            await settle(el);
            const box = toasts(el)[0]?.getBoundingClientRect() as DOMRect;
            expect(box.right).toBe(1000 - 24);
            expect(box.bottom).toBe(800 - 24);
            expect(box.width).toBe(320);
        });

        it('is open again when the element is put back in the document', async () => {
            const el = await fixture();
            const host = el.parentElement as HTMLElement;
            el.remove();
            host.append(el);
            await settle(el);
            expect(list(el).matches(':popover-open')).toBe(true);
        });

        it('shows the toasts that were queued before it mounted', async () => {
            toast.success('Early', undefined, { duration: 0 });
            const el = await fixture();
            expect(toasts(el).map((item) => text(part(item, 'title')))).toEqual(
                ['Early'],
            );
        });

        it('shows the same queue in every stack', async () => {
            const a = await fixture();
            const b = await fixture();
            toast.info('Both', undefined, { duration: 0 });
            await settle(a);
            await settle(b);
            expect(toasts(a)).toHaveLength(1);
            expect(toasts(b)).toHaveLength(1);
        });

        it('paints each toast from the panel tokens, and exports it as a panel part', async () => {
            const el = await fixture(
                html`<hmi-toast
                    style="--panel-bg: rgb(1, 2, 3); --panel-border: rgb(4, 5, 6)"
                ></hmi-toast>`,
            );
            toast.info('x', undefined, { duration: 0 });
            await settle(el);
            const item = toasts(el)[0] as HTMLElement;
            expect(item.getAttribute('part')).toBe('toast panel');
            const style = getComputedStyle(item);
            expect(style.backgroundColor).toBe('rgb(1, 2, 3)');
            expect(style.borderTopColor).toBe('rgb(4, 5, 6)');
        });
    });

    describe('a toast', () => {
        it('shows its title and body, in order of arrival, as a status', async () => {
            const el = await fixture();
            toast.info('First', 'one', { duration: 0 });
            toast.success('Second', 'two', { duration: 0 });
            await settle(el);
            const items = toasts(el);
            expect(items.map((item) => text(part(item, 'title')))).toEqual([
                'First',
                'Second',
            ]);
            expect(items.map((item) => text(part(item, 'body')))).toEqual([
                'one',
                'two',
            ]);
            for (const item of items) {
                expect(item.getAttribute('role')).toBe('status');
            }
        });

        it('leaves out the line it has no text for', async () => {
            const el = await fixture();
            toast.info('Only a title', undefined, { duration: 0 });
            toast.info('', 'Only a body', { duration: 0 });
            await settle(el);
            const [titled, bodied] = toasts(el) as [HTMLElement, HTMLElement];
            expect(part(titled, 'title')).not.toBeNull();
            expect(part(titled, 'body')).toBeNull();
            expect(part(bodied, 'title')).toBeNull();
            expect(text(part(bodied, 'body'))).toBe('Only a body');
        });

        it('shows a DOM node as its title or its body', async () => {
            const el = await fixture();
            const link = document.createElement('a');
            link.href = '#undo';
            link.textContent = 'Undo';
            const heading = document.createElement('b');
            heading.textContent = 'Archived';
            toast.info(heading, link, { duration: 0 });
            await settle(el);
            const item = toasts(el)[0] as HTMLElement;
            expect(part(item, 'title')?.firstElementChild).toBe(heading);
            expect(part(item, 'body')?.firstElementChild).toBe(link);
        });

        it('takes its variant, and shows the icon of it in its colour', async () => {
            const el = await fixture();
            for (const variant of [
                'info',
                'success',
                'warning',
                'danger',
            ] as const) {
                toast[variant]('x', undefined, { duration: 0 });
            }
            await settle(el);
            const items = toasts(el);
            expect(items.map((item) => item.dataset.variant)).toEqual([
                'info',
                'success',
                'warning',
                'danger',
            ]);
            for (const item of items) {
                const icon = part(item, 'icon') as HTMLElement;
                expect(
                    icon.querySelector('svg')?.getBoundingClientRect().width,
                ).toBe(20);
            }
        });

        it('colours the icon by variant, from the tokens', async () => {
            const el = await fixture(
                html`<hmi-toast
                    style="--tertiary: rgb(1, 1, 1); --success: rgb(2, 2, 2); --warning: rgb(3, 3, 3); --error: rgb(4, 4, 4)"
                ></hmi-toast>`,
            );
            for (const variant of [
                'info',
                'success',
                'warning',
                'danger',
            ] as const) {
                toast[variant]('x', undefined, { duration: 0 });
            }
            await settle(el);
            expect(
                toasts(el).map(
                    (item) =>
                        getComputedStyle(part(item, 'icon') as Element).color,
                ),
            ).toEqual([
                'rgb(1, 1, 1)',
                'rgb(2, 2, 2)',
                'rgb(3, 3, 3)',
                'rgb(4, 4, 4)',
            ]);
        });

        it('goes away by itself after its duration, after an exit', async () => {
            const el = await fixture();
            toast.info('Brief', undefined, { duration: 150 });
            await settle(el);
            expect(toasts(el)).toHaveLength(1);
            await vi.waitFor(
                () => expect(toasts(el)[0]?.dataset.leaving).toBe('true'),
                { timeout: 1000 },
            );
            await vi.waitFor(() => expect(toasts(el)).toHaveLength(0), {
                timeout: 1000,
            });
        });

        it('stays with a duration of 0, until it is dismissed', async () => {
            const el = await fixture();
            const id = toast.info('Sticky', undefined, { duration: 0 });
            await new Promise((resolve) => setTimeout(resolve, 500));
            await settle(el);
            expect(toasts(el)).toHaveLength(1);
            toast.dismiss(id);
            await vi.waitFor(() => expect(toasts(el)).toHaveLength(0), {
                timeout: 1000,
            });
        });
    });

    describe('the close button', () => {
        it('is named Dismiss, or by dismiss-label', async () => {
            const el = await fixture();
            toast.info('x', undefined, { duration: 0 });
            await settle(el);
            expect(
                closeButton(toasts(el)[0] as HTMLElement).getAttribute(
                    'aria-label',
                ),
            ).toBe('Dismiss');
            el.dismissLabel = 'Chiudi';
            await settle(el);
            expect(
                closeButton(toasts(el)[0] as HTMLElement).getAttribute(
                    'aria-label',
                ),
            ).toBe('Chiudi');
            const named = await fixture(
                html`<hmi-toast dismiss-label="Fermer"></hmi-toast>`,
            );
            toast.info('y', undefined, { duration: 0 });
            await settle(named);
            expect(
                closeButton(toasts(named)[0] as HTMLElement).getAttribute(
                    'aria-label',
                ),
            ).toBe('Fermer');
        });

        it('asks with hmi-dismiss and dismisses the toast', async () => {
            const el = await fixture();
            const events = listen<ToastDismissDetail>(el, 'hmi-dismiss');
            const id = toast.info('x', undefined, { duration: 0 });
            await settle(el);
            await userEvent.click(closeButton(toasts(el)[0] as HTMLElement));
            expect(events.map((e) => e.detail)).toEqual([{ id }]);
            expect(events[0]?.cancelable).toBe(true);
            expect(events[0]?.bubbles).toBe(true);
            expect(events[0]?.composed).toBe(true);
            await vi.waitFor(() => expect(toasts(el)).toHaveLength(0), {
                timeout: 1000,
            });
        });

        it('keeps the toast when a listener cancels hmi-dismiss', async () => {
            const el = await fixture();
            el.addEventListener('hmi-dismiss', (event) =>
                event.preventDefault(),
            );
            toast.info('x', undefined, { duration: 0 });
            await settle(el);
            await userEvent.click(closeButton(toasts(el)[0] as HTMLElement));
            await new Promise((resolve) => setTimeout(resolve, 400));
            await settle(el);
            expect(toasts(el)).toHaveLength(1);
            expect(toasts(el)[0]?.dataset.leaving).toBe('false');
        });

        it('is the only thing that fires hmi-dismiss: not the clock, not toast.dismiss', async () => {
            const el = await fixture();
            const events = listen(el, 'hmi-dismiss');
            const id = toast.info('a', undefined, { duration: 0 });
            toast.info('b', undefined, { duration: 100 });
            await settle(el);
            toast.dismiss(id);
            await vi.waitFor(() => expect(toasts(el)).toHaveLength(0), {
                timeout: 2000,
            });
            expect(events).toHaveLength(0);
        });
    });

    describe('the clock', () => {
        it('stops while the pointer is over a toast, and goes on when it leaves', async () => {
            const el = await fixture();
            toast.info('Hover', undefined, { duration: 500 });
            await settle(el);
            await userEvent.hover(toasts(el)[0] as HTMLElement);
            await new Promise((resolve) => setTimeout(resolve, 900));
            await settle(el);
            expect(toasts(el)).toHaveLength(1);
            expect(toasts(el)[0]?.dataset.leaving).toBe('false');
            await userEvent.unhover(toasts(el)[0] as HTMLElement);
            await vi.waitFor(() => expect(toasts(el)).toHaveLength(0), {
                timeout: 2000,
            });
        });

        it('stops while focus is inside a toast, and goes on when it leaves', async () => {
            const el = await fixture();
            toast.info('Focus', undefined, { duration: 400 });
            await settle(el);
            const button = closeButton(toasts(el)[0] as HTMLElement);
            button.focus();
            await new Promise((resolve) => setTimeout(resolve, 800));
            await settle(el);
            expect(toasts(el)).toHaveLength(1);
            button.blur();
            await vi.waitFor(() => expect(toasts(el)).toHaveLength(0), {
                timeout: 2000,
            });
        });

        it('stays stopped while either the pointer or focus holds it', async () => {
            const el = await fixture();
            toast.info('Both', undefined, { duration: 300 });
            await settle(el);
            const item = toasts(el)[0] as HTMLElement;
            await userEvent.hover(item);
            closeButton(item).focus();
            await userEvent.unhover(item);
            await new Promise((resolve) => setTimeout(resolve, 700));
            expect(toasts(el)).toHaveLength(1);
            closeButton(item).blur();
            await vi.waitFor(() => expect(toasts(el)).toHaveLength(0), {
                timeout: 2000,
            });
        });

        it('goes on when the stack is taken out of the document while a toast is held', async () => {
            const el = await fixture();
            toast.info('Held', undefined, { duration: 300 });
            await settle(el);
            await userEvent.hover(toasts(el)[0] as HTMLElement);
            el.remove();
            await vi.waitFor(() => expect(getToasts()).toHaveLength(0), {
                timeout: 2000,
            });
        });
    });

    describe('under a modal dialog', () => {
        it('stays under its scrim and out of reach until it closes: the page behind a modal is inert', async () => {
            const el = await fixture();
            const modal = document.createElement('hmi-modal');
            modal.heading = 'Edit';
            document.body.append(modal);
            await modal.updateComplete;
            toast.info('Under', undefined, { duration: 0 });
            await settle(el);
            const item = toasts(el)[0] as HTMLElement;
            const box = item.getBoundingClientRect();
            const point = [box.left + 20, box.top + 20] as const;
            modal.open = true;
            await modal.updateComplete;
            // The scrim answers where the toast is: it can be neither clicked nor focused.
            expect(document.elementFromPoint(...point)).toBe(modal);
            modal.open = false;
            await modal.updateComplete;
            expect(document.elementFromPoint(...point)).toBe(el);
        });
    });

    describe('a toast raised from React', () => {
        it('mounts through the React wrapper, with its properties and events', async () => {
            const host = document.createElement('div');
            document.body.append(host);
            const root = createRoot(host);
            const onDismiss = vi.fn();
            await act(async () => {
                root.render(
                    createElement(ToastHost, {
                        dismissLabel: 'Close',
                        onDismiss,
                    }),
                );
            });
            const el = host.querySelector('hmi-toast') as HmiToast;
            expect(el.dismissLabel).toBe('Close');
            expect(reactToast).toBe(toast);
            const id = reactToast.success('Saved', 'Changes synced.', {
                duration: 0,
            });
            await settle(el);
            expect(text(part(toasts(el)[0] as HTMLElement, 'title'))).toBe(
                'Saved',
            );
            await userEvent.click(closeButton(toasts(el)[0] as HTMLElement));
            expect(onDismiss).toHaveBeenCalledOnce();
            expect(onDismiss.mock.calls[0]?.[0].detail).toEqual({ id });
            await act(async () => root.unmount());
        });
    });
});
