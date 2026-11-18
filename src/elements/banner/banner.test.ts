import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import defaultPalette from '../../../public/css/themes/color/default.css?inline';
import './banner.js';
import type { HmiBanner } from './banner.js';
import { Banner } from './banner.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<HmiBanner> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiBanner;
    await el.updateComplete;
    return el;
}

function slotted(el: HmiBanner, name?: string): Element[] {
    const selector = name ? `slot[name="${name}"]` : 'slot:not([name])';
    return (
        el.shadowRoot
            ?.querySelector<HTMLSlotElement>(selector)
            ?.assignedElements() ?? []
    );
}

const part = (el: HmiBanner, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(`[part~="${name}"]`);

/* The palette's own colours: without them, every colour inherits. */
async function withPalette(run: () => Promise<void>): Promise<void> {
    const sheet = document.createElement('style');
    sheet.textContent = defaultPalette;
    document.head.append(sheet);
    try {
        await run();
    } finally {
        sheet.remove();
    }
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-banner', () => {
    it('registers', () => {
        expect(customElements.get('hmi-banner')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-banner>Saved</hmi-banner>`);
        const { width, height } = (
            part(el, 'base') as Element
        ).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });

    it('reflects variant', async () => {
        const el = await fixture(
            html`<hmi-banner variant="danger">Failed</hmi-banner>`,
        );
        expect(el.variant).toBe('danger');
        el.variant = 'success';
        await el.updateComplete;
        expect(el.getAttribute('variant')).toBe('success');
    });

    it('defaults to info', async () => {
        const el = await fixture(html`<hmi-banner>Saved</hmi-banner>`);
        expect(el.variant).toBe('info');
        expect(el.getAttribute('variant')).toBe('info');
    });

    it('reflects dismissible as presence', async () => {
        const el = await fixture(
            html`<hmi-banner dismissible>Saved</hmi-banner>`,
        );
        expect(el.dismissible).toBe(true);
        el.dismissible = false;
        await el.updateComplete;
        expect(el.hasAttribute('dismissible')).toBe(false);
        expect(part(el, 'dismiss')).toBeNull();
    });

    it('shows the dismiss button only when dismissible', async () => {
        const plain = await fixture(html`<hmi-banner>Saved</hmi-banner>`);
        expect(part(plain, 'dismiss')).toBeNull();
        const el = await fixture(
            html`<hmi-banner dismissible>Saved</hmi-banner>`,
        );
        expect(part(el, 'dismiss')).not.toBeNull();
    });

    it('labels the dismiss button from dismiss-label', async () => {
        const el = await fixture(
            html`<hmi-banner dismissible>Saved</hmi-banner>`,
        );
        expect(part(el, 'dismiss')?.getAttribute('aria-label')).toBe('Dismiss');
        el.dismissLabel = 'Close';
        await el.updateComplete;
        expect(part(el, 'dismiss')?.getAttribute('aria-label')).toBe('Close');
        const attr = await fixture(
            html`<hmi-banner dismissible dismiss-label="Fermer">Saved</hmi-banner>`,
        );
        expect(attr.dismissLabel).toBe('Fermer');
    });

    it('dispatches hmi-dismiss with detail and hides itself', async () => {
        const el = await fixture(
            html`<hmi-banner dismissible>Saved</hmi-banner>`,
        );
        let event: CustomEvent | undefined;
        document.addEventListener(
            'hmi-dismiss',
            (e) => {
                event = e as CustomEvent;
            },
            { once: true },
        );
        part(el, 'dismiss')?.click();
        expect(event?.detail).toEqual({});
        expect(event?.bubbles).toBe(true);
        expect(event?.composed).toBe(true);
        expect(event?.cancelable).toBe(true);
        expect(el.hidden).toBe(true);
        expect(getComputedStyle(el).display).toBe('none');
    });

    it('dispatches no hmi-dismiss when hidden programmatically', async () => {
        const el = await fixture(
            html`<hmi-banner dismissible>Saved</hmi-banner>`,
        );
        let fired = 0;
        document.addEventListener('hmi-dismiss', () => {
            fired += 1;
        });
        el.hidden = true;
        el.dismissible = false;
        await el.updateComplete;
        expect(fired).toBe(0);
    });

    it('stays visible when hmi-dismiss is cancelled', async () => {
        const el = await fixture(
            html`<hmi-banner dismissible>Saved</hmi-banner>`,
        );
        el.addEventListener('hmi-dismiss', (e) => e.preventDefault());
        part(el, 'dismiss')?.click();
        expect(el.hidden).toBe(false);
    });

    it('projects the default slot', async () => {
        const el = await fixture(html`<hmi-banner><b>Saved</b></hmi-banner>`);
        expect(slotted(el)).toHaveLength(1);
    });

    it('projects title slot', async () => {
        const el = await fixture(
            html`<hmi-banner><span slot="title">Saved</span>Body</hmi-banner>`,
        );
        expect(slotted(el, 'title')).toHaveLength(1);
    });

    it('projects action slot', async () => {
        const el = await fixture(
            html`<hmi-banner><button slot="action">Undo</button>Body</hmi-banner>`,
        );
        expect(slotted(el, 'action')).toHaveLength(1);
    });

    it('projects icon slot, replacing the built-in icon', async () => {
        const plain = await fixture(html`<hmi-banner>Body</hmi-banner>`);
        expect(
            plain.shadowRoot?.querySelector('slot[name="icon"] svg'),
        ).not.toBeNull();
        const custom = await fixture(
            html`<hmi-banner><svg slot="icon"></svg>Body</hmi-banner>`,
        );
        expect(slotted(custom, 'icon')).toHaveLength(1);
    });

    it('draws the built-in icon as real SVG shapes', async () => {
        const el = await fixture(html`<hmi-banner>Body</hmi-banner>`);
        const shape = el.shadowRoot?.querySelector('.icon svg circle');
        expect(shape?.namespaceURI).toBe('http://www.w3.org/2000/svg');
        const { width, height } = (
            el.shadowRoot?.querySelector('.icon svg') as Element
        ).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });

    it('exposes roles', async () => {
        const role = async (variant: string) =>
            part(
                await fixture(
                    html`<hmi-banner variant=${variant}>Body</hmi-banner>`,
                ),
                'base',
            )?.getAttribute('role');
        expect(await role('danger')).toBe('alert');
        expect(await role('warning')).toBe('alert');
        expect(await role('info')).toBe('status');
        expect(await role('success')).toBe('status');
        const el = await fixture(html`<hmi-banner>Body</hmi-banner>`);
        expect(part(el, 'icon')?.getAttribute('aria-hidden')).toBe('true');
    });

    it('names its tone for screen readers, before the message', async () => {
        const names = {
            info: 'Info:',
            success: 'Success:',
            warning: 'Warning:',
            danger: 'Error:',
        };
        for (const [variant, name] of Object.entries(names)) {
            const el = await fixture(
                html`<hmi-banner variant=${variant}><span slot="title">Title</span>Message</hmi-banner>`,
            );
            const content = el.shadowRoot?.querySelector('.content');
            const tone = content?.firstElementChild as HTMLElement;
            expect(tone?.textContent?.trim(), variant).toBe(name);
            expect(tone.closest('[aria-hidden="true"]')).toBeNull();
            /* Inside the live region, so an announcement starts with it. */
            expect(tone.closest('[role]')).toBe(part(el, 'base'));
            /* Read, not seen. */
            expect(tone.getBoundingClientRect().width).toBeLessThanOrEqual(1);
        }
    });

    it('takes its tone from variant-label when set', async () => {
        const el = await fixture(
            html`<hmi-banner variant="danger" variant-label="Fehler:">Message</hmi-banner>`,
        );
        const tone = el.shadowRoot?.querySelector('.content')
            ?.firstElementChild as HTMLElement;
        expect(el.variantLabel).toBe('Fehler:');
        expect(tone.textContent?.trim()).toBe('Fehler:');
    });

    it('sizes its dismiss button to at least 24px, at full strength', async () => {
        await withPalette(async () => {
            for (const variant of ['info', 'success', 'warning', 'danger']) {
                const el = await fixture(
                    html`<hmi-banner variant=${variant} dismissible>Message</hmi-banner>`,
                );
                const button = part(el, 'dismiss') as HTMLElement;
                const { width, height } = button.getBoundingClientRect();
                expect(width, variant).toBeGreaterThanOrEqual(24);
                expect(height, variant).toBeGreaterThanOrEqual(24);
                const style = getComputedStyle(button);
                expect(style.opacity, variant).toBe('1');
                expect(style.color, variant).toBe(
                    getComputedStyle(part(el, 'base') as HTMLElement).color,
                );
            }
        });
    });

    it('draws its stripe on the inline start, in either direction', async () => {
        await withPalette(async () => {
            const host = document.createElement('div');
            host.dir = 'rtl';
            document.body.append(host);
            render(
                html`<hmi-banner variant="warning">Message</hmi-banner>`,
                host,
            );
            const rtl = host.firstElementChild as HmiBanner;
            await rtl.updateComplete;
            const rtlBase = getComputedStyle(part(rtl, 'base') as HTMLElement);
            expect(rtlBase.borderRightWidth).toBe('4px');
            expect(rtlBase.borderLeftWidth).toBe('0px');
            const ltr = await fixture(
                html`<hmi-banner variant="warning">Message</hmi-banner>`,
            );
            const ltrBase = getComputedStyle(part(ltr, 'base') as HTMLElement);
            expect(ltrBase.borderLeftWidth).toBe('4px');
            expect(ltrBase.borderRightWidth).toBe('0px');
        });
    });

    it('sets a paragraph body without its margins', async () => {
        const el = await fixture(
            html`<hmi-banner><p>Body in a paragraph.</p></hmi-banner>`,
        );
        const p = el.querySelector('p') as HTMLElement;
        expect(getComputedStyle(p).marginTop).toBe('0px');
        expect(getComputedStyle(p).marginBottom).toBe('0px');
    });

    it('paints an unknown variant as info', async () => {
        await withPalette(async () => {
            const paint = async (variant: string) => {
                const el = await fixture(
                    html`<hmi-banner variant=${variant}>Message</hmi-banner>`,
                );
                const base = getComputedStyle(part(el, 'base') as HTMLElement);
                return [
                    base.backgroundColor,
                    base.color,
                    base.borderInlineStartColor,
                ];
            };
            expect(await paint('error')).toEqual(await paint('info'));
        });
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        let dismissed = 0;
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Banner,
                    {
                        variant: 'warning',
                        dismissible: true,
                        onDismiss: () => {
                            dismissed += 1;
                        },
                    },
                    createElement('span', { slot: 'title' }, 'Heads up'),
                    'Disk almost full.',
                ),
            );
        });
        const el = mount.querySelector('hmi-banner') as HmiBanner;
        await el.updateComplete;
        expect(el.variant).toBe('warning');
        expect(el.dismissible).toBe(true);
        expect(slotted(el, 'title')).toHaveLength(1);
        part(el, 'dismiss')?.click();
        expect(dismissed).toBe(1);
    });
});
