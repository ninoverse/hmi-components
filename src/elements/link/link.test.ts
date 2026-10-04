import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './link.js';
import type { HmiLink } from './link.js';
import { Link } from './link.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiLink> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiLink;
    await el.updateComplete;
    return el;
}

const anchor = (el: HmiLink) =>
    el.shadowRoot?.querySelector<HTMLAnchorElement>(
        'a[part~="base"]',
    ) as HTMLAnchorElement;

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-link', () => {
    it('registers', () => {
        expect(customElements.get('hmi-link')).toBeDefined();
    });

    it('renders an inline anchor around its slot', async () => {
        const el = await fixture(html`<hmi-link href="#x">Docs</hmi-link>`);
        expect(getComputedStyle(el).display).toBe('inline');
        expect(anchor(el).tagName).toBe('A');
        expect(anchor(el).getBoundingClientRect().width).toBeGreaterThan(0);
        expect(el.textContent).toBe('Docs');
    });

    it('has defaults', async () => {
        const el = await fixture(html`<hmi-link>Docs</hmi-link>`);
        expect(el.underline).toBe('always');
        expect(el.tone).toBe('primary');
        expect(el.href).toBeUndefined();
        expect(el.target).toBeUndefined();
        expect(el.rel).toBeUndefined();
        expect(el.download).toBeUndefined();
        expect(el.label).toBeUndefined();
    });

    it('reflects underline and tone', async () => {
        const el = await fixture(html`<hmi-link>Docs</hmi-link>`);
        el.underline = 'hover';
        el.tone = 'muted';
        await el.updateComplete;
        expect(el.getAttribute('underline')).toBe('hover');
        expect(el.getAttribute('tone')).toBe('muted');
    });

    it('forwards href, target and download to the anchor', async () => {
        const el = await fixture(
            html`<hmi-link href="/file.pdf" target="_self" download="doc.pdf">Get</hmi-link>`,
        );
        const a = anchor(el);
        expect(a.getAttribute('href')).toBe('/file.pdf');
        expect(a.getAttribute('target')).toBe('_self');
        expect(a.getAttribute('download')).toBe('doc.pdf');
    });

    it('is a placeholder anchor without an href', async () => {
        const el = await fixture(html`<hmi-link>Docs</hmi-link>`);
        expect(anchor(el).hasAttribute('href')).toBe(false);
        expect(anchor(el).hasAttribute('target')).toBe(false);
        expect(anchor(el).hasAttribute('rel')).toBe(false);
    });

    it('adds noopener noreferrer to a _blank link unless rel is given', async () => {
        const el = await fixture(
            html`<hmi-link href="https://example.com" target="_blank">Out</hmi-link>`,
        );
        expect(anchor(el).getAttribute('rel')).toBe('noopener noreferrer');
        el.rel = 'nofollow';
        await el.updateComplete;
        expect(anchor(el).getAttribute('rel')).toBe('nofollow');
        el.target = '_self';
        el.rel = undefined;
        await el.updateComplete;
        expect(anchor(el).hasAttribute('rel')).toBe(false);
    });

    it('names the anchor from label', async () => {
        const el = await fixture(
            html`<hmi-link href="/" label="Home"><svg width="8" height="8" aria-hidden="true"></svg></hmi-link>`,
        );
        expect(anchor(el).getAttribute('aria-label')).toBe('Home');
        el.label = undefined;
        await el.updateComplete;
        expect(anchor(el).hasAttribute('aria-label')).toBe(false);
    });

    it('lets a plain listener on the host see the click', async () => {
        const el = await fixture(
            html`<hmi-link href="#clicked">Docs</hmi-link>`,
        );
        let seen = 0;
        el.addEventListener('click', (event) => {
            seen += 1;
            event.preventDefault();
        });
        anchor(el).click();
        expect(seen).toBe(1);
    });

    it('delegates focus to the anchor', async () => {
        const el = await fixture(html`<hmi-link href="#x">Docs</hmi-link>`);
        el.focus();
        expect(el.shadowRoot?.activeElement).toBe(anchor(el));
    });

    it('draws the underline as asked', async () => {
        const el = await fixture(html`<hmi-link href="#x">Docs</hmi-link>`);
        const line = () => getComputedStyle(anchor(el)).textDecorationLine;
        expect(line()).toBe('underline');
        el.underline = 'none';
        await el.updateComplete;
        expect(line()).toBe('none');
        el.underline = 'hover';
        await el.updateComplete;
        expect(line()).toBe('none');
    });

    it('takes the accent, and the muted role for the muted tone', async () => {
        const el = await fixture(html`<hmi-link href="#x">Docs</hmi-link>`);
        el.style.cssText =
            '--ref-primary-40: rgb(1, 2, 3); --on-surface-variant: rgb(4, 5, 6)';
        expect(getComputedStyle(anchor(el)).color).toBe('rgb(1, 2, 3)');
        el.tone = 'muted';
        await el.updateComplete;
        expect(getComputedStyle(anchor(el)).color).toBe('rgb(4, 5, 6)');
    });

    it('sizes the underline in base units', async () => {
        const el = await fixture(html`<hmi-link href="#x">Docs</hmi-link>`);
        const style = getComputedStyle(anchor(el));
        expect(style.textDecorationThickness).toBe('1px');
        expect(style.textUnderlineOffset).toBe('3px');
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Link,
                    {
                        href: '/docs',
                        target: '_blank',
                        underline: 'hover',
                        tone: 'muted',
                        label: 'Docs',
                    },
                    'Read the docs',
                ),
            );
        });
        const el = mount.querySelector('hmi-link') as HmiLink;
        await el.updateComplete;
        expect(el.href).toBe('/docs');
        expect(el.underline).toBe('hover');
        expect(el.tone).toBe('muted');
        expect(anchor(el).getAttribute('rel')).toBe('noopener noreferrer');
        expect(anchor(el).getAttribute('aria-label')).toBe('Docs');
    });
});
