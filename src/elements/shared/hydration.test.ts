// Lit's hydration support goes first: lit-element installs it as it loads.
import '@lit-labs/ssr-client/lit-element-hydrate-support.js';
import { hydrate } from '@lit-labs/ssr-client';
import { html, render } from 'lit';
import { afterEach, describe, expect, it } from 'vitest';
import { commands } from 'vitest/browser';
import '../index.js';

declare module 'vitest/browser' {
    interface BrowserCommands {
        renderOnServer: (
            strings: string[],
            values: unknown[],
            modules: string[],
        ) => Promise<string>;
    }
}

/* Each element that reads its slots, rendered on the server by @lit-labs/ssr
   in Node with every slot filled, then hydrated by Lit in the page, as
   Next.js, Angular SSR or Dioxus fullstack would. A hydrated root fires no
   slotchange for the slots it already fills, so an element that reads its
   slots only on slotchange never sees what the server sent: it reads them in
   firstUpdated() too, through readSlots() from shared/dom.ts.

   Each row checks that the hydrated element, its light DOM and its shadow
   root match the same template rendered on the client. Three attributes are left out of the comparison:
   `style`, which carries measurements, and `checked` and `value` on an
   `<input>`, which the server writes as attributes from property bindings
   while the client sets the properties. An element that reads its slots adds
   its row, as each element's review adds its row to axe.test.ts. */

type Case = { name: string; strings: string[]; values: unknown[] };

/* A template's parts, sent to the server as JSON and rebuilt on both sides. */
const row =
    (name: string) =>
    (strings: TemplateStringsArray, ...values: unknown[]): Case => ({
        name,
        strings: [...strings],
        values,
    });

