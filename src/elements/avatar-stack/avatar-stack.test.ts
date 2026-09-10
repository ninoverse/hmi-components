import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import type { HmiAvatar } from '../avatar/avatar.js';
import './avatar-stack.js';
import type { HmiAvatarStack } from './avatar-stack.js';
import { AvatarStack } from './avatar-stack.react.js';

const NAMES = [
    'Ada Lovelace',
    'Alan Turing',
    'Grace Hopper',
    'Linus Torvalds',
    'Barbara Liskov',
];

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiAvatarStack> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiAvatarStack;
    await el.updateComplete;
    return el;
}

const avatars = (el: HmiAvatarStack) => [
    ...(el.shadowRoot?.querySelectorAll<HmiAvatar>('hmi-avatar') ?? []),
];
const chip = (el: HmiAvatarStack) =>
    el.shadowRoot?.querySelector('[part~="overflow"]');

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-avatar-stack', () => {
    it('registers', () => {
        expect(customElements.get('hmi-avatar-stack')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(
            html`<hmi-avatar-stack .names=${NAMES.slice(0, 2)}></hmi-avatar-stack>`,
        );
        expect(el.shadowRoot?.querySelector('[part~="base"]')).not.toBeNull();
    });

    it('renders one hmi-avatar per name, in order', async () => {
        const el = await fixture(
            html`<hmi-avatar-stack .names=${NAMES.slice(0, 3)}></hmi-avatar-stack>`,
        );
        expect(avatars(el).map((a) => a.name)).toEqual(NAMES.slice(0, 3));
    });

    it('reflects size and passes it to every avatar', async () => {
        const el = await fixture(
            html`<hmi-avatar-stack
                .names=${NAMES.slice(0, 3)}
                size="large"
            ></hmi-avatar-stack>`,
        );
        expect(el.getAttribute('size')).toBe('large');
        expect(avatars(el).every((a) => a.size === 'large')).toBe(true);
    });

    it('keeps names a property, never an attribute', async () => {
        const el = await fixture(
            html`<hmi-avatar-stack .names=${NAMES}></hmi-avatar-stack>`,
        );
        expect(el.hasAttribute('names')).toBe(false);
        expect(el.names).toEqual(NAMES);
    });

    it('caps at max and collapses the rest into a +N chip', async () => {
        const el = await fixture(
            html`<hmi-avatar-stack
                .names=${NAMES}
                max="3"
            ></hmi-avatar-stack>`,
        );
        expect(avatars(el)).toHaveLength(3);
        expect(chip(el)?.textContent?.trim()).toBe('+2');
        expect(chip(el)?.getAttribute('aria-label')).toBe('2 more');
    });

    it('renders no chip when the names fit', async () => {
        const el = await fixture(
            html`<hmi-avatar-stack
                .names=${NAMES.slice(0, 3)}
                max="4"
            ></hmi-avatar-stack>`,
        );
        expect(avatars(el)).toHaveLength(3);
        expect(chip(el)).toBeNull();
    });

    it('defaults max to 4', async () => {
        const el = await fixture(
            html`<hmi-avatar-stack .names=${NAMES}></hmi-avatar-stack>`,
        );
        expect(el.max).toBe(4);
        expect(avatars(el)).toHaveLength(4);
        expect(chip(el)?.textContent?.trim()).toBe('+1');
    });

    it('leaves the first child unshifted when max is 0', async () => {
        const el = await fixture(
            html`<hmi-avatar-stack
                .names=${NAMES}
                max="0"
            ></hmi-avatar-stack>`,
        );
        expect(avatars(el)).toHaveLength(0);
        const el0 = chip(el) as HTMLElement;
        expect(el0).not.toBeNull();
        expect(getComputedStyle(el0).marginLeft).toBe('0px');
    });

    it('exposes roles', async () => {
        const el = await fixture(
            html`<hmi-avatar-stack .names=${NAMES} max="2"></hmi-avatar-stack>`,
        );
        expect(chip(el)?.getAttribute('role')).toBe('img');
        expect(el.getAttribute('role')).toBeNull();
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(AvatarStack, {
                    names: NAMES,
                    max: 2,
                    size: 'small',
                }),
            );
        });
        const el = mount.querySelector('hmi-avatar-stack') as HmiAvatarStack;
        await el.updateComplete;
        expect(avatars(el)).toHaveLength(2);
        expect(avatars(el)[0]?.size).toBe('small');
        expect(chip(el)?.textContent?.trim()).toBe('+3');
    });
});
