// The Playwright provider's types give `cdp()` its `send`.
import type {} from '@vitest/browser-playwright';
import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { cdp } from 'vitest/browser';
import './meter.js';
import type { HmiMeter } from './meter.js';
import { Meter } from './meter.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiMeter> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiMeter;
    /* The first update reads the label slot, which can ask for a second. */
    let settled = false;
    while (!settled) settled = await el.updateComplete;
    return el;
}

const part = (el: HmiMeter, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const fill = (el: HmiMeter) => part(el, 'indicator');

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
});

describe('hmi-meter', () => {
    it('registers', () => {
        expect(customElements.get('hmi-meter')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-meter value="0.5"></hmi-meter>`);
        const { width, height } = part(el, 'base').getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBe(8);
    });

    it('has defaults', async () => {
        const el = await fixture(html`<hmi-meter></hmi-meter>`);
        expect(el.value).toBe(0);
        expect(el.min).toBe(0);
        expect(el.max).toBe(1);
        expect(el.low).toBeUndefined();
        expect(el.showValue).toBe(false);
    });

    it('sizes the fill and clamps to the range', async () => {
        const el = await fixture(
            html`<hmi-meter min="0" max="200" value="50"></hmi-meter>`,
        );
        expect(fill(el).style.width).toBe('25%');
        el.value = 999;
        await el.updateComplete;
        expect(fill(el).style.width).toBe('100%');
        expect(part(el, 'base').getAttribute('aria-valuenow')).toBe('200');
        el.value = -5;
        await el.updateComplete;
        expect(fill(el).style.width).toBe('0%');
    });

    it('exposes the meter role and its range', async () => {
        const el = await fixture(
            html`<hmi-meter min="10" max="20" value="15"></hmi-meter>`,
        );
        const base = part(el, 'base');
        expect(base.getAttribute('role')).toBe('meter');
        expect(base.getAttribute('aria-valuemin')).toBe('10');
        expect(base.getAttribute('aria-valuemax')).toBe('20');
        expect(base.getAttribute('aria-valuenow')).toBe('15');
    });

    it("resolves the quality level by hmi's rule", async () => {
        const level = async (attrs: string) => {
            const host = document.createElement('div');
            document.body.append(host);
            host.innerHTML = `<hmi-meter ${attrs}></hmi-meter>`;
            const el = host.firstElementChild as HmiMeter;
            await el.updateComplete;
            return fill(el).className.replace('fill', '').trim();
        };
        // optimum defaults to max, so a high value is in the optimum band
        expect(await level('value="0.9" low="0.3" high="0.7"')).toBe('optimal');
        expect(await level('value="0.5" low="0.3" high="0.7"')).toBe(
            'suboptimal',
        );
        expect(await level('value="0.1" low="0.3" high="0.7"')).toBe('poor');
        expect(
            await level('value="0.8" low="0.3" high="0.7" optimum="0.2"'),
        ).toBe('poor');
        /* hmi's rule, not the native meter's: `low` belongs to the low band
           and `high` to the high band, and without thresholds only `max`
           is optimal. */
        expect(await level('value="0.3" low="0.3" high="0.7"')).toBe('poor');
        expect(await level('value="0.7" low="0.3" high="0.7"')).toBe('optimal');
        expect(await level('value="0.6"')).toBe('suboptimal');
        expect(await level('value="1"')).toBe('optimal');
        expect(await level('value="0"')).toBe('poor');
    });

    it('names the track from label when nothing is slotted', async () => {
        const el = await fixture(
            html`<hmi-meter value="0.4" label="Memory"></hmi-meter>`,
        );
        expect(part(el, 'base').getAttribute('aria-label')).toBe('Memory');
        expect(part(el, 'base').hasAttribute('aria-labelledby')).toBe(false);
    });

    it('shows and reads value-text in place of the number', async () => {
        const el = await fixture(
            html`<hmi-meter value="0.85" show-value value-text="85%, nearly full"></hmi-meter>`,
        );
        expect(part(el, 'value').textContent).toBe('85%, nearly full');
        expect(part(el, 'base').getAttribute('aria-valuetext')).toBe(
            '85%, nearly full',
        );
        el.valueText = '';
        await el.updateComplete;
        expect(part(el, 'value').textContent).toBe('0.85');
        expect(part(el, 'base').hasAttribute('aria-valuetext')).toBe(false);
    });

    it('drops the float noise of arithmetic', async () => {
        const el = await fixture(html`<hmi-meter show-value></hmi-meter>`);
        el.value = 0.1 + 0.2;
        await el.updateComplete;
        expect(part(el, 'value').textContent).toBe('0.3');
        expect(part(el, 'base').getAttribute('aria-valuenow')).toBe('0.3');
    });

    it('reads a value that is not a number as 0, and a max below min as min', async () => {
        const el = await fixture(
            html`<hmi-meter value="abc" show-value></hmi-meter>`,
        );
        expect(fill(el).style.width).toBe('0%');
        expect(part(el, 'value').textContent).toBe('0');
        expect(part(el, 'base').getAttribute('aria-valuenow')).toBe('0');
        el.min = 2;
        el.max = -1;
        el.value = 5;
        await el.updateComplete;
        expect(part(el, 'base').getAttribute('aria-valuemin')).toBe('2');
        expect(part(el, 'base').getAttribute('aria-valuemax')).toBe('2');
        expect(part(el, 'base').getAttribute('aria-valuenow')).toBe('2');
    });

    it('shows the value only with show-value', async () => {
        const el = await fixture(html`<hmi-meter value="0.4"></hmi-meter>`);
        expect(el.shadowRoot?.querySelector('[part~="value"]')).toBeNull();
        el.showValue = true;
        await el.updateComplete;
        expect(part(el, 'value').textContent).toBe('0.4');
        expect(el.hasAttribute('show-value')).toBe(true);
        el.removeAttribute('show-value');
        await el.updateComplete;
        expect(el.showValue).toBe(false);
    });

    it('names the track from the label slot', async () => {
        const el = await fixture(
            html`<hmi-meter value="0.4"><span slot="label">Disk</span></hmi-meter>`,
        );
        await new Promise((r) => requestAnimationFrame(r));
        await el.updateComplete;
        expect(part(el, 'base').getAttribute('aria-labelledby')).toBe('label');
        const slot = part(el, 'label').querySelector('slot') as HTMLSlotElement;
        expect(slot.assignedElements()).toHaveLength(1);
    });

    it('hides the header when there is no label and no value', async () => {
        const el = await fixture(html`<hmi-meter value="0.4"></hmi-meter>`);
        const header = el.shadowRoot?.querySelector('.header') as HTMLElement;
        expect(getComputedStyle(header).display).toBe('none');
        expect(part(el, 'base').hasAttribute('aria-labelledby')).toBe(false);
    });

    it("takes a panel's text colours", async () => {
        const el = await fixture(
            html`<hmi-meter
                style="--on-panel: rgb(1, 2, 3); --on-panel-variant: rgb(4, 5, 6)"
                value="0.4"
                show-value
                ><span slot="label">Disk</span></hmi-meter
            >`,
        );
        expect(getComputedStyle(part(el, 'label')).color).toBe('rgb(1, 2, 3)');
        expect(getComputedStyle(part(el, 'value')).color).toBe('rgb(4, 5, 6)');
    });

    it('reads the theme hooks for the track edge and fills', async () => {
        const el = await fixture(
            html`<hmi-meter
                style="--meter-track-border: 1px solid rgb(1, 2, 3); --meter-suboptimal: rgb(4, 5, 6)"
                value="0.5"
                low="0.3"
                high="0.7"
            ></hmi-meter>`,
        );
        const base = getComputedStyle(part(el, 'base'));
        expect(base.borderTopWidth).toBe('1px');
        expect(base.borderTopColor).toBe('rgb(1, 2, 3)');
        expect(getComputedStyle(fill(el)).backgroundColor).toBe('rgb(4, 5, 6)');
        el.style.removeProperty('--meter-track-border');
        expect(getComputedStyle(part(el, 'base')).borderTopStyle).toBe('none');
    });

    it('keeps the track and fill visible in forced colors', async () => {
        const el = await fixture(html`<hmi-meter value="0.5"></hmi-meter>`);
        await withMedia([{ name: 'forced-colors', value: 'active' }], () => {
            /* Forced colors repaint backgrounds as Canvas: the track keeps
               an edge and the fill takes the text's colour. */
            const base = getComputedStyle(part(el, 'base'));
            expect(base.borderTopStyle).toBe('solid');
            expect(base.borderTopColor).toBe(base.color);
            expect(getComputedStyle(fill(el)).backgroundColor).toBe(base.color);
        });
    });

    it("stops the fill's transition under reduced motion", async () => {
        const el = await fixture(html`<hmi-meter value="0.5"></hmi-meter>`);
        await withMedia(
            [{ name: 'prefers-reduced-motion', value: 'reduce' }],
            () => {
                expect(getComputedStyle(fill(el)).transitionProperty).toBe(
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
                createElement(
                    Meter,
                    {
                        value: 0.8,
                        low: 0.3,
                        high: 0.7,
                        showValue: true,
                        valueText: '80%',
                        label: 'Disk usage',
                    },
                    createElement('span', { slot: 'label' }, 'Disk'),
                ),
            );
        });
        const el = mount.querySelector('hmi-meter') as HmiMeter;
        await el.updateComplete;
        expect(el.value).toBe(0.8);
        expect(el.low).toBe(0.3);
        expect(el.high).toBe(0.7);
        expect(el.showValue).toBe(true);
        expect(el.valueText).toBe('80%');
        expect(el.label).toBe('Disk usage');
    });
});
