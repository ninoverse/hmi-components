import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './progress.js';
import type { HmiProgress } from './progress.js';
import { Progress } from './progress.react.js';

async function fixture(
    template: ReturnType<typeof html>,
): Promise<HmiProgress> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiProgress;
    await el.updateComplete;
    return el;
}

const base = (el: HmiProgress) =>
    el.shadowRoot?.querySelector<HTMLElement>('[part~="base"]') as HTMLElement;
const bar = (el: HmiProgress) =>
    el.shadowRoot?.querySelector<HTMLElement>('.bar') as HTMLElement;

afterEach(() => {
    document.body.replaceChildren();
    document.documentElement.removeAttribute('style');
});

describe('hmi-progress', () => {
    it('registers', () => {
        expect(customElements.get('hmi-progress')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-progress></hmi-progress>`);
        const { width, height } = base(el).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBe(8);
    });

    it('has defaults', async () => {
        const el = await fixture(html`<hmi-progress></hmi-progress>`);
        expect(el.value).toBe(0);
        expect(el.indeterminate).toBe(false);
        expect(el.label).toBeUndefined();
        expect(base(el).hasAttribute('aria-label')).toBe(false);
    });

    it('sizes the bar and clamps the value to 0–100', async () => {
        const el = await fixture(
            html`<hmi-progress value="64"></hmi-progress>`,
        );
        expect(bar(el).style.width).toBe('64%');
        expect(base(el).getAttribute('aria-valuenow')).toBe('64');
        el.value = 250;
        await el.updateComplete;
        expect(bar(el).style.width).toBe('100%');
        expect(base(el).getAttribute('aria-valuenow')).toBe('100');
        el.value = -3;
        await el.updateComplete;
        expect(bar(el).style.width).toBe('0%');
    });

    it('exposes the progressbar role and label', async () => {
        const el = await fixture(
            html`<hmi-progress value="10" label="Uploading"></hmi-progress>`,
        );
        const track = base(el);
        expect(track.getAttribute('role')).toBe('progressbar');
        expect(track.getAttribute('aria-valuemin')).toBe('0');
        expect(track.getAttribute('aria-valuemax')).toBe('100');
        expect(track.getAttribute('aria-label')).toBe('Uploading');
    });

    it('reflects indeterminate, drops aria-valuenow and the inline width', async () => {
        const el = await fixture(
            html`<hmi-progress value="40" indeterminate></hmi-progress>`,
        );
        expect(el.indeterminate).toBe(true);
        expect(base(el).hasAttribute('aria-valuenow')).toBe(false);
        expect(bar(el).style.width).toBe('');
        // the theme files are not loaded in the test page: give the animation
        // its easing token, or the shorthand is invalid at computed-value time
        el.style.setProperty('--easing-standard', 'ease');
        expect(getComputedStyle(bar(el)).animationName).toContain(
            'progress-indet',
        );
        el.indeterminate = false;
        await el.updateComplete;
        expect(el.hasAttribute('indeterminate')).toBe(false);
        expect(base(el).getAttribute('aria-valuenow')).toBe('40');
    });

    it('draws no border by default and takes it from --progress-track-border', async () => {
        const el = await fixture(
            html`<hmi-progress value="50"></hmi-progress>`,
        );
        expect(getComputedStyle(base(el)).borderTopWidth).toBe('0px');
        el.style.setProperty('--progress-track-border', '2px solid red');
        expect(getComputedStyle(base(el)).borderTopWidth).toBe('2px');
        expect(getComputedStyle(base(el)).borderTopStyle).toBe('solid');
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(Progress, {
                    value: 64,
                    indeterminate: false,
                    label: 'Uploading',
                }),
            );
        });
        const el = mount.querySelector('hmi-progress') as HmiProgress;
        await el.updateComplete;
        expect(el.value).toBe(64);
        expect(el.label).toBe('Uploading');
        expect(base(el).getAttribute('aria-valuenow')).toBe('64');
    });
});
