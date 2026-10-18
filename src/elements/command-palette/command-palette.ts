import { html, isServer, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { baseStyles } from '../shared/base.styles.js';
import { type DialogCloseReason, HmiDialogBase } from '../shared/dialog.js';
import { toggleEmpty } from '../shared/dom.js';
import { emit } from '../shared/events.js';
import { styles } from './command-palette.styles.js';

/** One command of the palette. */
export interface CommandPaletteCommand {
    /** The command's id: what `hmi-action` reports when it is chosen, and the key of its slots. */
    value: string;
    /** The command's text, shown and matched while searching. Plain text, or the fallback of the `label-<value>` slot. */
    label: string;
    /** A second line, also matched while searching. Plain text, or the fallback of the `description-<value>` slot. */
    description?: string;
    /** A trailing hint such as a keyboard shortcut. Plain text, or the fallback of the `shortcut-<value>` slot. */
    shortcut?: string;
    /** The heading the command is listed under. */
    group?: string;
    /** Extra terms matched while searching, beyond the label and the description. */
    keywords?: readonly string[];
}

/** A predicate that says whether a command matches what was typed. */
export type CommandPaletteFilterFn = (
    command: CommandPaletteCommand,
    query: string,
) => boolean;

/** How the typed text filters the commands. */
export type CommandPaletteFilter = 'includes' | 'none' | CommandPaletteFilterFn;

/** Why the palette asks to be closed: the user pressed Escape, pressed outside it, or chose a command. */
export type CommandPaletteCloseReason = DialogCloseReason | 'select';

/** Detail of `hmi-close`. */
export interface CommandPaletteCloseDetail {
    reason: CommandPaletteCloseReason;
}

/** Detail of `hmi-action`: the `value` of the command that was chosen. */
export interface CommandPaletteActionDetail {
    value: string;
}

/** Detail of `hmi-input`: the text now in the search field. */
export interface CommandPaletteInputDetail {
    value: string;
}

const searchIcon = html`<svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    aria-hidden="true"
>
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L13.5 13.5" />
</svg>`;

interface Run {
    group: string | undefined;
    items: { command: CommandPaletteCommand; index: number }[];
}

/**
 * Command palette: a search field over a list of commands, in a modal dialog. It
 * is a native `<dialog>` opened with `showModal()`, so the page behind it is inert
 * and focus is trapped inside; the page also stops scrolling while it is open, and
 * focus goes back to what had it when it closes.
 *
 * The palette is controlled, as modal and drawer are: it never closes itself. A
 * press on Escape, a press outside it and choosing a command fire the cancelable
 * `hmi-close` with the `reason` (`escape`, `backdrop` or `select`); set `open` to
 * `false` from the listener to close it. Choosing a command fires `hmi-action`
 * with its `value`, and then `hmi-close`.
 *
 * `commands` is a property: `{ value, label, description?, shortcut?, group?,
 * keywords? }`. Their text is plain; for richer content slot an element named
 * `label-<value>`, `description-<value>`, `shortcut-<value>` or, for a leading
 * icon, `icon-<value>`. A command with a `group` is listed under its heading, which
 * repeats when the group changes between consecutive commands, and the group is a
 * `group` of the list named by it.
 *
 * Opening clears the search text and highlights the first command, and focus goes
 * to the field. The field is a combobox: typing filters the commands, ArrowDown
 * and ArrowUp move the highlight (it stops at the first and the last), Home and
 * End jump to them, Enter chooses the highlighted one (not while an input method
 * is composing), and the pointer highlights what it is over and chooses on a
 * press. The highlighted command is the active descendant and `aria-selected`, and
 * is scrolled into view.
 *
 * `query` is the text in the field: it fires `hmi-input` per keystroke, and setting
 * it from code sets the text without firing. `filter` is `includes` (the default:
 * the label, the description or a keyword contains the text, ignoring case), `none`
 * (the page filters, and sets `commands` in response to `hmi-input`) or, as a
 * property, a function of the command and the trimmed text. The palette is named by
 * `label`.
 *
 * @tag hmi-command-palette
 * @slot empty - Shown when no command matches. Defaults to `empty-message`.
 * @slot label-<value> - Rich label for the command with that value.
 * @slot description-<value> - Rich second line for the command with that value.
 * @slot icon-<value> - Leading icon for the command with that value.
 * @slot shortcut-<value> - Trailing hint for the command with that value.
 * @fires {CustomEvent<CommandPaletteCloseDetail>} hmi-close - Escape, a press outside the palette, or a chosen command. Cancelable, but the palette does not close itself either way: set `open` to `false`.
 * @fires {CustomEvent<CommandPaletteActionDetail>} hmi-action - A command was chosen: the pointer pressed it, or Enter chose the highlighted one.
 * @fires {CustomEvent<CommandPaletteInputDetail>} hmi-input - The user changed the text in the search field.
 * @csspart base - The `<dialog>`.
 * @csspart panel - The `<dialog>`, under its panel-group name.
 * @csspart searchbox - The row of the search icon and the field.
 * @csspart search-icon - The magnifier.
 * @csspart input - The search field.
 * @csspart list - The scrolling list of commands.
 * @csspart group - A group's heading.
 * @csspart option - One command's row. `data-highlighted` marks the highlighted one.
 * @csspart option-icon - A command's leading icon.
 * @csspart option-text - The label and the description of a command.
 * @csspart option-label - A command's label.
 * @csspart option-description - A command's second line.
 * @csspart shortcut - A command's trailing hint.
 * @csspart empty - The message shown when no command matches.
 *
 * @example
 * const palette = document.querySelector('hmi-command-palette');
 * palette.commands = [{ value: 'new-doc', label: 'New document', group: 'Create' }];
 * palette.addEventListener('hmi-action', (e) => run(e.detail.value));
 * palette.addEventListener('hmi-close', () => (palette.open = false));
 */
@customElement('hmi-command-palette')
export class HmiCommandPalette extends HmiDialogBase {
    static override styles = [baseStyles, styles];

    /** The commands, in order. Set it as a property. @default [] */
    @property({ type: Array, attribute: false })
    accessor commands: readonly CommandPaletteCommand[] = [];

    /** The text in the search field. It is cleared each time the palette opens. @default '' */
    @property() accessor query = '';

    /** How the text filters the commands: `includes`, `none` or, as a property, a function of the command and the text. @default 'includes' */
    @property() accessor filter: CommandPaletteFilter = 'includes';

    /** Search field placeholder. @default 'Type a command or search…' */
    @property() accessor placeholder = 'Type a command or search…';

    /** Text shown when no command matches, or the `empty` slot. @default 'No matches' */
    @property({ attribute: 'empty-message' }) accessor emptyMessage =
        'No matches';

    /** The accessible name of the dialog. @default 'Command palette' */
    @property() accessor label = 'Command palette';

    // The highlighted position in the listed commands.
    @state() private accessor highlight = 0;

    override willUpdate(changed: PropertyValues): void {
        // Opening starts a new search; a palette that is open from the start keeps
        // the text it was given.
        if (this.hasUpdated && changed.has('open') && this.open) {
            this.query = '';
            this.highlight = 0;
        } else if (changed.has('query')) {
            this.highlight = 0;
        }
        super.willUpdate(changed);
    }

    protected override updated(changed: PropertyValues): void {
        super.updated(changed);
        if (isServer) return;
        if (this.open && (changed.has('open') || changed.has('highlight'))) {
            this.renderRoot
                .querySelector(`#option-${this.#active(this.#listed())}`)
                ?.scrollIntoView({ block: 'nearest' });
        }
    }

    // The commands the text leaves in the list.
    #listed(): readonly CommandPaletteCommand[] {
        const filter = this.filter;
        const text = this.query.trim();
        if (!text || filter === 'none') return this.commands;
        if (typeof filter === 'function') {
            return this.commands.filter((command) => filter(command, text));
        }
        const needle = text.toLowerCase();
        return this.commands.filter(
            (command) =>
                command.label.toLowerCase().includes(needle) ||
                command.description?.toLowerCase().includes(needle) ||
                command.keywords?.some((keyword) =>
                    keyword.toLowerCase().includes(needle),
                ),
        );
    }

    // The highlighted position: the one the user moved to, kept inside the list,
    // or -1 when nothing is listed.
    #active(listed: readonly CommandPaletteCommand[]): number {
        if (listed.length === 0) return -1;
        return this.highlight >= 0 && this.highlight < listed.length
            ? this.highlight
            : 0;
    }

    // The command is told to the consumer, and then the palette asks to close.
    #commit(command: CommandPaletteCommand): void {
        emit<CommandPaletteActionDetail>(this, 'hmi-action', {
            value: command.value,
        });
        this.requestClose('select');
    }

    #onInput(event: Event): void {
        this.query = (event.target as HTMLInputElement).value;
        emit<CommandPaletteInputDetail>(this, 'hmi-input', {
            value: this.query,
        });
    }

    #onKeydown(event: KeyboardEvent): void {
        const listed = this.#listed();
        const active = this.#active(listed);
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.highlight = Math.min(listed.length - 1, active + 1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.highlight = Math.max(0, active - 1);
                break;
            case 'Home':
                event.preventDefault();
                this.highlight = 0;
                break;
            case 'End':
                event.preventDefault();
                this.highlight = listed.length - 1;
                break;
            case 'Enter': {
                const command = listed[active];
                // Enter that ends an input method's composition is not a choice.
                if (!command || event.isComposing) return;
                event.preventDefault();
                this.#commit(command);
                break;
            }
        }
    }

    // The listed commands as runs of consecutive commands of one group.
    #runs(listed: readonly CommandPaletteCommand[]): Run[] {
        const runs: Run[] = [];
        listed.forEach((command, index) => {
            const group = command.group || undefined;
            const last = runs.at(-1);
            if (last && last.group === group) {
                last.items.push({ command, index });
            } else {
                runs.push({ group, items: [{ command, index }] });
            }
        });
        return runs;
    }

    #renderOption(
        command: CommandPaletteCommand,
        index: number,
        active: number,
    ) {
        const highlighted = index === active;
        return html`<div
            id=${`option-${index}`}
            part="option"
            class="option"
            role="option"
            aria-selected=${highlighted ? 'true' : 'false'}
            data-highlighted=${highlighted ? 'true' : 'false'}
            @mouseenter=${() => {
                this.highlight = index;
            }}
            @mousedown=${(event: MouseEvent) => {
                // The field keeps focus: a press is a choice, not a blur.
                event.preventDefault();
                this.#commit(command);
            }}
        >
            <span part="option-icon" class="option-icon" hidden
                ><slot
                    name=${`icon-${command.value}`}
                    @slotchange=${(e: Event) => toggleEmpty(e, false)}
                ></slot
            ></span>
            <span part="option-text" class="option-text">
                <span part="option-label" class="option-label"
                    ><slot name=${`label-${command.value}`}
                        >${command.label}</slot
                    ></span
                >
                <span
                    part="option-description"
                    class="option-description"
                    ?hidden=${!command.description}
                    ><slot
                        name=${`description-${command.value}`}
                        @slotchange=${(e: Event) =>
                            toggleEmpty(e, !!command.description)}
                        >${command.description}</slot
                    ></span
                >
            </span>
            <span part="shortcut" class="shortcut" ?hidden=${!command.shortcut}
                ><slot
                    name=${`shortcut-${command.value}`}
                    @slotchange=${(e: Event) =>
                        toggleEmpty(e, !!command.shortcut)}
                    >${command.shortcut}</slot
                ></span
            >
        </div>`;
    }

    override render() {
        const listed = this.#listed();
        const active = this.#active(listed);
        return this.renderDialog(
            html`<div part="searchbox" class="searchbox">
                    <span part="search-icon" class="search-icon"
                        >${searchIcon}</span
                    >
                    <input
                        part="input"
                        class="input"
                        type="text"
                        role="combobox"
                        aria-expanded="true"
                        aria-autocomplete="list"
                        aria-controls="list"
                        aria-activedescendant=${ifDefined(
                            active >= 0 ? `option-${active}` : undefined,
                        )}
                        placeholder=${this.placeholder}
                        autocomplete="off"
                        spellcheck="false"
                        autofocus
                        value=${this.query}
                        .value=${live(this.query)}
                        @input=${this.#onInput}
                        @keydown=${this.#onKeydown}
                    />
                </div>
                <div
                    id="list"
                    part="list"
                    class="list"
                    role="listbox"
                    aria-label=${this.label || nothing}
                >
                    ${
                        listed.length === 0
                            ? html`<div part="empty" class="empty">
                                  <slot name="empty">${this.emptyMessage}</slot>
                              </div>`
                            : this.#runs(listed).map((run, n) =>
                                  run.group === undefined
                                      ? run.items.map(({ command, index }) =>
                                            this.#renderOption(
                                                command,
                                                index,
                                                active,
                                            ),
                                        )
                                      : html`<div
                                            role="group"
                                            aria-labelledby=${`group-${n}`}
                                        >
                                            <div
                                                id=${`group-${n}`}
                                                part="group"
                                                class="group"
                                            >
                                                ${run.group}
                                            </div>
                                            ${run.items.map(
                                                ({ command, index }) =>
                                                    this.#renderOption(
                                                        command,
                                                        index,
                                                        active,
                                                    ),
                                            )}
                                        </div>`,
                              )
                    }
                </div>`,
            { label: this.label },
        );
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-command-palette': HmiCommandPalette;
    }
}
