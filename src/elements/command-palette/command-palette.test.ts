import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { activeElementDeep } from '../shared/dom.js';
import './command-palette.js';
import type {
    CommandPaletteActionDetail,
    CommandPaletteCloseDetail,
    CommandPaletteCommand,
    CommandPaletteInputDetail,
    HmiCommandPalette,
} from './command-palette.js';
import { CommandPalette } from './command-palette.react.js';

const COMMANDS: CommandPaletteCommand[] = [
    {
        value: 'new-doc',
        label: 'New document',
        description: 'Start a blank page',
        group: 'Create',
        keywords: ['create', 'blank'],
    },
    {
        value: 'new-folder',
        label: 'New folder',
        group: 'Create',
        keywords: ['directory'],
    },
    {
        value: 'open-recent',
        label: 'Open recent',
        description: 'Browse the last 20 files',
        group: 'Navigation',
    },
    {
        value: 'go-settings',
        label: 'Go to settings',
        group: 'Navigation',
        shortcut: '⌘,',
    },
    { value: 'export-pdf', label: 'Export as PDF', group: 'Share' },
];

async function fixture(template: ReturnType<typeof html>) {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.querySelector('hmi-command-palette') as HmiCommandPalette;
    await el.updateComplete;
    // Give the slots' `slotchange` a turn, and the render it causes.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
    return el;
}

// The attributes are parsed from text, as a page's markup would give them.
async function palette(attrs = '') {
    const host = document.createElement('div');
    host.innerHTML = `<button id="trigger">Open</button>
        <hmi-command-palette ${attrs}></hmi-command-palette>`;
    document.body.append(host);
    const el = host.querySelector('hmi-command-palette') as HmiCommandPalette;
    el.commands = COMMANDS;
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
    return el;
}

const dialog = (el: HmiCommandPalette) =>
    el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
const part = (el: HmiCommandPalette, name: string) =>
    el.shadowRoot?.querySelector<HTMLElement>(`[part~="${name}"]`);
