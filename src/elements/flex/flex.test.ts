import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './flex.js';
import type { HmiFlex } from './flex.js';
import { Flex } from './flex.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiFlex> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-flex') as HmiFlex;
    await el.updateComplete;
    return el;
}

const items = (el: HmiFlex) => [...el.children] as HTMLElement[];
const boxes = (el: HmiFlex) => items(el).map((i) => i.getBoundingClientRect());

/* Where the items land, not the keyword the browser reports: Chromium 158
   reports `flex-start` as `flow-start`, with the same layout. */
async function set(el: HmiFlex, props: Partial<HmiFlex>): Promise<void> {
    Object.assign(el, props);
    await el.updateComplete;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-flex', () => {
    it('registers', () => {
        expect(customElements.get('hmi-flex')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(
            html`<hmi-flex
                ><span style="width: 40px; height: 10px"></span
            ></hmi-flex>`,
        );
        const { width, height } = el.getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBe(10);
    });

    it('reflects direction, align, justify and gap', async () => {
        const el = await fixture(html`<hmi-flex></hmi-flex>`);
        await set(el, {
            direction: 'column',
            align: 'center',
            justify: 'between',
            gap: 'large',
        });
        expect(el.getAttribute('direction')).toBe('column');
        expect(el.getAttribute('align')).toBe('center');
        expect(el.getAttribute('justify')).toBe('between');
        expect(el.getAttribute('gap')).toBe('large');
        el.setAttribute('direction', 'row-reverse');
        el.setAttribute('align', 'end');
        el.setAttribute('justify', 'evenly');
        el.setAttribute('gap', 'small');
        await el.updateComplete;
        expect(el.direction).toBe('row-reverse');
        expect(el.align).toBe('end');
        expect(el.justify).toBe('evenly');
        expect(el.gap).toBe('small');
    });

    it('boolean attribute presence', async () => {
        const el = await fixture(html`<hmi-flex wrap inline></hmi-flex>`);
        expect(el.wrap).toBe(true);
        expect(el.inline).toBe(true);
        el.removeAttribute('wrap');
        el.removeAttribute('inline');
        await el.updateComplete;
        expect(el.wrap).toBe(false);
        expect(el.inline).toBe(false);
        el.wrap = true;
        await el.updateComplete;
        expect(el.hasAttribute('wrap')).toBe(true);
    });

    it('projects default slot', async () => {
        const el = await fixture(
            html`<hmi-flex><strong>One</strong></hmi-flex>`,
        );
        const slot = el.shadowRoot?.querySelector('slot');
        expect(slot?.assignedElements()[0]?.localName).toBe('strong');
    });

    it('has defaults', async () => {
        const el = await fixture(html`<hmi-flex></hmi-flex>`);
        expect(el.direction).toBe('row');
        expect(el.align).toBe('stretch');
        expect(el.justify).toBe('start');
        expect(el.gap).toBe('none');
        expect(el.wrap).toBe(false);
        expect(el.inline).toBe(false);
        const style = getComputedStyle(el);
        expect(style.display).toBe('flex');
        expect(style.flexDirection).toBe('row');
        expect(style.flexWrap).toBe('nowrap');
    });

    it('lays the items out in each direction', async () => {
        const el = await fixture(
            html`<hmi-flex
                ><span style="width: 40px; height: 10px"></span
                ><span style="width: 40px; height: 10px"></span
            ></hmi-flex>`,
        );
        let [a, b] = boxes(el) as [DOMRect, DOMRect];
        expect(b.left).toBeGreaterThan(a.left);
        expect(b.top).toBe(a.top);
        await set(el, { direction: 'column' });
        [a, b] = boxes(el) as [DOMRect, DOMRect];
        expect(b.top).toBeGreaterThan(a.top);
        await set(el, { direction: 'row-reverse' });
        [a, b] = boxes(el) as [DOMRect, DOMRect];
        expect(b.left).toBeLessThan(a.left);
        await set(el, { direction: 'column-reverse' });
        [a, b] = boxes(el) as [DOMRect, DOMRect];
        expect(b.top).toBeLessThan(a.top);
    });

    it('aligns the items on the cross axis', async () => {
        const el = await fixture(
            html`<hmi-flex style="height: 100px"
                ><span style="width: 40px">x</span
                ><span style="width: 40px; height: 60px"></span
            ></hmi-flex>`,
        );
        const host = el.getBoundingClientRect();
        const first = () => boxes(el)[0] as DOMRect;
        expect(first().height).toBe(100);
        await set(el, { align: 'start' });
        expect(first().top).toBe(host.top);
        await set(el, { align: 'end' });
        expect(first().bottom).toBe(host.bottom);
        await set(el, { align: 'center' });
        expect(first().top - host.top).toBeCloseTo(
            host.bottom - first().bottom,
            0,
        );
        await set(el, { align: 'baseline' });
        expect(getComputedStyle(el).alignItems).toBe('baseline');
    });

    it('distributes the items on the main axis', async () => {
        const el = await fixture(
            html`<hmi-flex style="width: 300px"
                ><span style="width: 40px; height: 10px"></span
                ><span style="width: 40px; height: 10px"></span
            ></hmi-flex>`,
        );
        const host = el.getBoundingClientRect();
        const lead = async (justify: HmiFlex['justify']) => {
            await set(el, { justify });
            return (boxes(el)[0] as DOMRect).left - host.left;
        };
        // 220px of free space around two 40px items.
        expect(await lead('start')).toBe(0);
        expect(await lead('center')).toBeCloseTo(110, 0);
        expect(await lead('end')).toBeCloseTo(220, 0);
        expect(await lead('between')).toBe(0);
        expect((boxes(el)[1] as DOMRect).right).toBeCloseTo(host.right, 0);
        expect(await lead('around')).toBeCloseTo(55, 0);
        expect(await lead('evenly')).toBeCloseTo(220 / 3, 0);
    });

    it('starts at the right in right-to-left text', async () => {
        const el = await fixture(
            html`<div dir="rtl">
                <hmi-flex style="width: 300px"
                    ><span style="width: 40px; height: 10px"></span
                ></hmi-flex>
            </div>`,
        );
        expect((boxes(el)[0] as DOMRect).right).toBe(
            el.getBoundingClientRect().right,
        );
    });

    it('wraps the items and lays out inline when asked', async () => {
        const el = await fixture(
            html`<hmi-flex style="width: 100px"
                ><span style="width: 60px; height: 10px"></span
                ><span style="width: 60px; height: 10px"></span
            ></hmi-flex>`,
        );
        let [a, b] = boxes(el) as [DOMRect, DOMRect];
        expect(b.top).toBe(a.top);
        await set(el, { wrap: true });
        [a, b] = boxes(el) as [DOMRect, DOMRect];
        expect(b.top).toBeGreaterThan(a.top);
        await set(el, { inline: true });
        expect(getComputedStyle(el).display).toBe('inline-flex');
    });

    it('maps the gap presets to the spacing tokens', async () => {
        const el = await fixture(html`<hmi-flex gap="small"></hmi-flex>`);
        el.style.setProperty('--space-4', '10px');
        el.style.setProperty('--space-8', '20px');
        el.style.setProperty('--space-11', '30px');
        expect(getComputedStyle(el).columnGap).toBe('10px');
        el.gap = 'medium';
        await el.updateComplete;
        expect(getComputedStyle(el).columnGap).toBe('20px');
        el.gap = 'large';
        await el.updateComplete;
        expect(getComputedStyle(el).columnGap).toBe('30px');
    });

    /* A browser maps an `align` attribute to `text-align`, which the items
       would inherit: their text keeps what the flex's parent gives them. */
    it('keeps align out of the text of its items', async () => {
        const el = await fixture(
            html`<hmi-flex><p>Some text</p><span>More</span></hmi-flex>`,
        );
        for (const align of ['start', 'center', 'end', 'middle']) {
            el.setAttribute('align', align);
            await el.updateComplete;
            for (const item of items(el)) {
                expect(getComputedStyle(item).textAlign, align).toBe('start');
            }
        }
    });

    it("lets its items inherit their parent's text-align", async () => {
        const el = await fixture(
            html`<div style="text-align: right">
                <hmi-flex align="center"><p>Some text</p></hmi-flex>
            </div>`,
        );
        const [item] = items(el) as [HTMLElement];
        expect(getComputedStyle(item).textAlign).toBe('right');
        el.style.textAlign = 'center';
        expect(getComputedStyle(item).textAlign).toBe('center');
    });

    it('is hidden by the hidden attribute', async () => {
        const el = await fixture(html`<hmi-flex hidden></hmi-flex>`);
        expect(getComputedStyle(el).display).toBe('none');
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Flex,
                    { direction: 'column', gap: 'small', wrap: true },
                    createElement('span', null, 'One'),
                ),
            );
        });
        const el = mount.querySelector('hmi-flex') as HmiFlex;
        await el.updateComplete;
        expect(el.direction).toBe('column');
        expect(el.gap).toBe('small');
        expect(el.wrap).toBe(true);
    });
});
