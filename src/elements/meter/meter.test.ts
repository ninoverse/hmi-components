import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import './meter.js';
import type { HmiMeter } from './meter.js';
import { Meter } from './meter.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiMeter> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiMeter;
    await el.updateComplete;
    return el;
}

const part = (el: HmiMeter, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(
        `[part~="${name}"]`,
    ) as HTMLElement;
const fill = (el: HmiMeter) =>
    el.shadowRoot?.querySelector<HTMLElement>('.fill') as HTMLElement;

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

    it('resolves the quality level like the native meter', async () => {
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
    });

    it('shows the value only with show-value', async () => {
        const el = await fixture(html`<hmi-meter value="0.4"></hmi-meter>`);
        expect(el.shadowRoot?.querySelector('.value')).toBeNull();
        el.showValue = true;
        await el.updateComplete;
        expect(el.shadowRoot?.querySelector('.value')?.textContent).toBe('0.4');
        expect(el.hasAttribute('show-value')).toBe(true);
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

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Meter,
                    { value: 0.8, low: 0.3, high: 0.7, showValue: true },
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
    });
});