const cases: Case[] = [
    row('hmi-breadcrumbs')`<hmi-breadcrumbs .items=${[
        { label: 'Home', href: '/' },
        { label: 'Settings' },
    ]}><span slot="label-0">Start</span><b slot="separator">›</b></hmi-breadcrumbs>`,
    row('hmi-carousel')`<hmi-carousel label="Highlights"
        ><div>Slide A</div><div>Slide B</div></hmi-carousel>`,
    row('hmi-chart-tooltip')`<hmi-chart-tooltip .items=${[
        { label: 'Revenue', value: '$48k', color: 'red' },
    ]}><b slot="heading">Jan 2026</b><i slot="label-0">Net revenue</i></hmi-chart-tooltip>`,
    row('hmi-checkbox')`<hmi-checkbox>I <b>agree</b></hmi-checkbox>`,
    row('hmi-combobox')`<hmi-combobox label="City" .options=${[
        { value: 'paris', label: 'Paris' },
    ]}><i slot="description-paris">France</i></hmi-combobox>`,
    row('hmi-command-palette')`<hmi-command-palette open .commands=${[
        { value: 'new', label: 'New' },
    ]}><i slot="description-new">A blank page</i><b slot="icon-new">+</b><kbd
        slot="shortcut-new">N</kbd></hmi-command-palette>`,
    row('hmi-confirm-dialog')`<hmi-confirm-dialog open
        ><span slot="title">Delete?</span><span slot="description">It can't be undone.</span
        ><span slot="confirm-label">Delete</span><span slot="cancel-label">Keep</span
    ></hmi-confirm-dialog>`,
    row('hmi-context-menu')`<hmi-context-menu><div slot="trigger">Area</div
        ><hmi-menu slot="menu"><hmi-menu-item>One</hmi-menu-item></hmi-menu></hmi-context-menu>`,
    row('hmi-divider')`<hmi-divider>or</hmi-divider>`,
    row('hmi-donut-chart')`<hmi-donut-chart label="Traffic" .segments=${[
        { label: 'Direct', value: 45 },
        { label: 'Search', value: 30 },
    ]}><b slot="center-label">75</b></hmi-donut-chart>`,
    row('hmi-drawer')`<hmi-drawer open
        ><span slot="title">Filters</span><span slot="description">Narrow the list.</span
        >Body<button slot="actions">Apply</button></hmi-drawer>`,
    row('hmi-empty-state')`<hmi-empty-state
        ><svg slot="icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg
        ><span slot="title">No results</span><span slot="description">Try another word.</span
        ><button slot="action">Clear</button></hmi-empty-state>`,
    row('hmi-form-control')`<hmi-form-control
        ><span slot="label">Name</span><span slot="hint">As on your card</span
        ><span slot="error">Required</span><input aria-label="Name" /></hmi-form-control>`,
    row(
        'hmi-gauge',
    )`<hmi-gauge value="72" label="Load"><span slot="caption">72%</span></hmi-gauge>`,
    row(
        'hmi-hover-card',
    )`<hmi-hover-card><button slot="trigger">Ada</button>Card</hmi-hover-card>`,
    row('hmi-image')`<hmi-image alt="Cover" ratio="1.78"
        ><img alt="Own" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'/%3E"
    /></hmi-image>`,
    row('hmi-kbd')`<hmi-kbd>Ctrl</hmi-kbd>`,
    row('hmi-list')`<hmi-list .items=${[{ id: 1 }, { id: 2, title: 'Two' }]}
        ><b slot="title-1">One</b><i slot="subtitle-1">First</i><u slot="right-1">1</u></hmi-list>`,
    row('hmi-menu-item')`<hmi-menu-item
        ><span slot="icon">+</span>New<kbd slot="shortcut">N</kbd></hmi-menu-item>`,
    row(
        'hmi-meter',
    )`<hmi-meter value="30"><span slot="label">Disk</span></hmi-meter>`,
    row('hmi-modal')`<hmi-modal open
        ><span slot="title">Rename</span><span slot="description">Pick a new name.</span
        >Body<button slot="actions">Save</button></hmi-modal>`,
    row(
        'hmi-navbar',
    )`<hmi-navbar .links=${[{ value: 'home', label: 'Home', href: '/' }]}
        ><b slot="brand">Ninoverse</b><button slot="right">Account</button
        ><i slot="badge-home">3</i></hmi-navbar>`,
    row(
        'hmi-popover',
    )`<hmi-popover><button slot="trigger">Open</button>Content</hmi-popover>`,
    row(
        'hmi-progress',
    )`<hmi-progress value="30"><span slot="label">Upload</span></hmi-progress>`,
    row('hmi-radio')`<hmi-radio value="a">Option <b>A</b></hmi-radio>`,
    row(
        'hmi-segmented-control',
    )`<hmi-segmented-control label="View" value="list" .options=${[
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid' },
    ]}><span slot="icon-list">≡</span></hmi-segmented-control>`,
    row(
        'hmi-select',
    )`<hmi-select label="Plan" .options=${[{ value: 'free', label: 'Free' }]}
        ><span slot="icon-free">★</span><span slot="placeholder">Pick a plan</span></hmi-select>`,
    row('hmi-sidebar')`<hmi-sidebar .groups=${[
        {
            label: 'Mail',
            items: [{ value: 'inbox', label: 'Inbox', href: '#' }],
        },
    ]}><span slot="icon-inbox">✉</span><i slot="badge-inbox">12</i></hmi-sidebar>`,
    row('hmi-stat')`<hmi-stat trend="up"
        ><span slot="label">Revenue</span><span slot="value">$12.4k</span
        ><span slot="delta">8%</span><span slot="help-text">vs last month</span></hmi-stat>`,
    row('hmi-stepper')`<hmi-stepper current="cart" .steps=${[
        { value: 'cart', label: 'Cart' },
        { value: 'pay', label: 'Pay' },
    ]}><i slot="description-cart">2 items</i></hmi-stepper>`,
    row('hmi-switch')`<hmi-switch>Wi-<b>Fi</b></hmi-switch>`,
    row('hmi-tabs')`<hmi-tabs value="all" .options=${[
        { value: 'all', label: 'All' },
        { value: 'mine', label: 'Mine' },
    ]}><span slot="icon-all">◎</span><i slot="badge-all">9</i></hmi-tabs>`,
    row('hmi-timeline')`<hmi-timeline .items=${[{ title: 'Created' }]}
        ><span slot="icon-0">•</span><i slot="time-0">09:00</i><i slot="description-0">By Ada</i></hmi-timeline>`,
    row(
        'hmi-tooltip',
    )`<hmi-tooltip><button slot="trigger">Save</button><span slot="label">Saves the file</span></hmi-tooltip>`,
    row('hmi-tree')`<hmi-tree .nodes=${[{ value: 'src', label: 'src' }]}
        ><span slot="icon-src">▸</span><i slot="badge-src">4</i></hmi-tree>`,
    row(
        'hmi-value-scale-selector',
    )`<hmi-value-scale-selector label="Rating" max="3"
        ><b slot="icon">♥</b></hmi-value-scale-selector>`,
];

