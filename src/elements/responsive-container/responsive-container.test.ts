import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './responsive-container.js';
import type {
    HmiResponsiveContainer,
    ResponsiveContainerResizeDetail,
} from './responsive-container.js';
import { ResponsiveContainer } from './responsive-container.react.js';

/** Render the container in a parent of a known width, and record its events. */
async function fixture(template: ReturnType<typeof html>, parentWidth = 400) {
    const parent = document.createElement('div');
    parent.style.width = `${parentWidth}px`;
    document.body.append(parent);
    const sizes: ResponsiveContainerResizeDetail[] = [];
    parent.addEventListener('hmi-resize', (e) =>
        sizes.push((e as CustomEvent<ResponsiveContainerResizeDetail>).detail),
    );
    render(template, parent);
    const el = parent.querySelector(
        'hmi-responsive-container',
    ) as HmiResponsiveContainer;
    await el.updateComplete;
    return { el, parent, sizes };
}

const frames = () =>
    new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

const base = (el: HmiResponsiveContainer) =>
    el.shadowRoot?.querySelector('[part~="base"]') as HTMLElement;

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-responsive-container', () => {
    it('registers', () => {
        expect(customElements.get('hmi-responsive-container')).toBeDefined();
    });

    it('renders its children, even before it has measured', async () => {
        const { el } = await fixture(
            html`<hmi-responsive-container
                ><p id="kid">chart</p></hmi-responsive-container
            >`,
        );
        const slot = el.shadowRoot?.querySelector('slot') as HTMLSlotElement;
        expect(slot.assignedElements()[0]?.id).toBe('kid');
    });

    it('measures its width and fires hmi-resize with the fixed height', async () => {
        const { sizes } = await fixture(
            html`<hmi-responsive-container height="160"></hmi-responsive-container>`,
        );
        await frames();
        expect(sizes.at(-1)).toEqual({ width: 400, height: 160 });
    });

    it('defaults the height to 300', async () => {
        const { el, sizes } = await fixture(
            html`<hmi-responsive-container></hmi-responsive-container>`,
        );
        await frames();
        expect(el.height).toBe(300);
        expect(sizes.at(-1)?.height).toBe(300);
        expect(base(el).getBoundingClientRect().height).toBe(300);
    });

    it('derives the height from aspect and the measured width', async () => {
        const { el, sizes } = await fixture(
            html`<hmi-responsive-container height="160" aspect="2"></hmi-responsive-container>`,
        );
        await frames();
        expect(sizes.at(-1)).toEqual({ width: 400, height: 200 });
        expect(base(el).getBoundingClientRect().height).toBe(200);
    });

    it('fires again when the width changes', async () => {
        const { parent, sizes } = await fixture(
            html`<hmi-responsive-container height="100"></hmi-responsive-container>`,
        );
        await frames();
        parent.style.width = '250px';
        await frames();
        expect(sizes.at(-1)).toEqual({ width: 250, height: 100 });
    });

    it('fires again when the height changes, and not when nothing changed', async () => {
        const { el, sizes } = await fixture(
            html`<hmi-responsive-container height="100"></hmi-responsive-container>`,
        );
        await frames();
        const count = sizes.length;
        el.height = 100;
        await el.updateComplete;
        expect(sizes).toHaveLength(count);
        el.height = 120;
        await el.updateComplete;
        expect(sizes.at(-1)).toEqual({ width: 400, height: 120 });
    });

    it('exposes the size as custom properties that inherit into what is slotted', async () => {
        const { el } = await fixture(
            html`<hmi-responsive-container height="160"
                ><p id="kid">chart</p></hmi-responsive-container
            >`,
        );
        await frames();
        const kid = el.querySelector('#kid') as HTMLElement;
        expect(
            getComputedStyle(kid).getPropertyValue('--container-width').trim(),
        ).toBe('400px');
        expect(
            getComputedStyle(kid).getPropertyValue('--container-height').trim(),
        ).toBe('160px');
    });

    it('does not touch what is slotted', async () => {
        const { el } = await fixture(
            html`<hmi-responsive-container
                ><div id="kid" style="color: red"></div
            ></hmi-responsive-container>`,
        );
        await frames();
        const kid = el.querySelector('#kid') as HTMLElement;
        expect(kid.getAttributeNames().sort()).toEqual(['id', 'style']);
    });

    it('fires nothing while it has no width', async () => {
        const { sizes } = await fixture(
            html`<hmi-responsive-container></hmi-responsive-container>`,
            0,
        );
        await frames();
        expect(sizes).toEqual([]);
    });

    it('stops observing when it is removed', async () => {
        const { el, parent, sizes } = await fixture(
            html`<hmi-responsive-container height="100"></hmi-responsive-container>`,
        );
        await frames();
        el.remove();
        const count = sizes.length;
        parent.style.width = '123px';
        await frames();
        expect(sizes).toHaveLength(count);
    });
});

describe('ResponsiveContainer (React wrapper)', () => {
    it('mounts through the React wrapper', async () => {
        const parent = document.createElement('div');
        parent.style.width = '300px';
        document.body.append(parent);
        const root = createRoot(parent);
        const seen: ResponsiveContainerResizeDetail[] = [];
        await act(async () => {
            root.render(
                createElement(
                    ResponsiveContainer,
                    { height: 120, onResize: (e) => seen.push(e.detail) },
                    createElement('p', null, 'chart'),
                ),
            );
        });
        const el = parent.querySelector(
            'hmi-responsive-container',
        ) as HmiResponsiveContainer;
        await el.updateComplete;
        await frames();
        expect(el.height).toBe(120);
        expect(seen.at(-1)).toEqual({ width: 300, height: 120 });
        await act(async () => root.unmount());
    });
});
