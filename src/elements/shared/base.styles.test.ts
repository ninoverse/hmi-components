/// <reference types="vite/client" />
import { html, render } from 'lit';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import baseCss from '../../../public/css/base.css?inline';
import '../badge/badge.js';

/* `--hmi-base` scales the library from the root only. An element sizes from
   `--_base` and from the theme's `--space-*`, which are resolved at the root,
   so one set below it would scale the first and not the second. Badge stands
   for every element: all of them take `--_base` from `baseStyles`. */
let sheet: HTMLStyleElement;

beforeEach(() => {
    sheet = document.createElement('style');
    sheet.textContent = baseCss;
    document.head.append(sheet);
});

afterEach(() => {
    sheet.remove();
    document.documentElement.style.removeProperty('--hmi-base');
    document.body.replaceChildren();
});

async function height(template: ReturnType<typeof html>): Promise<number> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-badge') as HTMLElement & {
        updateComplete: Promise<unknown>;
    };
    await el.updateComplete;
    return (
        el.shadowRoot?.querySelector('[part="base"]') as HTMLElement
    ).getBoundingClientRect().height;
}

describe('--hmi-base', () => {
    it('changes nothing when set on an element', async () => {
        const plain = await height(html`<hmi-badge>Hi</hmi-badge>`);
        const set = await height(
            html`<hmi-badge style="--hmi-base: 16px">Hi</hmi-badge>`,
        );
        expect(set).toBe(plain);
    });

    it('changes nothing when set on a container', async () => {
        const plain = await height(html`<hmi-badge>Hi</hmi-badge>`);
        const set = await height(
            html`<div style="--hmi-base: 16px"><hmi-badge>Hi</hmi-badge></div>`,
        );
        expect(set).toBe(plain);
    });

    it('scales every element when set on the root', async () => {
        const plain = await height(html`<hmi-badge>Hi</hmi-badge>`);
        document.documentElement.style.setProperty('--hmi-base', '16px');
        const scaled = await height(html`<hmi-badge>Hi</hmi-badge>`);
        expect(scaled).toBe(plain * 2);
    });
});