type Updating = Element & { updateComplete?: Promise<unknown> };

/* Waits until every element in `root`, nested ones included, has rendered. */
async function settle(root: Element): Promise<void> {
    for (let i = 0; i < 3; i++) {
        const elements: Updating[] = [];
        const walk = (node: Element | ShadowRoot) => {
            for (const el of node.querySelectorAll('*')) {
                if (el.localName.startsWith('hmi-')) elements.push(el);
                if (el.shadowRoot) walk(el.shadowRoot);
            }
        };
        walk(root);
        await Promise.all(elements.map((el) => el.updateComplete));
        await new Promise((resolve) => requestAnimationFrame(resolve));
    }
}

const ignored = (el: Element, name: string) =>
    name === 'style' ||
    (el.localName === 'input' && (name === 'checked' || name === 'value'));

/* A root as lines of tags, sorted attributes and text, nested shadow roots
   included, without comments or styles. */
function outline(node: Node, depth = 0): string[] {
    const lines: string[] = [];
    const pad = '  '.repeat(depth);
    for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent?.trim();
            if (text) lines.push(`${pad}"${text}"`);
        } else if (child instanceof Element && child.localName !== 'style') {
            const attributes = [...child.attributes]
                .filter((a) => !ignored(child, a.name))
                .map((a) => `${a.name}="${a.value}"`)
                .sort();
            lines.push(`${pad}<${[child.localName, ...attributes].join(' ')}>`);
            lines.push(...outline(child, depth + 1));
            if (child.shadowRoot) {
                lines.push(...outline(child.shadowRoot, depth + 1));
            }
        }
    }
    return lines;
}

/* Out of the pointer's way, so a hover doesn't open a tooltip in one copy. */
const stage = document.createElement('div');
stage.style.cssText = 'position: absolute; top: 2000px; left: 2000px';

afterEach(() => {
    stage.replaceChildren();
    stage.remove();
});

describe('a hydrated element matches its client render', () => {
    for (const { name, strings, values } of cases) {
        it(name, async () => {
            document.body.append(stage);
            const template = html(
                Object.assign([...strings], { raw: [...strings] }),
                ...values,
            );
            const sent = await commands.renderOnServer(strings, values, [
                'src/elements/index.ts',
            ]);

            /* As a framework hydrates a page: the element waits while the
               page's template sets its properties, then hydrates. */
            const server = document.createElement('div');
            server.setHTMLUnsafe(
                sent.replace(`<${name}`, `<${name} defer-hydration`),
            );
            stage.append(server);
            const hydrated = server.querySelector(name) as Updating;
            const root = hydrated.shadowRoot;
            hydrate(template, server);
            hydrated.removeAttribute('defer-hydration');

            const client = document.createElement('div');
            stage.append(client);
            render(template, client);

            await settle(server);
            await settle(client);
            /* the server's root, kept rather than rendered again */
            expect(hydrated.shadowRoot).toBe(root);
            /* the element, its light DOM, which it may give attributes such
               as aria-expanded, and its shadow root */
            expect(outline(server)).toEqual(outline(client));
        });
    }
});
