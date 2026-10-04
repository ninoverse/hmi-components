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
    const el = host.firstElementChild as HmiFlex;
    await el.updateComplete;
    return el;
}

const items = (el: HmiFlex) => [...el.children] as HTMLElement[];

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-flex', () => {
    it('registers', () => {
        expect(customElements.get('hmi-flex')).toBeDefined();
    });

    it('lays slotted children out as a row of flex items', async () => {
        const el = await fixture(
            html`<hmi-flex
                ><span style="width: 40px; height: 10px"></span
                ><span style="width: 40px; height: 10px"></span
            ></hmi-flex>`,
        );
        expect(getComputedStyle(el).display).toBe('flex');
        const [a, b] = items(el).map((i) => i.getBoundingClientRect()) as [
            DOMRect,
            DOMRect,
        ];
        expect(b.left).toBeGreaterThan(a.left);
        expect(b.top).toBe(a.top);
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
        expect(style.flexDirection).toBe('row');
        expect(style.alignItems).toBe('normal');
        expect(style.flexWrap).toBe('nowrap');
    });

    it('reflects its properties', async () => {
        const el = await fixture(html`<hmi-flex></hmi-flex>`);
        el.direction = 'column';
        el.align = 'center';
        el.justify = 'between';
        el.gap = 'large';
        el.wrap = true;
        el.inline = true;
        await el.updateComplete;
        expect(el.getAttribute('direction')).toBe('column');
        expect(el.getAttribute('align')).toBe('center');
        expect(el.getAttribute('justify')).toBe('between');
        expect(el.getAttribute('gap')).toBe('large');
        expect(el.hasAttribute('wrap')).toBe(true);
        expect(el.hasAttribute('inline')).toBe(true);
    });

    it('maps direction, align, justify, wrap and inline to CSS', async () => {
        const el = await fixture(html`<hmi-flex></hmi-flex>`);
        const check = async (
            props: Partial<HmiFlex>,
            expected: Record<string, string>,
        ) => {
            Object.assign(el, props);
            await el.updateComplete;
            const style = getComputedStyle(el) as unknown as Record<
                string,
                string
            >;
            for (const [key, value] of Object.entries(expected)) {
                expect(style[key]).toBe(value);
            }
        };
        await check({ direction: 'column' }, { flexDirection: 'column' });
        await check(
            { direction: 'row-reverse' },
            { flexDirection: 'row-reverse' },
        );
        await check(
            { direction: 'column-reverse' },
            { flexDirection: 'column-reverse' },
        );
        await check({ align: 'start' }, { alignItems: 'flex-start' });
        await check({ align: 'end' }, { alignItems: 'flex-end' });
        await check({ align: 'baseline' }, { alignItems: 'baseline' });
        await check({ justify: 'center' }, { justifyContent: 'center' });
        await check({ justify: 'end' }, { justifyContent: 'flex-end' });
        await check(
            { justify: 'between' },
            { justifyContent: 'space-between' },
        );
        await check({ justify: 'around' }, { justifyContent: 'space-around' });
        await check({ justify: 'evenly' }, { justifyContent: 'space-evenly' });
        await check({ wrap: true }, { flexWrap: 'wrap' });
        await check({ inline: true }, { display: 'inline-flex' });
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
