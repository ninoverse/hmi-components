import { html, render, type TemplateResult } from 'lit';
import { afterEach, describe, expect, it } from 'vitest';
import '../index.js';
import { resetToasts, toast } from './toast.js';

/* The per-corner tokens name logical corners: `--corner-tl` is the start of
   the first line, top left in left-to-right text and top right in
   right-to-left, and so on round the box. Each row renders an element under
   `dir="ltr"` and `dir="rtl"`, with a different length on each token, and reads
   the radii of the node that paints them: right-to-left must be the
   left-to-right shape mirrored. A drawer is pinned to a physical side, so its
   rows say what right-to-left gives instead. */

type Radii = readonly [tl: string, tr: string, br: string, bl: string];

const TOKENS =
    '--corner-tl: 10px; --corner-tr: 11px; --corner-br: 12px; --corner-bl: 13px; --corner-extra-small: 3px';

/** Two options, items or tabs, so the first and the last differ. */
const TWO = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
];

/** Every corner from its token, as most elements paint them. */
const LEAF: Radii = ['10px', '11px', '12px', '13px'];

const cases: ReadonlyArray<{
    name: string;
    template: TemplateResult;
    /** The node that paints the corners, from the element. */
    node: (el: HTMLElement) => Element | null | undefined;
    /** The physical radii in left-to-right text: top left, top right, bottom right, bottom left. */
    ltr: Radii;
    /** The physical radii in right-to-left text, when they are not `ltr` mirrored. */
    rtl?: Radii;
    setup?: () => void;
}> = [
    {
        name: 'hmi-alert',
        template: html`<hmi-alert>Saved</hmi-alert>`,
        node: (el) => el.shadowRoot?.querySelector('.base'),
        ltr: LEAF,
    },
    {
        name: 'hmi-banner',
        template: html`<hmi-banner>Maintenance tonight</hmi-banner>`,
        node: (el) => el.shadowRoot?.querySelector('.base'),
        ltr: LEAF,
    },
    {
        name: 'hmi-box radius="leaf"',
        template: html`<hmi-box radius="leaf">Box</hmi-box>`,
        node: (el) => el,
        ltr: LEAF,
    },
    {
        name: 'hmi-button',
        template: html`<hmi-button>Save</hmi-button>`,
        node: (el) => el.shadowRoot?.querySelector('button'),
        ltr: LEAF,
    },
    {
        name: 'hmi-card',
        template: html`<hmi-card>Body</hmi-card>`,
        node: (el) => el.shadowRoot?.querySelector('.panel'),
        ltr: LEAF,
    },
    {
        name: 'hmi-combobox',
        template: html`<hmi-combobox
            .options=${TWO}
        ></hmi-combobox>`,
        node: (el) => el.shadowRoot?.querySelector('.base'),
        ltr: LEAF,
    },
    {
        name: 'hmi-combobox listbox',
        template: html`<hmi-combobox
            .options=${TWO}
        ></hmi-combobox>`,
        node: (el) => el.shadowRoot?.querySelector('.panel'),
        ltr: LEAF,
    },
    {
        name: 'hmi-combobox first option',
        template: html`<hmi-combobox
            .options=${TWO}
        ></hmi-combobox>`,
        node: (el) => el.shadowRoot?.querySelector('.option:first-of-type'),
        ltr: ['10px', '11px', '3px', '3px'],
    },
    {
        name: 'hmi-combobox last option',
        template: html`<hmi-combobox
            .options=${TWO}
        ></hmi-combobox>`,
        node: (el) => el.shadowRoot?.querySelector('.option:last-of-type'),
        ltr: ['3px', '3px', '12px', '13px'],
    },
    {
        name: 'hmi-command-palette',
        template: html`<hmi-command-palette></hmi-command-palette>`,
        node: (el) => el.shadowRoot?.querySelector('.panel'),
        ltr: LEAF,
    },
    {
        name: 'hmi-context-menu',
        template: html`<hmi-context-menu></hmi-context-menu>`,
        node: (el) => el.shadowRoot?.querySelector('.panel'),
        ltr: LEAF,
    },
    {
        name: 'hmi-date-picker',
        template: html`<hmi-date-picker></hmi-date-picker>`,
        node: (el) => el.shadowRoot?.querySelector('.base'),
        ltr: LEAF,
    },
    {
        name: 'hmi-drawer on the right',
        template: html`<hmi-drawer side="right"></hmi-drawer>`,
        node: (el) => el.shadowRoot?.querySelector('.panel'),
        // The corners facing the screen: on its left in both directions.
        ltr: ['10px', '0px', '0px', '13px'],
        rtl: ['11px', '0px', '0px', '12px'],
    },
    {
        name: 'hmi-drawer on the left',
        template: html`<hmi-drawer side="left"></hmi-drawer>`,
        node: (el) => el.shadowRoot?.querySelector('.panel'),
        ltr: ['0px', '11px', '12px', '0px'],
        rtl: ['0px', '10px', '13px', '0px'],
    },
    {
        name: 'hmi-drawer at the top',
        template: html`<hmi-drawer side="top"></hmi-drawer>`,
        node: (el) => el.shadowRoot?.querySelector('.panel'),
        ltr: ['0px', '0px', '12px', '13px'],
    },
    {
        name: 'hmi-drawer at the bottom',
        template: html`<hmi-drawer side="bottom"></hmi-drawer>`,
        node: (el) => el.shadowRoot?.querySelector('.panel'),
        ltr: ['10px', '11px', '0px', '0px'],
    },
    {
        name: 'hmi-empty-state',
        template: html`<hmi-empty-state
            ><span slot="title">Nothing here</span></hmi-empty-state
        >`,
        node: (el) => el.shadowRoot?.querySelector('.base'),
        ltr: LEAF,
    },
    {
        name: 'hmi-file-upload',
        template: html`<hmi-file-upload></hmi-file-upload>`,
        node: (el) => el.shadowRoot?.querySelector('.zone'),
        ltr: LEAF,
    },
    {
        name: 'hmi-hover-card',
        template: html`<hmi-hover-card
            ><button slot="trigger">Ada</button>Card</hmi-hover-card
        >`,
        node: (el) => el.shadowRoot?.querySelector('.panel'),
        ltr: LEAF,
    },
    {
        name: 'hmi-input',
        template: html`<hmi-input label="Name"></hmi-input>`,
        node: (el) => el.shadowRoot?.querySelector('.base'),
        ltr: LEAF,
    },
    {
        name: 'hmi-list',
        template: html`<hmi-list></hmi-list>`,
        node: (el) => el.shadowRoot?.querySelector('.base'),
        ltr: LEAF,
    },
    {
        name: "hmi-menu's first item",
        template: html`<hmi-menu
            ><hmi-menu-item>Copy</hmi-menu-item
            ><hmi-menu-item>Paste</hmi-menu-item></hmi-menu
        >`,
        node: (el) =>
            el
                .querySelector('hmi-menu-item:first-child')
                ?.shadowRoot?.querySelector('.base'),
        ltr: ['10px', '11px', '3px', '3px'],
    },
    {
        name: "hmi-menu's last item",
        template: html`<hmi-menu
            ><hmi-menu-item>Copy</hmi-menu-item
            ><hmi-menu-item>Paste</hmi-menu-item></hmi-menu
        >`,
        node: (el) =>
            el
                .querySelector('hmi-menu-item:last-child')
                ?.shadowRoot?.querySelector('.base'),
        ltr: ['3px', '3px', '12px', '13px'],
    },
    {
        name: 'hmi-modal',
        template: html`<hmi-modal heading="Delete"></hmi-modal>`,
        node: (el) => el.shadowRoot?.querySelector('.panel'),
        ltr: LEAF,
    },
    {
        name: 'hmi-multi-input',
        template: html`<hmi-multi-input label="Code"></hmi-multi-input>`,
        node: (el) => el.shadowRoot?.querySelector('.cell'),
        ltr: LEAF,
    },
    {
        name: 'hmi-navbar',
        template: html`<hmi-navbar></hmi-navbar>`,
        node: (el) => el.shadowRoot?.querySelector('.panel'),
        ltr: LEAF,
    },
    {
        name: 'hmi-number-input',
        template: html`<hmi-number-input label="Count"></hmi-number-input>`,
        node: (el) => el.shadowRoot?.querySelector('.base'),
        ltr: LEAF,
    },
    {
        name: 'hmi-popover',
        template: html`<hmi-popover
            ><button slot="trigger">Open</button>Panel</hmi-popover
        >`,
        node: (el) => el.shadowRoot?.querySelector('.panel'),
        ltr: LEAF,
    },
    {
        name: 'hmi-segmented-control',
        template: html`<hmi-segmented-control
            .options=${TWO}
        ></hmi-segmented-control>`,
        node: (el) => el.shadowRoot?.querySelector('.base'),
        ltr: LEAF,
    },
    {
        name: "hmi-segmented-control's first segment",
        template: html`<hmi-segmented-control
            .options=${TWO}
        ></hmi-segmented-control>`,
        node: (el) => el.shadowRoot?.querySelector('.segment:first-child'),
        ltr: ['10px', '3px', '3px', '13px'],
    },
    {
        name: "hmi-segmented-control's last segment",
        template: html`<hmi-segmented-control
            .options=${TWO}
        ></hmi-segmented-control>`,
        node: (el) => el.shadowRoot?.querySelector('.segment:last-child'),
        ltr: ['3px', '11px', '12px', '3px'],
    },
    {
        name: 'hmi-select',
        template: html`<hmi-select label="Fruit"></hmi-select>`,
        node: (el) => el.shadowRoot?.querySelector('.base'),
        ltr: LEAF,
    },
    {
        name: 'hmi-sidebar',
        template: html`<hmi-sidebar></hmi-sidebar>`,
        node: (el) => el.shadowRoot?.querySelector('.panel'),
        ltr: LEAF,
    },
    {
        name: "hmi-sidebar's last link",
        template: html`<hmi-sidebar
            .groups=${[
                {
                    items: TWO,
                },
            ]}
        ></hmi-sidebar>`,
        node: (el) => el.shadowRoot?.querySelectorAll('.link')[1],
        ltr: ['3px', '3px', '12px', '13px'],
    },
    {
        name: 'hmi-stat',
        template: html`<hmi-stat
            ><span slot="label">Users</span><span slot="value">12</span></hmi-stat
        >`,
        node: (el) => el.shadowRoot?.querySelector('.base'),
        ltr: LEAF,
    },
    {
        name: 'hmi-table',
        template: html`<hmi-table></hmi-table>`,
        node: (el) => el.shadowRoot?.querySelector('.base'),
        ltr: LEAF,
    },
    {
        name: 'hmi-tabs',
        template: html`<hmi-tabs
            value="a"
            .options=${TWO}
        ></hmi-tabs>`,
        node: (el) => el.shadowRoot?.querySelector('.tabs'),
        ltr: LEAF,
    },
    {
        name: "hmi-tabs' indicator on the first tab",
        template: html`<hmi-tabs
            value="a"
            .options=${TWO}
        ></hmi-tabs>`,
        node: (el) => el.shadowRoot?.querySelector('.indicator'),
        ltr: ['10px', '3px', '3px', '13px'],
    },
    {
        name: "hmi-tabs' indicator on the last tab",
        template: html`<hmi-tabs
            value="b"
            .options=${TWO}
        ></hmi-tabs>`,
        node: (el) => el.shadowRoot?.querySelector('.indicator'),
        ltr: ['3px', '11px', '12px', '3px'],
    },
    {
        name: 'hmi-textarea',
        template: html`<hmi-textarea label="Notes"></hmi-textarea>`,
        node: (el) => el.shadowRoot?.querySelector('.control'),
        ltr: LEAF,
    },
    {
        name: 'hmi-toast',
        template: html`<hmi-toast></hmi-toast>`,
        setup: () => {
            toast.show({ variant: 'info', title: 'Saved', duration: 0 });
        },
        node: (el) => el.shadowRoot?.querySelector('.toast'),
        ltr: LEAF,
    },
];

