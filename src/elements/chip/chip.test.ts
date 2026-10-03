import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './chip.js';
import type { ChipSelectDetail, HmiChip } from './chip.js';
import { Chip } from './chip.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiChip> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiChip;
    await el.updateComplete;
    return el;
}

const part = (el: HmiChip, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(`[part~="${name}"]`);

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-chip', () => {
    it('registers', () => {
        expect(customElements.get('hmi-chip')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-chip>Filter</hmi-chip>`);
        const { width, height } = (
            part(el, 'base') as Element
        ).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBe(30);
    });

    it('has defaults', async () => {
        const el = await fixture(html`<hmi-chip>Filter</hmi-chip>`);
        expect(el.selected).toBe(false);
        expect(el.selectable).toBe(false);
        expect(el.closable).toBe(false);
        expect(el.closeLabel).toBe('Remove');
    });

    it('reflects selected, selectable and closable', async () => {
        const el = await fixture(html`<hmi-chip>Filter</hmi-chip>`);
        el.selected = el.selectable = el.closable = true;
        await el.updateComplete;
        expect(el.hasAttribute('selected')).toBe(true);
        expect(el.hasAttribute('selectable')).toBe(true);
        expect(el.hasAttribute('closable')).toBe(true);
    });

    it('is a static span unless selectable', async () => {
        const el = await fixture(html`<hmi-chip>Filter</hmi-chip>`);
        expect(part(el, 'control')?.tagName).toBe('SPAN');
        expect(part(el, 'close')).toBeNull();
        let fired = 0;
        el.addEventListener('hmi-select', () => {
            fired += 1;
        });
        part(el, 'control')?.click();
        expect(fired).toBe(0);
    });

    it('toggles when selectable and reports the next state', async () => {
        const el = await fixture(html`<hmi-chip selectable>Filter</hmi-chip>`);
        const control = part(el, 'control') as HTMLElement;
        expect(control.tagName).toBe('BUTTON');
        expect(control.getAttribute('aria-pressed')).toBe('false');
        const details: ChipSelectDetail[] = [];
        el.addEventListener('hmi-select', (event) => {
            details.push((event as CustomEvent<ChipSelectDetail>).detail);
        });
        control.click();
        await el.updateComplete;
        expect(details).toEqual([{ selected: true }]);
        expect(el.selected).toBe(true);
        expect(control.getAttribute('aria-pressed')).toBe('true');
        control.click();
        await el.updateComplete;
        expect(details[1]).toEqual({ selected: false });
        expect(el.selected).toBe(false);
    });

    it('keeps its state when hmi-select is cancelled', async () => {
        const el = await fixture(html`<hmi-chip selectable>Filter</hmi-chip>`);
        el.addEventListener('hmi-select', (event) => event.preventDefault());
        part(el, 'control')?.click();
        await el.updateComplete;
        expect(el.selected).toBe(false);
        expect(el.hasAttribute('selected')).toBe(false);
    });

    it('shows a labelled remove button when closable', async () => {
        const el = await fixture(
            html`<hmi-chip closable close-label="Drop tag">Filter</hmi-chip>`,
        );
        const close = part(el, 'close') as HTMLElement;
        expect(close.tagName).toBe('BUTTON');
        expect(close.getAttribute('aria-label')).toBe('Drop tag');
        expect(close.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
            'true',
        );
    });

    it('hides itself on close unless hmi-close is cancelled', async () => {
        const el = await fixture(html`<hmi-chip closable>Filter</hmi-chip>`);
        let cancel = true;
        let fired = 0;
        el.addEventListener('hmi-close', (event) => {
            fired += 1;
            expect((event as CustomEvent).detail).toEqual({});
            if (cancel) event.preventDefault();
        });
        part(el, 'close')?.click();
        expect(fired).toBe(1);
        expect(el.hidden).toBe(false);
        cancel = false;
        part(el, 'close')?.click();
        expect(fired).toBe(2);
        expect(el.hidden).toBe(true);
        expect(getComputedStyle(el).display).toBe('none');
    });

    it('does not nest the controls', async () => {
        const el = await fixture(
            html`<hmi-chip selectable closable>Filter</hmi-chip>`,
        );
        expect(el.shadowRoot?.querySelectorAll('button button')).toHaveLength(
            0,
        );
        expect(el.shadowRoot?.querySelectorAll('button')).toHaveLength(2);
    });

    it('slots the icon and sizes a slotted svg', async () => {
        const el = await fixture(
            html`<hmi-chip
                ><svg slot="icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg
                >Filter</hmi-chip
            >`,
        );
        const slot = part(el, 'icon') as HTMLSlotElement;
        expect(slot.assignedElements()).toHaveLength(1);
        const { width } = (
            el.querySelector('svg') as Element
        ).getBoundingClientRect();
        expect(width).toBe(14);
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        const selects: boolean[] = [];
        let closed = 0;
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Chip,
                    {
                        selectable: true,
                        closable: true,
                        onSelect: (event) => {
                            selects.push(event.detail.selected);
                        },
                        onClose: () => {
                            closed += 1;
                        },
                    },
                    'Filter',
                ),
            );
        });
        const el = mount.querySelector('hmi-chip') as HmiChip;
        await el.updateComplete;
        expect(el.selectable).toBe(true);
        expect(el.closable).toBe(true);
        part(el, 'control')?.click();
        part(el, 'close')?.click();
        expect(selects).toEqual([true]);
        expect(closed).toBe(1);
    });
});
