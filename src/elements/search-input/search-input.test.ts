import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './search-input.js';
import type { HmiSearchInput, SearchInputValueDetail } from './search-input.js';
import { SearchInput } from './search-input.react.js';

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiSearchInput> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-search-input') as HmiSearchInput;
    await el.updateComplete;
    return el;
}

const part = (el: HmiSearchInput, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const field = (el: HmiSearchInput) => part(el, 'control') as HTMLInputElement;
const slot = (el: HmiSearchInput, name: string) =>
    el.shadowRoot?.querySelector<HTMLSlotElement>(
        `slot[name="${name}"]`,
    ) as HTMLSlotElement;
const builtIn = (el: HmiSearchInput) =>
    el.shadowRoot?.querySelector<HTMLElement>('.search-icon') as HTMLElement;

async function type(el: HmiSearchInput, value: string): Promise<void> {
    const input = field(el);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-search-input', () => {
    it('registers', () => {
        expect(customElements.get('hmi-search-input')).toBeDefined();
    });

    it('renders the field box at its height, as a search field', async () => {
        const el = await fixture(html`<hmi-search-input></hmi-search-input>`);
        expect(part(el, 'base').getBoundingClientRect().height).toBe(40);
        expect(field(el).type).toBe('search');
    });

    it('defaults the placeholder to "Search…" and lets it be changed or cleared', async () => {
        const el = await fixture(html`<hmi-search-input></hmi-search-input>`);
        expect(el.placeholder).toBe('Search…');
        expect(field(el).placeholder).toBe('Search…');
        el.placeholder = 'Find a component…';
        await el.updateComplete;
        expect(field(el).placeholder).toBe('Find a component…');
        el.placeholder = '';
        await el.updateComplete;
        expect(field(el).placeholder).toBe('');
    });

    it('ignores the type property', async () => {
        const el = await fixture(
            html`<hmi-search-input type="password"></hmi-search-input>`,
        );
        expect(field(el).type).toBe('search');
    });

    it('draws the built-in search icon, sized in base units', async () => {
        const el = await fixture(html`<hmi-search-input></hmi-search-input>`);
        const svg = builtIn(el).querySelector('svg') as Element;
        expect(svg.getBoundingClientRect().width).toBe(16);
        expect(builtIn(el).getAttribute('aria-hidden')).toBe('true');
        expect(slot(el, 'left-icon').assignedElements()).toHaveLength(0);
    });

    it('replaces the built-in icon with a slotted one', async () => {
        const el = await fixture(
            html`<hmi-search-input>
                <svg slot="left-icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg>
            </hmi-search-input>`,
        );
        expect(slot(el, 'left-icon').assignedElements()).toHaveLength(1);
        expect(builtIn(el).getBoundingClientRect().width).toBe(0);
    });

    it('has a right-icon slot', async () => {
        const el = await fixture(
            html`<hmi-search-input>
                <svg slot="right-icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg>
            </hmi-search-input>`,
        );
        expect(slot(el, 'right-icon').assignedElements()).toHaveLength(1);
    });

    it('fires hmi-input and hmi-change like hmi-input, and takes part in the form', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        render(
            html`<form><hmi-search-input name="q" value="start"></hmi-search-input></form>`,
            host,
        );
        const el = host.querySelector('hmi-search-input') as HmiSearchInput;
        await el.updateComplete;
        const log: string[] = [];
        el.addEventListener('hmi-input', (e) =>
            log.push(
                `input:${(e as CustomEvent<SearchInputValueDetail>).detail.value}`,
            ),
        );
        el.addEventListener('hmi-change', (e) =>
            log.push(
                `change:${(e as CustomEvent<SearchInputValueDetail>).detail.value}`,
            ),
        );
        await type(el, 'tabs');
        field(el).dispatchEvent(new Event('change', { bubbles: true }));
        expect(log).toEqual(['input:tabs', 'change:tabs']);
        const form = host.querySelector('form') as HTMLFormElement;
        expect(new FormData(form).get('q')).toBe('tabs');
        form.reset();
        await el.updateComplete;
        expect(el.value).toBe('start');
    });

    it('draws the label and hint, and the error instead of the hint', async () => {
        const el = await fixture(
            html`<hmi-search-input label="Search" hint="Press Enter"></hmi-search-input>`,
        );
        expect((part(el, 'label') as HTMLLabelElement).htmlFor).toBe('control');
        expect(part(el, 'hint').textContent?.trim()).toBe('Press Enter');
        el.error = 'No results';
        await el.updateComplete;
        expect(part(el, 'error').textContent?.trim()).toBe('No results');
        expect(field(el).getAttribute('aria-invalid')).toBe('true');
    });

    it('is disabled', async () => {
        const el = await fixture(
            html`<hmi-search-input disabled></hmi-search-input>`,
        );
        expect(field(el).disabled).toBe(true);
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        const typed: string[] = [];
        await act(async () => {
            createRoot(mount).render(
                createElement(SearchInput, {
                    name: 'q',
                    label: 'Search',
                    value: 'abc',
                    placeholder: 'Find…',
                    onInput: (e) => typed.push(e.detail.value),
                }),
            );
        });
        const el = mount.querySelector('hmi-search-input') as HmiSearchInput;
        await el.updateComplete;
        expect(el.value).toBe('abc');
        expect(field(el).placeholder).toBe('Find…');
        await type(el, 'abcd');
        expect(typed).toEqual(['abcd']);
    });
});
