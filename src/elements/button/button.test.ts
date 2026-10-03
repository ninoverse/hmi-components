import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import './button.js';
import type { HmiButton } from './button.js';
import { Button } from './button.react.js';

async function fixture(
    template: ReturnType<typeof html>,
    container: HTMLElement = document.body,
): Promise<HmiButton> {
    const host = document.createElement('div');
    container.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiButton;
    await el.updateComplete;
    return el;
}

const tick = () => new Promise<void>((resolve) => setTimeout(resolve));

function inner(el: HmiButton): HTMLButtonElement {
    return el.shadowRoot?.querySelector('[part~="base"]') as HTMLButtonElement;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-button', () => {
    it('registers', () => {
        expect(customElements.get('hmi-button')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-button>Save</hmi-button>`);
        const { width, height } = inner(el).getBoundingClientRect();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
    });

    it('reflects variant', async () => {
        const el = await fixture(
            html`<hmi-button variant="danger">Delete</hmi-button>`,
        );
        expect(el.variant).toBe('danger');
        el.variant = 'ghost';
        await el.updateComplete;
        expect(el.getAttribute('variant')).toBe('ghost');
    });

    it('reflects size', async () => {
        const el = await fixture(
            html`<hmi-button size="large">Go</hmi-button>`,
        );
        expect(el.size).toBe('large');
        el.size = 'small';
        await el.updateComplete;
        expect(el.getAttribute('size')).toBe('small');
    });

    it('reflects as-icon', async () => {
        const el = await fixture(html`<hmi-button as-icon>+</hmi-button>`);
        expect(el.asIcon).toBe(true);
        el.asIcon = false;
        await el.updateComplete;
        expect(el.hasAttribute('as-icon')).toBe(false);
    });

    it('boolean attribute presence', async () => {
        const el = await fixture(html`<hmi-button disabled>Save</hmi-button>`);
        expect(el.disabled).toBe(true);
        expect(inner(el).disabled).toBe(true);
        el.removeAttribute('disabled');
        await el.updateComplete;
        expect(el.disabled).toBe(false);
        expect(inner(el).disabled).toBe(false);
    });

    it('defaults to a plain button', async () => {
        const el = await fixture(html`<hmi-button>Save</hmi-button>`);
        expect(el.type).toBe('button');
        expect(el.variant).toBe('primary');
        expect(el.size).toBe('medium');
        expect(inner(el).type).toBe('button');
    });

    it('projects the default slot', async () => {
        const el = await fixture(html`<hmi-button><b>Save</b></hmi-button>`);
        const slot =
            el.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
        expect(slot?.assignedElements()).toHaveLength(1);
    });

    it('projects left-icon slot', async () => {
        const el = await fixture(
            html`<hmi-button><svg slot="left-icon"></svg>Save</hmi-button>`,
        );
        const slot = el.shadowRoot?.querySelector<HTMLSlotElement>(
            'slot[name="left-icon"]',
        );
        expect(slot?.assignedElements()).toHaveLength(1);
    });

    it('projects right-icon slot', async () => {
        const el = await fixture(
            html`<hmi-button>Next<svg slot="right-icon"></svg></hmi-button>`,
        );
        const slot = el.shadowRoot?.querySelector<HTMLSlotElement>(
            'slot[name="right-icon"]',
        );
        expect(slot?.assignedElements()).toHaveLength(1);
    });

    it('forwards label to aria-label', async () => {
        const el = await fixture(
            html`<hmi-button as-icon label="Favourite">+</hmi-button>`,
        );
        expect(inner(el).getAttribute('aria-label')).toBe('Favourite');
        el.label = 'Star';
        await el.updateComplete;
        expect(inner(el).getAttribute('aria-label')).toBe('Star');
        el.label = undefined;
        await el.updateComplete;
        expect(inner(el).hasAttribute('aria-label')).toBe(false);
    });

    it('type="submit" submits the host form', async () => {
        const form = document.createElement('form');
        document.body.append(form);
        const submit = vi.fn((event: Event) => event.preventDefault());
        form.addEventListener('submit', submit);
        const el = await fixture(
            html`<hmi-button type="submit">Send</hmi-button>`,
            form,
        );
        inner(el).click();
        await tick();
        expect(submit).toHaveBeenCalledOnce();
    });

    it('preventDefault in a click handler cancels submit and reset', async () => {
        const form = document.createElement('form');
        document.body.append(form);
        const input = document.createElement('input');
        input.defaultValue = 'a';
        form.append(input);
        const submit = vi.fn((event: Event) => event.preventDefault());
        form.addEventListener('submit', submit);
        const send = await fixture(
            html`<hmi-button type="submit">Send</hmi-button>`,
            form,
        );
        const reset = await fixture(
            html`<hmi-button type="reset">Reset</hmi-button>`,
            form,
        );
        for (const el of [send, reset]) {
            el.addEventListener('click', (event) => event.preventDefault());
        }
        input.value = 'b';
        inner(send).click();
        inner(reset).click();
        await tick();
        expect(submit).not.toHaveBeenCalled();
        expect(input.value).toBe('b');
    });

    it('ignore-prevent-default acts synchronously and ignores preventDefault', async () => {
        const form = document.createElement('form');
        document.body.append(form);
        const submit = vi.fn((event: Event) => event.preventDefault());
        form.addEventListener('submit', submit);
        const el = await fixture(
            html`<hmi-button type="submit" ignore-prevent-default>Send</hmi-button>`,
            form,
        );
        el.addEventListener('click', (event) => event.preventDefault());
        inner(el).click();
        expect(submit).toHaveBeenCalledOnce();
    });

    it('reflects ignore-prevent-default', async () => {
        const el = await fixture(
            html`<hmi-button ignore-prevent-default>Go</hmi-button>`,
        );
        expect(el.ignorePreventDefault).toBe(true);
        el.ignorePreventDefault = false;
        await el.updateComplete;
        expect(el.hasAttribute('ignore-prevent-default')).toBe(false);
    });

    it('type="reset" resets the host form', async () => {
        const form = document.createElement('form');
        document.body.append(form);
        const input = document.createElement('input');
        input.defaultValue = 'a';
        form.append(input);
        const el = await fixture(
            html`<hmi-button type="reset">Reset</hmi-button>`,
            form,
        );
        input.value = 'b';
        inner(el).click();
        await tick();
        expect(input.value).toBe('a');
    });

    it('type="button" does not submit', async () => {
        const form = document.createElement('form');
        document.body.append(form);
        const submit = vi.fn((event: Event) => event.preventDefault());
        form.addEventListener('submit', submit);
        const el = await fixture(html`<hmi-button>Plain</hmi-button>`, form);
        inner(el).click();
        await tick();
        expect(submit).not.toHaveBeenCalled();
    });

    it('a disabled fieldset disables it without clearing disabled', async () => {
        const fieldset = document.createElement('fieldset');
        document.body.append(fieldset);
        const el = await fixture(html`<hmi-button>Save</hmi-button>`, fieldset);
        fieldset.disabled = true;
        await el.updateComplete;
        expect(inner(el).disabled).toBe(true);
        expect(el.disabled).toBe(false);
        fieldset.disabled = false;
        await el.updateComplete;
        expect(inner(el).disabled).toBe(false);

        el.disabled = true;
        fieldset.disabled = true;
        fieldset.disabled = false;
        await el.updateComplete;
        expect(el.disabled).toBe(true);
        expect(inner(el).disabled).toBe(true);
    });

    it('delegates focus to the inner button', async () => {
        const el = await fixture(html`<hmi-button>Save</hmi-button>`);
        el.focus();
        expect(el.shadowRoot?.activeElement).toBe(inner(el));
    });

    it('exposes roles', async () => {
        const el = await fixture(html`<hmi-button>Save</hmi-button>`);
        expect(inner(el).tagName).toBe('BUTTON');
        expect(inner(el).getAttribute('role')).toBeNull();
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        const onClick = vi.fn();
        await act(async () => {
            createRoot(mount).render(
                createElement(
                    Button,
                    { variant: 'danger', size: 'large', onClick },
                    'Delete',
                ),
            );
        });
        const el = mount.querySelector('hmi-button') as HmiButton;
        await el.updateComplete;
        expect(el.variant).toBe('danger');
        expect(el.size).toBe('large');
        inner(el).click();
        expect(onClick).toHaveBeenCalledOnce();
    });
});
