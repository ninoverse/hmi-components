import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

const base = (el: HmiAvatarStack) =>
    el.shadowRoot?.querySelector('[part~="base"]') as HTMLElement;

afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
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
        expect(chip(el)?.getAttribute('aria-label')).toBe(
            '2 more: Linus Torvalds, Barbara Liskov',
        );
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

    it('widens the chip to fit a count of several digits', async () => {
        for (const size of ['small', 'medium', 'large', 'xlarge'] as const) {
            const el = await fixture(
                html`<hmi-avatar-stack
                    .names=${Array.from({ length: 1000 }, (_, i) => `Person ${i}`)}
                    size=${size}
                ></hmi-avatar-stack>`,
            );
            const box = chip(el) as HTMLElement;
            expect(box.textContent?.trim()).toBe('+996');
            const text = document.createRange();
            text.selectNodeContents(box);
            const count = text.getBoundingClientRect();
            // The avatars paint over the chip, so the count must clear the
            // last one's edge, or its "+" disappears under it.
            const last = (
                avatars(el).at(-1) as HTMLElement
            ).getBoundingClientRect();
            const inner = box.getBoundingClientRect();
            expect(count.left, size).toBeGreaterThanOrEqual(last.right);
            expect(count.right, size).toBeLessThanOrEqual(inner.right);
        }
    });

    it('keeps a one-digit chip round, as wide as an avatar', async () => {
        const el = await fixture(
            html`<hmi-avatar-stack .names=${NAMES} max="3"></hmi-avatar-stack>`,
        );
        const box = (chip(el) as HTMLElement).getBoundingClientRect();
        const avatar = (avatars(el)[0] as HTMLElement).getBoundingClientRect();
        expect(box.width).toBe(avatar.width);
        expect(box.height).toBe(avatar.height);
    });

    for (const [max, shown, warns] of [
        ['-1', 0, true],
        ['abc', 4, true],
        ['2.5', 2, true],
        ['2', 2, false],
        ['0', 0, false],
    ] as const) {
        it(`reads max="${max}" as ${shown}${warns ? ', with a warning' : ''}`, async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const el = await fixture(
                html`<hmi-avatar-stack .names=${NAMES} max=${max}></hmi-avatar-stack>`,
            );
            expect(avatars(el)).toHaveLength(shown);
            expect(chip(el)?.textContent?.trim()).toBe(
                `+${NAMES.length - shown}`,
            );
            expect(warn).toHaveBeenCalledTimes(warns ? 1 : 0);
            if (warns) {
                expect(warn.mock.calls[0]?.[0]).toContain('hmi-avatar-stack');
            }
        });
    }

    it('names the row a group of people', async () => {
        const el = await fixture(
            html`<hmi-avatar-stack .names=${NAMES} max="2"></hmi-avatar-stack>`,
        );
        expect(base(el).getAttribute('role')).toBe('group');
        expect(base(el).getAttribute('aria-label')).toBe('5 people');
    });

    it('rewords the group with label', async () => {
        const el = await fixture(
            html`<hmi-avatar-stack
                .names=${NAMES}
                label="Reviewers ({count})"
            ></hmi-avatar-stack>`,
        );
        expect(base(el).getAttribute('aria-label')).toBe('Reviewers (5)');
    });

    it('names the people the chip hides, and shows them on hover', async () => {
        const el = await fixture(
            html`<hmi-avatar-stack .names=${NAMES} max="3"></hmi-avatar-stack>`,
        );
        const text = '2 more: Linus Torvalds, Barbara Liskov';
        expect(chip(el)?.getAttribute('aria-label')).toBe(text);
        expect(chip(el)?.getAttribute('title')).toBe(text);
    });

    it('rewords the chip with overflow-label', async () => {
        const el = await fixture(
            html`<hmi-avatar-stack
                .names=${NAMES}
                max="3"
                overflow-label="{count} autres"
            ></hmi-avatar-stack>`,
        );
        expect(chip(el)?.getAttribute('aria-label')).toBe(
            '2 autres: Linus Torvalds, Barbara Liskov',
        );
        expect(chip(el)?.textContent?.trim()).toBe('+2');
    });

    it('passes an image and a presence to an avatar given as an object', async () => {
        const src = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
        const el = await fixture(
            html`<hmi-avatar-stack
                .names=${[
                    { name: 'Ada Lovelace', src, status: 'online' },
                    'Alan Turing',
                ]}
            ></hmi-avatar-stack>`,
        );
        const [ada, alan] = avatars(el);
        expect(ada?.name).toBe('Ada Lovelace');
        expect(ada?.src).toBe(src);
        expect(ada?.status).toBe('online');
        expect(alan?.name).toBe('Alan Turing');
        expect(alan?.src).toBe('');
        expect(alan?.status).toBeUndefined();
    });

    it('overlaps every avatar on its predecessor, in either direction', async () => {
        for (const dir of ['ltr', 'rtl']) {
            const host = document.createElement('div');
            host.dir = dir;
            document.body.append(host);
            render(
                html`<hmi-avatar-stack .names=${NAMES} max="4"></hmi-avatar-stack>`,
                host,
            );
            const el = host.firstElementChild as HmiAvatarStack;
            await el.updateComplete;
            const boxes = [...base(el).children].map((n) =>
                n.getBoundingClientRect(),
            );
            for (let i = 1; i < boxes.length; i++) {
                const [prev, next] = [boxes[i - 1], boxes[i]] as [
                    DOMRect,
                    DOMRect,
                ];
                const overlap =
                    dir === 'ltr'
                        ? prev.right - next.left
                        : next.right - prev.left;
                expect(overlap, `${dir} ${i}`).toBeGreaterThan(0);
            }
            const count = chip(el)?.querySelector('.count') as HTMLElement;
            expect(getComputedStyle(count).direction).toBe('ltr');
        }
    });

    it('paints the rim from --avatar-stack-rim', async () => {
        const el = await fixture(
            html`<hmi-avatar-stack
                .names=${NAMES}
                max="2"
                style="--avatar-stack-rim: rgb(1, 2, 3)"
            ></hmi-avatar-stack>`,
        );
        for (const node of [avatars(el)[0], chip(el)] as HTMLElement[]) {
            expect(getComputedStyle(node).borderTopColor).toBe('rgb(1, 2, 3)');
        }
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
