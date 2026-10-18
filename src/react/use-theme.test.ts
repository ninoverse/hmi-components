import { act, createElement, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { setTheme } from '../elements/shared/theme.js';
import { type UseThemeResult, useTheme } from './use-theme.js';

/* The hook restores the saved choices once per page, on the first mount, and
   keeps that in module state, so the first two tests below depend on running
   first and in this order. */

const html = document.documentElement;
const AXES = ['theme', 'structure', 'material'] as const;

beforeAll(() => {
    (
        globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true;
});

let mounted: { root: Root; host: HTMLElement }[] = [];

afterEach(async () => {
    for (const { root, host } of mounted) {
        await act(async () => root.unmount());
        host.remove();
    }
    mounted = [];
    for (const axis of AXES) {
        html.removeAttribute(`data-${axis}`);
        localStorage.removeItem(`hmi-${axis}`);
    }
});

const settle = () => new Promise((resolve) => setTimeout(resolve));

const seen: UseThemeResult[] = [];

function Probe() {
    const result = useTheme();
    seen.push(result);
    return createElement(
        'output',
        null,
        `${result.theme}/${result.structure}/${result.material}`,
    );
}

async function mount(element = createElement(Probe)) {
    const host = document.createElement('div');
    document.body.append(host);
    const root = createRoot(host);
    mounted.push({ root, host });
    await act(async () => root.render(element));
    return host;
}

const text = (host: HTMLElement) => host.querySelector('output')?.textContent;

describe('useTheme', () => {
    it('applies the saved choices on the first mount in the page', async () => {
        localStorage.setItem('hmi-theme', 'forest');
        localStorage.setItem('hmi-structure', 'journal');
        localStorage.setItem('hmi-material', 'glass');
        const host = await mount();
        expect(html.getAttribute('data-theme')).toBe('forest');
        expect(html.getAttribute('data-structure')).toBe('journal');
        expect(html.getAttribute('data-material')).toBe('glass');
        expect(text(host)).toBe('forest/journal/glass');
    });

    it('does not apply them again for a later mount', async () => {
        localStorage.setItem('hmi-theme', 'ocean');
        html.setAttribute('data-theme', 'forest');
        const host = await mount();
        expect(html.getAttribute('data-theme')).toBe('forest');
        expect(text(host)).toBe('forest/default/solid');
    });

    it('reads the attributes the page has', async () => {
        html.setAttribute('data-theme', 'ocean');
        html.setAttribute('data-material', 'liquid');
        expect(text(await mount())).toBe('ocean/default/liquid');
    });

    it('sets the axes through set, and re-renders', async () => {
        const host = await mount(
            createElement(() => {
                const { set } = useTheme();
                return createElement(
                    'button',
                    {
                        type: 'button',
                        onClick: () =>
                            set({ theme: 'ocean', material: 'glass' }),
                    },
                    createElement(Probe),
                );
            }),
        );
        await act(async () => host.querySelector('button')?.click());
        expect(html.getAttribute('data-theme')).toBe('ocean');
        expect(localStorage.getItem('hmi-material')).toBe('glass');
        expect(text(host)).toBe('ocean/default/glass');
    });

    it('re-renders when something else changes an attribute, or the module does', async () => {
        const host = await mount();
        await act(async () => {
            html.setAttribute('data-structure', 'sharp');
            await settle();
        });
        expect(text(host)).toBe('default/sharp/solid');
        await act(async () => setTheme({ theme: 'forest' }));
        expect(text(host)).toBe('forest/sharp/solid');
    });

    it('gives the same result, set included, while nothing changes', async () => {
        seen.length = 0;
        let bump: () => void = () => undefined;
        await mount(
            createElement(() => {
                const [, setCount] = useState(0);
                bump = () => setCount((count) => count + 1);
                return createElement(Probe);
            }),
        );
        await act(async () => bump());
        await act(async () => setTheme({ theme: 'ocean' }));
        const [first, again, changed] = seen;
        expect(again).toBe(first);
        expect(changed).not.toBe(first);
        expect(changed?.set).toBe(first?.set);
        expect(typeof first?.set).toBe('function');
    });

    it('stops listening when the component unmounts', async () => {
        seen.length = 0;
        const host = await mount();
        const before = seen.length;
        const entry = mounted.pop();
        await act(async () => entry?.root.unmount());
        host.remove();
        html.setAttribute('data-theme', 'forest');
        await settle();
        expect(seen).toHaveLength(before);
    });
});
