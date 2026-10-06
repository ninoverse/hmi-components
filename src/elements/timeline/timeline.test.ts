import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './timeline.js';
import type { HmiTimeline, TimelineItem } from './timeline.js';
import { Timeline } from './timeline.react.js';

const ITEMS: TimelineItem[] = [
    {
        title: 'Created',
        time: '09:24',
        description: 'Scaffolded.',
        color: 'primary',
    },
    { title: 'Green', time: '10:02', color: 'success' },
    { title: 'Waiting' },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-timeline') as HmiTimeline;
    await el.updateComplete;
    return el;
}

const all = (el: HmiTimeline, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`) ?? [],
    );

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-timeline', () => {
    it('registers', () => {
        expect(customElements.get('hmi-timeline')).toBeDefined();
    });

    it('renders an ordered list with an item per event', async () => {
        const el = await fixture(
            html`<hmi-timeline .items=${ITEMS}></hmi-timeline>`,
        );
        expect(el.shadowRoot?.querySelector('ol')).not.toBeNull();
        expect(all(el, 'item')).toHaveLength(3);
        expect(all(el, 'title').map((t) => t.textContent?.trim())).toEqual([
            'Created',
            'Green',
            'Waiting',
        ]);
    });

    it('sets the colour per item, defaulting to default', async () => {
        const el = await fixture(
            html`<hmi-timeline .items=${ITEMS}></hmi-timeline>`,
        );
        expect(
            all(el, 'item').map((i) => i.getAttribute('data-color')),
        ).toEqual(['primary', 'success', 'default']);
    });

    it('shows a time and a description only for items that have them', async () => {
        const el = await fixture(
            html`<hmi-timeline .items=${ITEMS}></hmi-timeline>`,
        );
        expect(all(el, 'time').map((t) => t.hidden)).toEqual([
            false,
            false,
            true,
        ]);
        expect(all(el, 'description').map((d) => d.hidden)).toEqual([
            false,
            true,
            true,
        ]);
        expect(all(el, 'description')[0]?.textContent?.trim()).toBe(
            'Scaffolded.',
        );
        expect(all(el, 'time')[1]?.textContent?.trim()).toBe('10:02');
    });

    it('takes rich title, time, description and icon from the indexed slots', async () => {
        const el = await fixture(
            html`<hmi-timeline .items=${ITEMS}
                ><b slot="title-2">Rich title</b
                ><i slot="time-2">just now</i
                ><span slot="description-2">Rich description</span
                ><svg slot="icon-0" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg
            ></hmi-timeline>`,
        );
        await el.updateComplete;
        const slot = (name: string) =>
            el.shadowRoot?.querySelector(
                `slot[name="${name}"]`,
            ) as HTMLSlotElement;
        expect(slot('title-2').assignedElements()).toHaveLength(1);
        expect(slot('title-0').assignedElements()).toHaveLength(0);
        expect(all(el, 'time')[2]?.hidden).toBe(false);
        expect(all(el, 'description')[2]?.hidden).toBe(false);
        expect(all(el, 'icon').map((i) => i.hidden)).toEqual([
            false,
            true,
            true,
        ]);
    });

    it('draws the connector between markers, but not after the last one', async () => {
        const el = await fixture(
            html`<hmi-timeline .items=${ITEMS}></hmi-timeline>`,
        );
        const markers = all(el, 'marker');
        expect(getComputedStyle(markers[0] as Element, '::after').content).toBe(
            '""',
        );
        expect(getComputedStyle(markers[2] as Element, '::after').content).toBe(
            'none',
        );
    });

    it('draws a hairline between events with divider, and not after the last event', async () => {
        const plain = await fixture(
            html`<hmi-timeline .items=${ITEMS}></hmi-timeline>`,
        );
        const items = (el: HmiTimeline) => all(el, 'item');
        expect(
            getComputedStyle(items(plain)[0] as Element, '::after').content,
        ).toBe('none');
        const divided = await fixture(
            html`<hmi-timeline divider .items=${ITEMS}></hmi-timeline>`,
        );
        expect(divided.divider).toBe(true);
        expect(divided.hasAttribute('divider')).toBe(true);
        expect(
            getComputedStyle(items(divided)[0] as Element, '::after').content,
        ).toBe('""');
        expect(
            getComputedStyle(items(divided)[2] as Element, '::after').content,
        ).toBe('none');
    });

    it('accepts items as a JSON attribute', async () => {
        const el = await fixture(
            html`<hmi-timeline items='[{"title":"A"}]'></hmi-timeline>`,
        );
        expect(all(el, 'item')).toHaveLength(1);
    });
});

describe('Timeline (React wrapper)', () => {
    it('takes items and divider', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(Timeline, { items: ITEMS, divider: true }),
            );
        });
        const el = host.querySelector('hmi-timeline') as HmiTimeline;
        await el.updateComplete;
        expect(all(el, 'item')).toHaveLength(3);
        expect(el.hasAttribute('divider')).toBe(true);
        await act(async () => root.unmount());
    });
});
