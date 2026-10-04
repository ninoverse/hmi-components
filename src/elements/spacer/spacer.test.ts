import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './spacer.js';
import type { HmiSpacer } from './spacer.js';
import { Spacer } from './spacer.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiSpacer> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiSpacer;
    await el.updateComplete;
    return el;
}

const size = (el: HmiSpacer) => el.getBoundingClientRect();

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-spacer', () => {
    it('registers', () => {
        expect(customElements.get('hmi-spacer')).toBeDefined();
    });

    it('has defaults: a medium vertical gap', async () => {
        const el = await fixture(html`<hmi-spacer></hmi-spacer>`);
        expect(el.size).toBe('medium');
        expect(el.axis).toBe('vertical');
        expect(el.grow).toBe(false);
        expect(size(el).height).toBe(16);
        expect(getComputedStyle(el).display).toBe('block');
    });

    it('reflects its properties', async () => {
        const el = await fixture(html`<hmi-spacer></hmi-spacer>`);
        el.size = 'large';
        el.axis = 'horizontal';
        el.grow = true;
        await el.updateComplete;
        expect(el.getAttribute('size')).toBe('large');
        expect(el.getAttribute('axis')).toBe('horizontal');
        expect(el.hasAttribute('grow')).toBe(true);
    });

    it('sizes the vertical axis in base units', async () => {
        const el = await fixture(html`<hmi-spacer size="small"></hmi-spacer>`);
        expect(size(el).height).toBe(8);
        el.size = 'large';
        await el.updateComplete;
        expect(size(el).height).toBe(24);
    });

    it('sizes the horizontal axis in base units', async () => {
        const el = await fixture(
            html`<hmi-spacer axis="horizontal" size="small"></hmi-spacer>`,
        );
        expect(getComputedStyle(el).width).toBe('8px');
        el.size = 'medium';
        await el.updateComplete;
        expect(getComputedStyle(el).width).toBe('16px');
        el.size = 'large';
        await el.updateComplete;
        expect(getComputedStyle(el).width).toBe('24px');
    });

    it('grows to fill a flex container and ignores its size', async () => {
        const host = document.createElement('div');
        host.style.cssText = 'display: flex; width: 300px';
        host.innerHTML =
            '<span style="width: 50px">a</span><hmi-spacer grow size="large"></hmi-spacer><span style="width: 50px">b</span>';
        document.body.append(host);
        const el = host.querySelector('hmi-spacer') as HmiSpacer;
        await el.updateComplete;
        expect(getComputedStyle(el).flexGrow).toBe('1');
        expect(size(el).width).toBe(200);
        expect(size(el).height).toBe(host.getBoundingClientRect().height);
    });

    it('hides itself from assistive technology unless told otherwise', async () => {
        const el = await fixture(html`<hmi-spacer></hmi-spacer>`);
        expect(el.getAttribute('aria-hidden')).toBe('true');
        const own = await fixture(
            html`<hmi-spacer aria-hidden="false"></hmi-spacer>`,
        );
        expect(own.getAttribute('aria-hidden')).toBe('false');
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(Spacer, {
                    size: 'large',
                    axis: 'horizontal',
                    grow: false,
                }),
            );
        });
        const el = mount.querySelector('hmi-spacer') as HmiSpacer;
        await el.updateComplete;
        expect(el.size).toBe('large');
        expect(el.axis).toBe('horizontal');
        expect(getComputedStyle(el).width).toBe('24px');
    });
});
