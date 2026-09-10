import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
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