/** Right-to-left's corners for a shape mirrored from left-to-right's. */
function mirror([tl, tr, br, bl]: Radii): Radii {
    return [tr, tl, bl, br];
}

function radii(node: Element): Radii {
    const style = getComputedStyle(node);
    return [
        style.borderTopLeftRadius,
        style.borderTopRightRadius,
        style.borderBottomRightRadius,
        style.borderBottomLeftRadius,
    ];
}

async function paint(
    template: TemplateResult,
    dir: 'ltr' | 'rtl',
): Promise<HTMLElement> {
    const host = document.createElement('div');
    host.dir = dir;
    host.setAttribute('style', TOKENS);
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HTMLElement & {
        updateComplete: Promise<unknown>;
    };
    await el.updateComplete;
    // Children and measured parts, such as the tabs' indicator, settle a frame later.
    await new Promise((resolve) => requestAnimationFrame(resolve));
    for (const child of el.querySelectorAll('*')) {
        await (child as { updateComplete?: Promise<unknown> }).updateComplete;
    }
    return el;
}

afterEach(() => {
    resetToasts();
    document.body.replaceChildren();
});

describe('the corner tokens follow the text direction', () => {
    for (const { name, template, node, ltr, rtl, setup } of cases) {
        it(name, async () => {
            setup?.();
            const left = node(await paint(template, 'ltr'));
            expect(left, `${name}: no node paints the corners`).toBeTruthy();
            expect(radii(left as Element), 'left to right').toEqual(ltr);
            document.body.replaceChildren();

            const right = node(await paint(template, 'rtl'));
            expect(right, `${name}: no node paints the corners`).toBeTruthy();
            expect(radii(right as Element), 'right to left').toEqual(
                rtl ?? mirror(ltr),
            );
        });
    }
});