const parts = (el: HmiCommandPalette, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`) ?? [],
    );
const input = (el: HmiCommandPalette) => part(el, 'input') as HTMLInputElement;
const options = (el: HmiCommandPalette) => parts(el, 'option');
const text = (node: Element | null | undefined) => node?.textContent?.trim();
const labels = (el: HmiCommandPalette) =>
    options(el).map((option) =>
        text(option.querySelector('[part~="option-label"]')),
    );
const highlighted = (el: HmiCommandPalette) =>
    options(el).findIndex((option) => option.dataset.highlighted === 'true');
const listen = <T>(el: HmiCommandPalette, type: string) => {
    const events: CustomEvent<T>[] = [];
    el.addEventListener(type, (e) => events.push(e as CustomEvent<T>));
    return events;
};
/** Every hmi-action, hmi-close and hmi-input, in order, as `type detail`. */
const log = (el: HmiCommandPalette) => {
    const events: string[] = [];
    for (const type of ['hmi-action', 'hmi-close', 'hmi-input']) {
        el.addEventListener(type, (e) =>
            events.push(
                `${type} ${JSON.stringify((e as CustomEvent<object>).detail)}`,
            ),
        );
    }
    return events;
};

/** Opens the palette from code, as a consumer does, and lets it render. */
async function open(el: HmiCommandPalette) {
    el.open = true;
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
}

beforeEach(async () => {
    await page.viewport(1000, 800);
});

// The real pointer stays where a test left it: park it in a corner.
afterEach(async () => {
    document.body.replaceChildren();
    document.documentElement.style.overflow = '';
    const park = document.createElement('div');
    park.style.cssText =
        'position: fixed; right: 0; bottom: 0; width: 40px; height: 40px';
    document.body.append(park);
    await userEvent.hover(park);
    park.remove();
});

describe('hmi-command-palette', () => {
    it('registers', () => {
        expect(customElements.get('hmi-command-palette')).toBeDefined();
    });

    describe('the dialog', () => {
        it('is closed by default, and opens as a modal dialog from open', async () => {
            const el = await palette();
            expect(dialog(el).open).toBe(false);
            expect(getComputedStyle(dialog(el)).display).toBe('none');
            await open(el);
            expect(dialog(el).open).toBe(true);
            expect(dialog(el).matches(':modal')).toBe(true);
            expect(getComputedStyle(dialog(el)).display).toBe('flex');
            el.open = false;
            await el.updateComplete;
            expect(el.hasAttribute('open')).toBe(false);
            expect(dialog(el).open).toBe(false);
        });

        it('reflects open, from the attribute too', async () => {
            const el = await palette('open');
            expect(el.open).toBe(true);
            expect(dialog(el).open).toBe(true);
        });

        it('exposes the dialog as base and panel, painted from the palette surface token', async () => {
            const el = await fixture(
                html`<hmi-command-palette
                    open
                    style="--palette-bg: rgb(1, 2, 3); --on-background: rgb(4, 5, 6)"
                ></hmi-command-palette>`,
            );
            expect(part(el, 'base')).toBe(dialog(el));
            expect(part(el, 'panel')).toBe(dialog(el));
            const style = getComputedStyle(dialog(el));
            expect(style.backgroundColor).toBe('rgb(1, 2, 3)');
            expect(style.color).toBe('rgb(4, 5, 6)');
        });

        it('paints the scrim from the scrim token', async () => {
            const el = await fixture(
                html`<hmi-command-palette
                    open
                    style="--scrim: rgb(7, 8, 9)"
                ></hmi-command-palette>`,
            );
            expect(
                getComputedStyle(dialog(el), '::backdrop').backgroundColor,
            ).toBe('rgb(7, 8, 9)');
        });

        it('sits 12% from the top, centred, 72 base units wide', async () => {
            const el = await palette('open');
            const box = dialog(el).getBoundingClientRect();
            expect(box.width).toBe(576);
            expect(box.top).toBeCloseTo(96, 0);
            expect(box.left).toBeCloseTo((1000 - 576) / 2, 0);
        });

        it('is no wider than 92% of a narrow screen', async () => {
            await page.viewport(400, 800);
            const el = await palette('open');
            expect(dialog(el).getBoundingClientRect().width).toBeCloseTo(
                368,
                0,
            );
        });

        it('is named by label, Command palette by default', async () => {
            const el = await palette('open');
            expect(dialog(el).getAttribute('aria-label')).toBe(
                'Command palette',
            );
            expect(part(el, 'list')?.getAttribute('aria-label')).toBe(
                'Command palette',
            );
            el.label = 'Jump to';
            await el.updateComplete;
            expect(dialog(el).getAttribute('aria-label')).toBe('Jump to');
        });

        it('stops the page scrolling while open, and gives focus back on close', async () => {
            const el = await palette();
            const trigger = document.getElementById(
                'trigger',
            ) as HTMLButtonElement;
            trigger.focus();
            await open(el);
            expect(document.documentElement.style.overflow).toBe('hidden');
            el.open = false;
            await el.updateComplete;
            expect(document.documentElement.style.overflow).toBe('');
            expect(activeElementDeep(document)).toBe(trigger);
        });

        it('gives focus to the search field when it opens', async () => {
            const el = await palette();
            await open(el);
            expect(activeElementDeep(document)).toBe(input(el));
        });
    });

    describe('the commands', () => {
        it('are listed in order, with a description, a shortcut and a group where they have one', async () => {
            const el = await palette('open');
            expect(labels(el)).toEqual([
                'New document',
                'New folder',
                'Open recent',
                'Go to settings',
                'Export as PDF',
            ]);
            expect(
                options(el).map((option) =>
                    text(option.querySelector('[part~="option-description"]')),
                ),
            ).toEqual([
                'Start a blank page',
                '',
                'Browse the last 20 files',
                '',
                '',
            ]);
            expect(
                options(el).map(
                    (option) =>
                        option.querySelector<HTMLElement>('[part~="shortcut"]')
                            ?.hidden,
                ),
            ).toEqual([true, true, true, false, true]);
            expect(text(parts(el, 'shortcut')[3])).toBe('⌘,');
        });

        it('are grouped under headings, each group a labelled group of the list', async () => {
            const el = await palette('open');
            expect(parts(el, 'group').map(text)).toEqual([
                'Create',
                'Navigation',
                'Share',
            ]);
            const groups = Array.from(
                el.shadowRoot?.querySelectorAll('[role="group"]') ?? [],
            );
            expect(groups).toHaveLength(3);
            for (const group of groups) {
                const heading = el.shadowRoot?.getElementById(
                    group.getAttribute('aria-labelledby') as string,
                );
                expect(heading).toBe(group.firstElementChild);
            }
            expect(groups[0]?.querySelectorAll('[role="option"]')).toHaveLength(
                2,
            );
        });

        it('repeat a heading when its group changes between consecutive commands, and list ungrouped ones outside any group', async () => {
            const el = await fixture(
                html`<hmi-command-palette
                    open
                    .commands=${[
                        { value: 'a', label: 'A', group: 'One' },
                        { value: 'b', label: 'B' },
                        { value: 'c', label: 'C', group: 'One' },
                    ]}
                ></hmi-command-palette>`,
            );
            expect(parts(el, 'group').map(text)).toEqual(['One', 'One']);
            const loose = el.shadowRoot?.querySelector(
                '[part="list"] > [role="option"]',
            );
            expect(text(loose)).toBe('B');
        });

        it('are options of a listbox', async () => {
            const el = await palette('open');
            const list = part(el, 'list') as HTMLElement;
            expect(list.getAttribute('role')).toBe('listbox');
            for (const option of options(el)) {
                expect(option.getAttribute('role')).toBe('option');
            }
        });

        it('take label, description, icon and shortcut slots named for their value', async () => {
            const el = await fixture(
                html`<hmi-command-palette
                    open
                    .commands=${[
                        { value: 'one', label: 'One' },
                        { value: 'two', label: 'Two', description: 'Plain' },
                    ]}
                >
                    <svg slot="icon-one" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5" /></svg>
                    <b slot="label-one">Rich one</b>
                    <i slot="description-one">Second line</i>
                    <kbd slot="shortcut-one">⌘1</kbd>
                </hmi-command-palette>`,
            );
            const [one, two] = options(el) as [HTMLElement, HTMLElement];
            const slotted = (option: HTMLElement, name: string) =>
                option
                    .querySelector<HTMLSlotElement>(`slot[name="${name}"]`)
                    ?.assignedElements()
                    .map((node) => node.tagName);
            expect(slotted(one, 'icon-one')).toEqual(['svg']);
            expect(slotted(one, 'label-one')).toEqual(['B']);
            expect(slotted(one, 'description-one')).toEqual(['I']);
            expect(slotted(one, 'shortcut-one')).toEqual(['KBD']);
            expect(
                one.querySelector<HTMLElement>('[part~="option-icon"]')?.hidden,
            ).toBe(false);
            expect(
                one.querySelector<HTMLElement>('[part~="option-description"]')
                    ?.hidden,
            ).toBe(false);
            expect(
                one.querySelector<HTMLElement>('[part~="shortcut"]')?.hidden,
            ).toBe(false);
            // Without slotted content the icon box is hidden, and the strings stay.
            expect(
                two.querySelector<HTMLElement>('[part~="option-icon"]')?.hidden,
            ).toBe(true);
            expect(text(two.querySelector('[part~="option-label"]'))).toBe(
                'Two',
            );
            expect(
                text(two.querySelector('[part~="option-description"]')),
            ).toBe('Plain');
        });

        it('are none when the list is empty, and the no-match message shows', async () => {
            const el = await fixture(
                html`<hmi-command-palette open></hmi-command-palette>`,
            );
            expect(options(el)).toHaveLength(0);
            expect(text(part(el, 'empty'))).toBe('No matches');
        });
    });

    describe('the search field', () => {
        it('is a combobox over the listbox, with the first command as the active descendant', async () => {
            const el = await palette('open');
            const field = input(el);
            expect(field.getAttribute('role')).toBe('combobox');
            expect(field.getAttribute('aria-expanded')).toBe('true');
            expect(field.getAttribute('aria-autocomplete')).toBe('list');
            const list = part(el, 'list') as HTMLElement;
            expect(field.getAttribute('aria-controls')).toBe(list.id);
            expect(field.getAttribute('aria-activedescendant')).toBe(
                (options(el)[0] as HTMLElement).id,
            );
            expect(field.getAttribute('autocomplete')).toBe('off');
            expect(field.getAttribute('spellcheck')).toBe('false');
            expect(field.type).toBe('text');
        });

        it('shows a placeholder, and takes another', async () => {
            const el = await palette('open');
            expect(input(el).placeholder).toBe('Type a command or search…');
            el.placeholder = 'Search commands…';
            await el.updateComplete;
            expect(input(el).placeholder).toBe('Search commands…');
        });

        it('fires hmi-input for each keystroke, with the text, and filters', async () => {
            const el = await palette('open');
            const events = listen<CommandPaletteInputDetail>(el, 'hmi-input');
            await userEvent.keyboard('fol');
            await el.updateComplete;
            expect(events.map((e) => e.detail)).toEqual([
                { value: 'f' },
                { value: 'fo' },
                { value: 'fol' },
            ]);
            expect(events[0]?.bubbles).toBe(true);
            expect(events[0]?.composed).toBe(true);
            expect(el.query).toBe('fol');
            expect(labels(el)).toEqual(['New folder']);
        });

        it('matches the label, the description and the keywords, ignoring case and surrounding space', async () => {
            const el = await palette('open');
            const type = async (value: string) => {
                el.query = value;
                await el.updateComplete;
                return labels(el);
            };
            expect(await type('DOC')).toEqual(['New document']);
            expect(await type('blank')).toEqual(['New document']);
            expect(await type('20 FILES')).toEqual(['Open recent']);
            expect(await type('directory')).toEqual(['New folder']);
            expect(await type('  settings  ')).toEqual(['Go to settings']);
            expect(await type('zzz')).toEqual([]);
            expect(await type('')).toHaveLength(5);
        });

        it('shows the no-match message, from empty-message or the empty slot', async () => {
            const el = await palette('open empty-message="Nothing here"');
            el.query = 'zzz';
            await el.updateComplete;
            expect(text(part(el, 'empty'))).toBe('Nothing here');
            const slotted = await fixture(
                html`<hmi-command-palette open query="zzz" .commands=${COMMANDS}>
                    <b slot="empty">Try again</b>
                </hmi-command-palette>`,
            );
            const slot = part(slotted, 'empty')?.querySelector('slot');
            expect(slot?.assignedElements().map((n) => n.tagName)).toEqual([
                'B',
            ]);
        });

        it('leaves the filtering to the page with filter="none"', async () => {
            const el = await palette('open filter="none"');
            el.query = 'zzz';
            await el.updateComplete;
            expect(options(el)).toHaveLength(5);
        });

        it('takes a function as filter, with the trimmed text', async () => {
            const el = await palette('open');
            const predicate = vi.fn(
                (command: CommandPaletteCommand, query: string) =>
                    command.label.toLowerCase().startsWith(query.toLowerCase()),
            );
            el.filter = predicate;
            el.query = '  go ';
            await el.updateComplete;
            expect(labels(el)).toEqual(['Go to settings']);
            expect(predicate).toHaveBeenCalledWith(COMMANDS[3], 'go');
        });

        it('sets the text from code without firing hmi-input', async () => {
            const el = await palette('open');
            const events = listen(el, 'hmi-input');
            el.query = 'folder';
            await el.updateComplete;
            expect(input(el).value).toBe('folder');
            expect(events).toHaveLength(0);
            expect(labels(el)).toEqual(['New folder']);
        });

        it('starts a new search each time it opens, and highlights the first command', async () => {
            const el = await palette('open');
            await userEvent.keyboard('o');
            await userEvent.keyboard('{ArrowDown}');
            expect(el.query).toBe('o');
            el.open = false;
            await el.updateComplete;
            const events = listen(el, 'hmi-input');
            await open(el);
            expect(el.query).toBe('');
            expect(input(el).value).toBe('');
            expect(options(el)).toHaveLength(5);
            expect(highlighted(el)).toBe(0);
            expect(events).toHaveLength(0);
        });

        it('keeps the text it was given when it is open from the start', async () => {
            const el = await palette('open query="fol"');
            expect(el.query).toBe('fol');
            expect(labels(el)).toEqual(['New folder']);
        });

        it('highlights the first command again when the text changes', async () => {
            const el = await palette('open');
            await userEvent.keyboard('{ArrowDown}{ArrowDown}');
            expect(highlighted(el)).toBe(2);
            await userEvent.keyboard('o');
            await el.updateComplete;
            expect(highlighted(el)).toBe(0);
        });
    });

    describe('the highlight', () => {
        it('marks one command with data-highlighted and aria-selected, and the field points at it', async () => {
            const el = await palette('open');
            await userEvent.keyboard('{ArrowDown}');
            await el.updateComplete;
            const marked = options(el).filter(
                (option) => option.getAttribute('aria-selected') === 'true',
            );
            expect(marked).toHaveLength(1);
            expect(marked[0]).toBe(options(el)[1]);
            expect(marked[0]?.dataset.highlighted).toBe('true');
            expect(input(el).getAttribute('aria-activedescendant')).toBe(
                (options(el)[1] as HTMLElement).id,
            );
        });

        it('moves with the arrow keys, and stops at the first and the last command', async () => {
            const el = await palette('open');
            await userEvent.keyboard('{ArrowUp}');
            await el.updateComplete;
            expect(highlighted(el)).toBe(0);
            await userEvent.keyboard('{ArrowDown}{ArrowDown}');
            await el.updateComplete;
            expect(highlighted(el)).toBe(2);
            await userEvent.keyboard(
                '{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}',
            );
            await el.updateComplete;
            expect(highlighted(el)).toBe(4);
            await userEvent.keyboard('{ArrowUp}');
            await el.updateComplete;
            expect(highlighted(el)).toBe(3);
        });

        it('jumps to the first and the last command with Home and End', async () => {
            const el = await palette('open');
            await userEvent.keyboard('{End}');
            await el.updateComplete;
            expect(highlighted(el)).toBe(4);
            await userEvent.keyboard('{Home}');
            await el.updateComplete;
            expect(highlighted(el)).toBe(0);
        });

        it('follows the pointer', async () => {
            const el = await palette('open');
            await userEvent.hover(options(el)[3] as HTMLElement);
            await el.updateComplete;
            expect(highlighted(el)).toBe(3);
        });

        it('is nothing when no command is listed', async () => {
            const el = await palette('open');
            el.query = 'zzz';
            await el.updateComplete;
            expect(input(el).hasAttribute('aria-activedescendant')).toBe(false);
            await userEvent.keyboard('{ArrowDown}{End}');
            await el.updateComplete;
            expect(highlighted(el)).toBe(-1);
        });

        it('is scrolled into view', async () => {
            const many = Array.from({ length: 40 }, (_, n) => ({
                value: `c${n}`,
                label: `Command ${n}`,
            }));
            const el = await fixture(
                html`<hmi-command-palette
                    open
                    .commands=${many}
                ></hmi-command-palette>`,
            );
            await userEvent.keyboard('{End}');
            await el.updateComplete;
            const list = part(el, 'list') as HTMLElement;
            const row = options(el)[39] as HTMLElement;
            expect(list.scrollTop).toBeGreaterThan(0);
            expect(row.getBoundingClientRect().bottom).toBeLessThanOrEqual(
                list.getBoundingClientRect().bottom + 1,
            );
            await userEvent.keyboard('{Home}');
            await el.updateComplete;
            expect(list.scrollTop).toBe(0);
        });
    });

    describe('choosing a command', () => {
        it('on Enter: hmi-action with the value, then hmi-close with select, and it stays open', async () => {
            const el = await palette('open');
            const events = log(el);
            await userEvent.keyboard('{ArrowDown}{Enter}');
            expect(events).toEqual([
                'hmi-action {"value":"new-folder"}',
                'hmi-close {"reason":"select"}',
            ]);
            expect(el.open).toBe(true);
            expect(dialog(el).open).toBe(true);
        });

        it('chooses the highlighted command of a filtered list', async () => {
            const el = await palette('open');
            const events = log(el);
            await userEvent.keyboard('settings');
            await userEvent.keyboard('{Enter}');
            expect(events.at(-2)).toBe('hmi-action {"value":"go-settings"}');
        });

        it('on a press, without moving focus off the field', async () => {
            const el = await palette('open');
            const events = log(el);
            await userEvent.click(options(el)[2] as HTMLElement);
            expect(events).toEqual([
                'hmi-action {"value":"open-recent"}',
                'hmi-close {"reason":"select"}',
            ]);
            expect(activeElementDeep(document)).toBe(input(el));
        });

        it('dispatches events that bubble, cross the shadow root, and are cancelable for hmi-close', async () => {
            const el = await palette('open');
            const action = vi.fn();
            const close = vi.fn();
            document.addEventListener('hmi-action', action);
            document.addEventListener('hmi-close', close);
            await userEvent.keyboard('{Enter}');
            document.removeEventListener('hmi-action', action);
            document.removeEventListener('hmi-close', close);
            const actionEvent = action.mock
                .calls[0]?.[0] as CustomEvent<CommandPaletteActionDetail>;
            const closeEvent = close.mock
                .calls[0]?.[0] as CustomEvent<CommandPaletteCloseDetail>;
            expect(actionEvent.target).toBe(el);
            expect(actionEvent.bubbles).toBe(true);
            expect(actionEvent.composed).toBe(true);
            expect(closeEvent.target).toBe(el);
            expect(closeEvent.cancelable).toBe(true);
        });

        it('does nothing on Enter when no command is listed', async () => {
            const el = await palette('open');
            el.query = 'zzz';
            await el.updateComplete;
            const events = log(el);
            await userEvent.keyboard('{Enter}');
            expect(events).toEqual([]);
        });

        it('does nothing on the Enter that ends an input method’s composition', async () => {
            const el = await palette('open');
            const events = log(el);
            input(el).dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Enter',
                    isComposing: true,
                    bubbles: true,
                    composed: true,
                    cancelable: true,
                }),
            );
            expect(events).toEqual([]);
        });

        it('closes, unlocks the page and gives focus back when the listener sets open to false', async () => {
            const el = await palette();
            const trigger = document.getElementById(
                'trigger',
            ) as HTMLButtonElement;
            trigger.focus();
            await open(el);
            el.addEventListener('hmi-close', () => {
                el.open = false;
            });
            await userEvent.keyboard('{Enter}');
            await el.updateComplete;
            expect(el.open).toBe(false);
            expect(dialog(el).open).toBe(false);
            expect(document.documentElement.style.overflow).toBe('');
            expect(activeElementDeep(document)).toBe(trigger);
        });
    });

    describe('asking to close', () => {
        it('on Escape, and stays open until open is set to false', async () => {
            const el = await palette('open');
            const events = listen<CommandPaletteCloseDetail>(el, 'hmi-close');
            await userEvent.keyboard('{Escape}');
            expect(events.map((e) => e.detail)).toEqual([{ reason: 'escape' }]);
            expect(events[0]?.cancelable).toBe(true);
            expect(el.open).toBe(true);
            expect(dialog(el).open).toBe(true);
        });

        it('on a press outside the panel, through the scrim', async () => {
            const el = await palette('open');
            const events = listen<CommandPaletteCloseDetail>(el, 'hmi-close');
            // The panel is 576 wide, centred in 1000: x = 20 is on the scrim.
            dialog(el).dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    composed: true,
                    clientX: 20,
                    clientY: 400,
                }),
            );
            expect(events.map((e) => e.detail)).toEqual([
                { reason: 'backdrop' },
            ]);
        });

        it('not on a press inside the panel', async () => {
            const el = await palette('open');
            const events = listen<CommandPaletteCloseDetail>(el, 'hmi-close');
            dialog(el).dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    composed: true,
                    clientX: 500,
                    clientY: 200,
                }),
            );
            expect(events).toHaveLength(0);
        });
    });
});

describe('CommandPalette (React wrapper)', () => {
    it('mounts through the React wrapper, with its properties and events', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const onAction = vi.fn();
        const onClose = vi.fn();
        const onInput = vi.fn();
        await act(async () => {
            root.render(
                createElement(CommandPalette, {
                    open: true,
                    commands: COMMANDS,
                    placeholder: 'Search…',
                    onAction,
                    onClose,
                    onInput,
                }),
            );
        });
        const el = host.querySelector(
            'hmi-command-palette',
        ) as HmiCommandPalette;
        await el.updateComplete;
        expect(el.open).toBe(true);
        expect(el.commands).toBe(COMMANDS);
        expect(input(el).placeholder).toBe('Search…');
        await userEvent.keyboard('fol');
        await el.updateComplete;
        expect(onInput).toHaveBeenCalledTimes(3);
        expect(onInput.mock.calls[2]?.[0].detail).toEqual({ value: 'fol' });
        await userEvent.keyboard('{Enter}');
        expect(onAction).toHaveBeenCalledOnce();
        expect(onAction.mock.calls[0]?.[0].detail).toEqual({
            value: 'new-folder',
        });
        expect(onClose).toHaveBeenCalledOnce();
        expect(onClose.mock.calls[0]?.[0].detail).toEqual({ reason: 'select' });
        await act(async () => root.unmount());
    });
});
