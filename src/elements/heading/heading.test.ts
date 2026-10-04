import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './heading.js';
import type { HeadingLevel, HmiHeading } from './heading.js';
import { Heading } from './heading.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiHeading> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiHeading;
    await el.updateComplete;
    return el;
}

const base = (el: HmiHeading) =>
    el.shadowRoot?.querySelector<HTMLElement>('[part~="base"]') as HTMLElement;
const fontSize = (el: HmiHeading) => getComputedStyle(base(el)).fontSize;

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-heading', () => {
    it('registers', () => {
        expect(customElements.get('hmi-heading')).toBeDefined();
    });

    it('renders a level-2 heading by default', async () => {
        const el = await fixture(html`<hmi-heading>Title</hmi-heading>`);
        expect(el.level).toBe(2);
        expect(el.size).toBeUndefined();
        expect(el.tone).toBe('default');
        expect(el.truncate).toBe(false);
        expect(base(el).tagName).toBe('H2');
        expect(getComputedStyle(el).display).toBe('block');
        expect(base(el).getBoundingClientRect().height).toBeGreaterThan(0);
    });

    it('renders the tag that goes with the level', async () => {
        const el = await fixture(
            html`<hmi-heading level="1">Title</hmi-heading>`,
        );
        for (const level of [1, 2, 3, 4, 5, 6] as HeadingLevel[]) {
            el.level = level;
            await el.updateComplete;
            expect(base(el).tagName).toBe(`H${level}`);
            expect(el.getAttribute('level')).toBe(String(level));
        }
    });

    it('reads the level from the attribute as a number', async () => {
        const el = await fixture(
            html`<hmi-heading level="4">Title</hmi-heading>`,
        );
        expect(el.level).toBe(4);
        expect(base(el).tagName).toBe('H4');
    });

    it('falls back to level 2 for an invalid level', async () => {
        const el = await fixture(
            html`<hmi-heading level="9">Title</hmi-heading>`,
        );
        expect(base(el).tagName).toBe('H2');
    });

    it('picks the default size from the level', async () => {
        const el = await fixture(html`<hmi-heading>Title</hmi-heading>`);
        const sizes: Record<HeadingLevel, string> = {
            1: '36px',
            2: '30px',
            3: '24px',
            4: '20px',
            5: '20px',
            6: '16px',
        };
        for (const [level, px] of Object.entries(sizes)) {
            el.level = Number(level) as HeadingLevel;
            await el.updateComplete;
            expect(fontSize(el)).toBe(px);
        }
    });

    it('lets size override the level independently', async () => {
        const el = await fixture(
            html`<hmi-heading level="1" size="xsmall">Title</hmi-heading>`,
        );
        expect(base(el).tagName).toBe('H1');
        expect(fontSize(el)).toBe('16px');
        el.size = 'xlarge';
        await el.updateComplete;
        expect(el.getAttribute('size')).toBe('xlarge');
        expect(fontSize(el)).toBe('36px');
    });

    it('treats an empty size attribute as unset', async () => {
        const el = await fixture(
            html`<hmi-heading size="">Title</hmi-heading>`,
        );
        expect(fontSize(el)).toBe('30px');
    });

    it('keeps the slotted text', async () => {
        const el = await fixture(html`<hmi-heading>Title</hmi-heading>`);
        expect(
            el.shadowRoot?.querySelector('slot')?.assignedNodes().length,
        ).toBeGreaterThan(0);
        expect(el.textContent).toBe('Title');
    });

    it('maps the tones to the text roles', async () => {
        const el = await fixture(html`<hmi-heading>Title</hmi-heading>`);
        el.style.cssText =
            '--on-surface: rgb(1, 1, 1); --on-surface-variant: rgb(2, 2, 2); --primary: rgb(3, 3, 3); color: rgb(4, 4, 4)';
        const color = () => getComputedStyle(base(el)).color;
        expect(color()).toBe('rgb(1, 1, 1)');
        el.tone = 'muted';
        await el.updateComplete;
        expect(color()).toBe('rgb(2, 2, 2)');
        el.tone = 'primary';
        await el.updateComplete;
        expect(color()).toBe('rgb(3, 3, 3)');
        el.tone = 'inherit';
        await el.updateComplete;
        expect(color()).toBe('rgb(4, 4, 4)');
    });

    it('truncates to one line with an ellipsis', async () => {
        const el = await fixture(
            html`<hmi-heading truncate style="width: 100px"
                >A heading far too long to fit in a hundred pixels</hmi-heading
            >`,
        );
        const style = getComputedStyle(base(el));
        expect(style.whiteSpace).toBe('nowrap');
        expect(style.overflow).toBe('hidden');
        expect(style.textOverflow).toBe('ellipsis');
        expect(base(el).scrollWidth).toBeGreaterThan(base(el).clientWidth);
        expect(el.hasAttribute('truncate')).toBe(true);
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Heading,
                    { level: 3, tone: 'muted', truncate: true },
                    'Title',
                ),
            );
        });
        const el = mount.querySelector('hmi-heading') as HmiHeading;
        await el.updateComplete;
        expect(el.level).toBe(3);
        expect(el.tone).toBe('muted');
        expect(el.truncate).toBe(true);
        expect(base(el).tagName).toBe('H3');
    });
});
