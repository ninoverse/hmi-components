// The Playwright provider's types give `cdp()` its `send`.
import type {} from '@vitest/browser-playwright';
import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { cdp } from 'vitest/browser';
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
    /* The first update reads the label slot, which can ask for a second. */
    let settled = false;
    while (!settled) settled = await el.updateComplete;
    return el;
}

const base = (el: HmiProgress) =>
    el.shadowRoot?.querySelector<HTMLElement>('[part~="base"]') as HTMLElement;
const part = (el: HmiProgress, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const bar = (el: HmiProgress) => part(el, 'indicator');

/* Runs `check` with media features emulated, then clears them. */
async function withMedia(
    features: { name: string; value: string }[],
    check: () => void | Promise<void>,
) {
    const session = cdp();
    await session.send('Emulation.setEmulatedMedia', { features });
    try {
        await check();
    } finally {
        await session.send('Emulation.setEmulatedMedia', { features: [] });
    }
}

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
        expect(el.max).toBe(100);
        expect(el.indeterminate).toBe(false);
        expect(el.showValue).toBe(false);
        expect(el.valueText).toBe('');
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

    it('counts the value out of max', async () => {
        const el = await fixture(
            html`<hmi-progress value="3" max="7" label="Files"></hmi-progress>`,
        );
        expect(Number.parseFloat(bar(el).style.width)).toBeCloseTo(42.857, 2);
        expect(base(el).getAttribute('aria-valuemax')).toBe('7');
        expect(base(el).getAttribute('aria-valuenow')).toBe('3');
        el.value = 9;
        await el.updateComplete;
        expect(bar(el).style.width).toBe('100%');
        expect(base(el).getAttribute('aria-valuenow')).toBe('7');
    });

    it('reads a max that is not a number above 0 as 100', async () => {
        for (const max of ['0', '-5', 'abc']) {
            const el = await fixture(
                html`<hmi-progress value="40" max=${max}></hmi-progress>`,
            );
            expect(bar(el).style.width).toBe('40%');
            expect(base(el).getAttribute('aria-valuemax')).toBe('100');
        }
    });

    it('reads a value that is not a number as 0', async () => {
        const el = await fixture(
            html`<hmi-progress value="abc" label="Upload"></hmi-progress>`,
        );
        expect(bar(el).style.width).toBe('0%');
        expect(base(el).getAttribute('aria-valuenow')).toBe('0');
        el.value = 50;
        await el.updateComplete;
        el.value = Number.NaN;
        await el.updateComplete;
        expect(bar(el).style.width).toBe('0%');
        expect(base(el).getAttribute('aria-valuenow')).toBe('0');
    });

    it('drops the float noise of arithmetic', async () => {
        const el = await fixture(html`<hmi-progress></hmi-progress>`);
        el.value = 0.1 + 0.2;
        await el.updateComplete;
        expect(base(el).getAttribute('aria-valuenow')).toBe('0.3');
    });

    it("takes its name from the host's aria-label when label is unset", async () => {
        const el = await fixture(
            html`<hmi-progress value="50" aria-label="Backup"></hmi-progress>`,
        );
        expect(base(el).getAttribute('aria-label')).toBe('Backup');
        el.setAttribute('aria-label', 'Restore');
        await el.updateComplete;
        expect(base(el).getAttribute('aria-label')).toBe('Restore');
        el.label = 'Export';
        await el.updateComplete;
        expect(base(el).getAttribute('aria-label')).toBe('Export');
    });

    it('writes no aria-label for an empty label', async () => {
        const el = await fixture(
            html`<hmi-progress value="50" label=""></hmi-progress>`,
        );
        expect(base(el).hasAttribute('aria-label')).toBe(false);
    });

    it('shows a slotted label and names the bar with it', async () => {
        const el = await fixture(
            html`<hmi-progress value="40"><span slot="label">Backup</span></hmi-progress>`,
        );
        expect(base(el).getAttribute('aria-labelledby')).toBe('label');
        const slot = part(el, 'label').querySelector('slot') as HTMLSlotElement;
        expect(slot.assignedElements()).toHaveLength(1);
        expect(
            part(el, 'label').getBoundingClientRect().height,
        ).toBeGreaterThan(0);
    });

    it('hides the header when there is no label and no value', async () => {
        const el = await fixture(
            html`<hmi-progress value="40" label="Backup"></hmi-progress>`,
        );
        const header = el.shadowRoot?.querySelector('.header') as HTMLElement;
        expect(getComputedStyle(header).display).toBe('none');
        expect(base(el).hasAttribute('aria-labelledby')).toBe(false);
        expect(el.getBoundingClientRect().height).toBe(8);
    });

    it('shows the percentage, rounded down, with show-value', async () => {
        const el = await fixture(
            html`<hmi-progress value="2" max="3" show-value label="Files"></hmi-progress>`,
        );
        expect(part(el, 'value').textContent).toBe('66%');
        el.indeterminate = true;
        await el.updateComplete;
        expect(part(el, 'value')).toBeNull();
    });

    it('shows and announces value-text in place of the percentage', async () => {
        const el = await fixture(
            html`<hmi-progress
                value="3"
                max="7"
                show-value
                value-text="3 of 7 files"
                label="Files"
            ></hmi-progress>`,
        );
        expect(part(el, 'value').textContent).toBe('3 of 7 files');
        expect(base(el).getAttribute('aria-valuetext')).toBe('3 of 7 files');
        el.indeterminate = true;
        await el.updateComplete;
        expect(part(el, 'value').textContent).toBe('3 of 7 files');
    });

    it("takes a panel's text colours", async () => {
        const el = await fixture(
            html`<hmi-progress
                style="--on-panel: rgb(1, 2, 3); --on-panel-variant: rgb(4, 5, 6)"
                value="40"
                show-value
                ><span slot="label">Backup</span></hmi-progress
            >`,
        );
        expect(getComputedStyle(part(el, 'label')).color).toBe('rgb(1, 2, 3)');
        expect(getComputedStyle(part(el, 'value')).color).toBe('rgb(4, 5, 6)');
    });

    it('takes the bar colour from --progress-indicator', async () => {
        const el = await fixture(
            html`<hmi-progress
                style="--primary: rgb(1, 2, 3)"
                value="40"
            ></hmi-progress>`,
        );
        expect(getComputedStyle(bar(el)).backgroundColor).toBe('rgb(1, 2, 3)');
        el.style.setProperty('--progress-indicator', 'rgb(4, 5, 6)');
        expect(getComputedStyle(bar(el)).backgroundColor).toBe('rgb(4, 5, 6)');
    });

    it('runs the indeterminate loop toward the inline end in right-to-left', async () => {
        // the theme files are not loaded in the test page: give the animation
        // its easing token, or the shorthand is invalid at computed-value time
        const el = await fixture(
            html`<hmi-progress
                indeterminate
                style="--easing-standard: ease"
            ></hmi-progress>`,
        );
        expect(getComputedStyle(bar(el)).animationName).toBe('progress-indet');
        el.parentElement?.setAttribute('dir', 'rtl');
        expect(getComputedStyle(bar(el)).animationName).toBe(
            'progress-indet-rtl',
        );
    });

    it('keeps the track and bar visible in forced colors', async () => {
        const el = await fixture(
            html`<hmi-progress value="50"></hmi-progress>`,
        );
        await withMedia([{ name: 'forced-colors', value: 'active' }], () => {
            /* Forced colors repaint backgrounds as Canvas: the track keeps
               an edge and the bar takes the text's colour. */
            const track = getComputedStyle(base(el));
            expect(track.borderTopStyle).toBe('solid');
            expect(track.borderTopColor).toBe(track.color);
            expect(getComputedStyle(bar(el)).backgroundColor).toBe(track.color);
        });
    });

    it("stops the bar's transition under reduced motion", async () => {
        const el = await fixture(
            html`<hmi-progress value="50"></hmi-progress>`,
        );
        await withMedia(
            [{ name: 'prefers-reduced-motion', value: 'reduce' }],
            () => {
                expect(getComputedStyle(bar(el)).transitionProperty).toBe(
                    'none',
                );
            },
        );
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(Progress, {
                    value: 64,
                    max: 200,
                    indeterminate: false,
                    label: 'Uploading',
                    showValue: true,
                    valueText: '64 of 200 MB',
                }),
            );
        });
        const el = mount.querySelector('hmi-progress') as HmiProgress;
        await el.updateComplete;
        expect(el.value).toBe(64);
        expect(el.max).toBe(200);
        expect(el.label).toBe('Uploading');
        expect(el.showValue).toBe(true);
        expect(el.valueText).toBe('64 of 200 MB');
        expect(base(el).getAttribute('aria-valuenow')).toBe('64');
    });
});
