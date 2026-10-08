import { afterEach, describe, expect, it } from 'vitest';
import { handleNavClick } from './nav.js';

afterEach(() => {
    document.body.replaceChildren();
});

function setup(href: string | undefined, init: MouseEventInit = {}) {
    const host = document.createElement('div');
    document.body.append(host);
    const seen: unknown[] = [];
    host.addEventListener('hmi-nav', (e) => {
        seen.push((e as CustomEvent).detail);
        if (cancel.on) e.preventDefault();
    });
    const cancel = { on: false };
    const click = () => {
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            ...init,
        });
        handleNavClick(host, event, { value: 'a', href });
        return event;
    };
    return { seen, cancel, click };
}

describe('handleNavClick', () => {
    it('fires hmi-nav with the detail on a plain click and lets the link navigate', () => {
        const { seen, click } = setup('/docs');
        const event = click();
        expect(seen).toEqual([{ value: 'a', href: '/docs' }]);
        expect(event.defaultPrevented).toBe(false);
    });

    it('stops the navigation when hmi-nav is cancelled', () => {
        const { cancel, click } = setup('/docs');
        cancel.on = true;
        expect(click().defaultPrevented).toBe(true);
    });

    it('never navigates a link without an href, but still fires', () => {
        const { seen, click } = setup(undefined);
        expect(click().defaultPrevented).toBe(true);
        expect(seen).toHaveLength(1);
    });

    it.each([
        ['ctrl', { ctrlKey: true }],
        ['meta', { metaKey: true }],
        ['shift', { shiftKey: true }],
        ['alt', { altKey: true }],
        ['a non-primary button', { button: 1 }],
    ])('fires nothing for a %s click, and leaves the browser to open it', (_name, init) => {
        const { seen, cancel, click } = setup('/docs', init);
        cancel.on = true;
        const event = click();
        expect(seen).toHaveLength(0);
        expect(event.defaultPrevented).toBe(false);
    });

    it('still keeps a modified click on a link without an href from navigating', () => {
        const { seen, click } = setup(undefined, { ctrlKey: true });
        expect(click().defaultPrevented).toBe(true);
        expect(seen).toHaveLength(0);
    });
});
