import { afterEach, describe, expect, it } from 'vitest';
import { activeElementDeep, supportsPopover, toggleEmpty } from './dom.js';

afterEach(() => {
    document.body.replaceChildren();
});

describe('activeElementDeep', () => {
    it('follows focus into a shadow root', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const button = document.createElement('button');
        root.append(button);
        document.body.append(host);

        button.focus();

        expect(document.activeElement).toBe(host);
        expect(activeElementDeep(document)).toBe(button);
    });
});

describe('supportsPopover', () => {
    it('is true in Chromium', () => {
        expect(supportsPopover()).toBe(true);
    });
});

describe('toggleEmpty', () => {
    function setup() {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const wrapper = document.createElement('span');
        const slot = document.createElement('slot');
        wrapper.append(slot);
        root.append(wrapper);
        document.body.append(host);
        return { host, wrapper, slot };
    }
    const change = (slot: HTMLSlotElement, hasText: boolean) =>
        toggleEmpty({ target: slot } as unknown as Event, hasText);

    it('hides the parent of an empty slot with no text', () => {
        const { slot, wrapper } = setup();
        change(slot, false);
        expect(wrapper.hidden).toBe(true);
    });

    it('keeps the parent when there is a text fallback', () => {
        const { slot, wrapper } = setup();
        change(slot, true);
        expect(wrapper.hidden).toBe(false);
    });

    it('shows the parent when something is slotted', () => {
        const { host, slot, wrapper } = setup();
        wrapper.hidden = true;
        host.append(document.createElement('b'));
        change(slot, false);
        expect(wrapper.hidden).toBe(false);
    });
});
