import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import defaultPalette from '../../../public/css/themes/color/default.css?inline';
import './avatar.js';
import type { HmiAvatar } from './avatar.js';
import { Avatar } from './avatar.react.js';

const PHOTO =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E';

async function fixture(template: ReturnType<typeof html>): Promise<HmiAvatar> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiAvatar;
    await el.updateComplete;
    return el;
}

const base = (el: HmiAvatar) => el.shadowRoot?.querySelector('[part~="base"]');
const dot = (el: HmiAvatar) =>
    el.shadowRoot?.querySelector('[part~="status"]') as HTMLElement;

/* A computed colour, `rgb(…)` or `color(srgb …)`, as 0–1 channels. */
function channels(colour: string): number[] {
    const srgb = colour.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)/);
    if (srgb) return srgb.slice(1, 4).map(Number);
    return (colour.match(/[\d.]+/g) ?? []).slice(0, 3).map((n) => +n / 255);
}

function contrast(a: string, b: string): number {
    const lum = (c: string) => {
        const [r = 0, g = 0, bl = 0] = channels(c).map((v) =>
            v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
        );
        return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
    };
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
    return (hi + 0.05) / (lo + 0.05);
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-avatar', () => {
    it('registers', () => {
        expect(customElements.get('hmi-avatar')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(
            html`<hmi-avatar name="Ada Lovelace"></hmi-avatar>`,
        );
        expect(base(el)).not.toBeNull();
    });

    it('reflects size', async () => {
        const el = await fixture(
            html`<hmi-avatar name="Ada" size="large"></hmi-avatar>`,
        );
        expect(el.size).toBe('large');
        el.size = 'xlarge';
        await el.updateComplete;
        expect(el.getAttribute('size')).toBe('xlarge');
    });

    it('reflects status and drops the attribute when unset', async () => {
        const el = await fixture(
            html`<hmi-avatar name="Ada" status="away"></hmi-avatar>`,
        );
        expect(el.status).toBe('away');
        el.status = undefined;
        await el.updateComplete;
        expect(el.hasAttribute('status')).toBe(false);
    });

    it('renders initials from the first two words', async () => {
        const el = await fixture(
            html`<hmi-avatar name="Ada Lovelace"></hmi-avatar>`,
        );
        expect(base(el)?.textContent?.trim()).toBe('AL');
    });

    it('hashes the tint deterministically, matching the React palette', async () => {
        const el = await fixture(
            html`<hmi-avatar name="Ada Lovelace"></hmi-avatar>`,
        );
        const style = (base(el) as HTMLElement).style;
        expect(style.background).toBe('rgb(222, 239, 236)'); // #DEEFEC
        expect(style.color).toBe('rgb(31, 91, 88)'); // #1F5B58

        const other = await fixture(
            html`<hmi-avatar name="Alan Turing"></hmi-avatar>`,
        );
        expect((base(other) as HTMLElement).style.background).toBe(
            'rgb(242, 220, 233)',
        ); // #F2DCE9
    });

    it('renders the image only when src is set, and drops the tint', async () => {
        const el = await fixture(
            html`<hmi-avatar name="Ada Lovelace"></hmi-avatar>`,
        );
        expect(el.shadowRoot?.querySelector('[part~="image"]')).toBeNull();

        el.src = PHOTO;
        await el.updateComplete;
        const img =
            el.shadowRoot?.querySelector<HTMLImageElement>('[part~="image"]');
        expect(img).not.toBeNull();
        expect(img?.getAttribute('alt')).toBe('Ada Lovelace');
        expect((base(el) as HTMLElement).style.background).toBe('');
    });

    it('renders the status dot only when set', async () => {
        const el = await fixture(html`<hmi-avatar name="Ada"></hmi-avatar>`);
        expect(el.shadowRoot?.querySelector('[part~="status"]')).toBeNull();
        el.status = 'online';
        await el.updateComplete;
        const dot = el.shadowRoot?.querySelector('[part~="status"]');
        expect(dot).not.toBeNull();
        expect(dot?.getAttribute('aria-hidden')).toBe('true');
    });

    it('exposes roles', async () => {
        const el = await fixture(
            html`<hmi-avatar name="Ada Lovelace"></hmi-avatar>`,
        );
        expect(base(el)?.getAttribute('role')).toBe('img');
        expect(base(el)?.getAttribute('aria-label')).toBe('Ada Lovelace');

        el.src = PHOTO;
        await el.updateComplete;
        expect(base(el)?.hasAttribute('role')).toBe(false);
        expect(base(el)?.hasAttribute('aria-label')).toBe(false);
    });

    it('names the presence after the person', async () => {
        const el = await fixture(
            html`<hmi-avatar name="Ada Lovelace" status="away"></hmi-avatar>`,
        );
        expect(base(el)?.getAttribute('aria-label')).toBe('Ada Lovelace, Away');

        el.src = PHOTO;
        await el.updateComplete;
        expect(el.shadowRoot?.querySelector('img')?.getAttribute('alt')).toBe(
            'Ada Lovelace, Away',
        );
    });

    it('takes its presence from status-label when set', async () => {
        const el = await fixture(
            html`<hmi-avatar
                name="Ada Lovelace"
                status="online"
                status-label="In linea"
            ></hmi-avatar>`,
        );
        expect(el.statusLabel).toBe('In linea');
        expect(base(el)?.getAttribute('aria-label')).toBe(
            'Ada Lovelace, In linea',
        );
    });

    it('keeps an emoji or an accented letter whole in the initials', async () => {
        const el = await fixture(html`<hmi-avatar name="🦊 Fox"></hmi-avatar>`);
        expect(base(el)?.textContent?.trim()).toBe('🦊F');
        el.name = '👩🏽‍💻 e\u0301lise';
        await el.updateComplete;
        expect(base(el)?.textContent?.trim()).toBe('👩🏽‍💻E\u0301');
    });

    it('falls back to the initials when the image fails to load', async () => {
        const el = await fixture(
            html`<hmi-avatar name="Ada Lovelace" src="data:image/png;base64,broken"></hmi-avatar>`,
        );
        await new Promise((resolve) =>
            el.shadowRoot
                ?.querySelector('img')
                ?.addEventListener('error', resolve),
        );
        await el.updateComplete;
        expect(el.shadowRoot?.querySelector('img')).toBeNull();
        expect(base(el)?.textContent?.trim()).toBe('AL');
        expect(base(el)?.getAttribute('role')).toBe('img');

        el.src = PHOTO;
        await el.updateComplete;
        expect(el.shadowRoot?.querySelector('img')).not.toBeNull();
    });

    it('is decorative without a name, unless it shows a presence', async () => {
        const el = await fixture(html`<hmi-avatar></hmi-avatar>`);
        expect(base(el)?.getAttribute('role')).toBe('presentation');
        expect(base(el)?.hasAttribute('aria-label')).toBe(false);

        el.status = 'offline';
        await el.updateComplete;
        expect(base(el)?.getAttribute('role')).toBe('img');
        expect(base(el)?.getAttribute('aria-label')).toBe('Offline');
    });

    it('gives each presence its own shape and 3:1 contrast', async () => {
        /* The palette's own colours: without them, every colour inherits. */
        const sheet = document.createElement('style');
        sheet.textContent = defaultPalette;
        document.head.append(sheet);
        try {
            const looks = new Set<string>();
            for (const status of ['online', 'away', 'offline'] as const) {
                const el = await fixture(
                    html`<hmi-avatar name="Ada" status=${status}></hmi-avatar>`,
                );
                const style = getComputedStyle(dot(el));
                looks.add(`${style.backgroundImage} ${style.boxShadow}`);
                expect(
                    contrast(style.color, style.borderTopColor),
                    status,
                ).toBeGreaterThanOrEqual(3);
            }
            expect(looks.size).toBe(3);
        } finally {
            sheet.remove();
        }
    });

    it('puts the presence dot at the inline end', async () => {
        const el = await fixture(
            html`<hmi-avatar dir="rtl" name="Ada" status="online"></hmi-avatar>`,
        );
        const host = el.getBoundingClientRect();
        expect(dot(el).getBoundingClientRect().left).toBeCloseTo(host.left, 0);
    });

    it('ignores light DOM children, as the React component did', async () => {
        const el = await fixture(
            html`<hmi-avatar name="Ada Lovelace"><b>ignored</b></hmi-avatar>`,
        );
        expect(el.shadowRoot?.querySelector('slot')).toBeNull();
        expect(base(el)?.textContent?.trim()).toBe('AL');
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(Avatar, {
                    name: 'Grace Hopper',
                    size: 'large',
                    status: 'online',
                }),
            );
        });
        const el = mount.querySelector('hmi-avatar') as HmiAvatar;
        await el.updateComplete;
        expect(el.size).toBe('large');
        expect(el.status).toBe('online');
        expect(base(el)?.textContent?.trim()).toBe('GH');
        expect(el.shadowRoot?.querySelector('[part~="status"]')).not.toBeNull();
    });
});
