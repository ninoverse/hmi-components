import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './divider.js';
import type { HmiDivider } from './divider.js';
import { Divider } from './divider.react.js';

/** Resolves after the slotchange event and the update it requests. */
async function settle(el: HmiDivider): Promise<void> {
    await el.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await el.updateComplete;
}

async function fixture(template: ReturnType<typeof html>): Promise<HmiDivider> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiDivider;
    await settle(el);
    return el;
}

const part = (el: HmiDivider, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const lines = (el: HmiDivider) => [
    ...(el.shadowRoot?.querySelectorAll<HTMLElement>('.line') ?? []),
];

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-divider', () => {
    it('registers', () => {
        expect(customElements.get('hmi-divider')).toBeDefined();
    });

    it('draws a one-pixel horizontal rule by default', async () => {
        const el = await fixture(
            html`<hmi-divider style="width: 200px"></hmi-divider>`,
        );
        expect(el.orientation).toBe('horizontal');
        expect(el.align).toBe('center');
        const { width, height } = part(el, 'base').getBoundingClientRect();
        expect(width).toBe(200);
        expect(height).toBe(1);
    });

    it('reflects orientation and align', async () => {
        const el = await fixture(html`<hmi-divider></hmi-divider>`);
        el.orientation = 'vertical';
        el.align = 'end';
        await el.updateComplete;
        expect(el.getAttribute('orientation')).toBe('vertical');
        expect(el.getAttribute('align')).toBe('end');
    });

    it('is a separator with its orientation when plain', async () => {
        const el = await fixture(html`<hmi-divider></hmi-divider>`);
        const base = part(el, 'base');
        expect(base.getAttribute('role')).toBe('separator');
        expect(base.getAttribute('aria-orientation')).toBe('horizontal');
        el.orientation = 'vertical';
        await el.updateComplete;
        expect(base.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('stretches a vertical rule to its flex row', async () => {
        const host = document.createElement('div');
        host.style.cssText = 'display: flex; height: 80px';
        host.innerHTML =
            '<span>a</span><hmi-divider orientation="vertical"></hmi-divider><span>b</span>';
        document.body.append(host);
        const el = host.querySelector('hmi-divider') as HmiDivider;
        await settle(el);
        const { width, height } = part(el, 'base').getBoundingClientRect();
        expect(width).toBe(1);
        expect(height).toBe(80);
    });

    it('gives a vertical rule a minimum height of 1.5 base units', async () => {
        const el = await fixture(
            html`<hmi-divider orientation="vertical"></hmi-divider>`,
        );
        expect(el.getBoundingClientRect().height).toBe(12);
    });

    it('shows its label with a rule on each side, and is no longer a separator', async () => {
        const el = await fixture(
            html`<hmi-divider style="width: 300px">OR</hmi-divider>`,
        );
        const base = part(el, 'base');
        expect(base.classList.contains('labeled')).toBe(true);
        expect(base.hasAttribute('role')).toBe(false);
        expect(base.hasAttribute('aria-orientation')).toBe(false);
        expect(getComputedStyle(part(el, 'label')).display).toBe('block');
        const [first, second] = lines(el) as [HTMLElement, HTMLElement];
        for (const line of [first, second]) {
            expect(getComputedStyle(line).display).toBe('block');
            expect(line.getAttribute('aria-hidden')).toBe('true');
        }
        expect(first.getBoundingClientRect().width).toBeGreaterThan(50);
        expect(
            part(el, 'label').querySelector('slot')?.assignedNodes().length,
        ).toBeGreaterThan(0);
    });

    it('ignores whitespace as a label', async () => {
        const el = await fixture(html`<hmi-divider> </hmi-divider>`);
        expect(part(el, 'base').classList.contains('labeled')).toBe(false);
    });

    it('is never labelled when vertical', async () => {
        const el = await fixture(
            html`<hmi-divider orientation="vertical">OR</hmi-divider>`,
        );
        expect(part(el, 'base').classList.contains('labeled')).toBe(false);
        expect(part(el, 'base').getAttribute('role')).toBe('separator');
    });

    it('anchors the label to the start or the end', async () => {
        const el = await fixture(
            html`<hmi-divider align="start" style="width: 300px">OR</hmi-divider>`,
        );
        const [first, second] = lines(el) as [HTMLElement, HTMLElement];
        expect(first.getBoundingClientRect().width).toBe(12);
        expect(second.getBoundingClientRect().width).toBeGreaterThan(100);
        el.align = 'end';
        await el.updateComplete;
        expect(second.getBoundingClientRect().width).toBe(12);
        expect(first.getBoundingClientRect().width).toBeGreaterThan(100);
    });

    it('follows a label added and removed later', async () => {
        const el = await fixture(html`<hmi-divider></hmi-divider>`);
        const label = document.createElement('span');
        label.textContent = 'OR';
        el.append(label);
        await settle(el);
        expect(part(el, 'base').classList.contains('labeled')).toBe(true);
        label.remove();
        await settle(el);
        expect(part(el, 'base').classList.contains('labeled')).toBe(false);
        expect(part(el, 'base').getAttribute('role')).toBe('separator');
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(Divider, { align: 'start' }, 'OR'),
            );
        });
        const el = mount.querySelector('hmi-divider') as HmiDivider;
        await settle(el);
        expect(el.align).toBe('start');
        expect(part(el, 'base').classList.contains('labeled')).toBe(true);
    });
});
