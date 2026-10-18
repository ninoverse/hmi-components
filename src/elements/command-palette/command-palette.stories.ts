import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../button/button.js';
import './command-palette.js';
import type {
    CommandPaletteActionDetail,
    CommandPaletteCommand,
    HmiCommandPalette,
} from './command-palette.js';

type Args = Pick<
    HmiCommandPalette,
    'commands' | 'filter' | 'placeholder' | 'emptyMessage' | 'label'
>;

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

// The palette is controlled: a story opens it from a button and closes it from
// `hmi-close`. Closed by default, so the autodocs page, which mounts every story
// at once, does not stack scrims.
const open = (event: Event) => {
    const palette = (event.currentTarget as HTMLElement)
        .nextElementSibling as HmiCommandPalette;
    palette.open = true;
};
const close = (event: Event) => {
    (event.currentTarget as HmiCommandPalette).open = false;
};
const log = (event: Event) =>
    console.log(
        'hmi-action',
        (event as CustomEvent<CommandPaletteActionDetail>).detail,
    );

const meta = {
    title: 'Components/Overlays/CommandPalette',
    component: 'hmi-command-palette',
    tags: ['autodocs'],
    args: {
        commands: COMMANDS,
        filter: 'includes',
        placeholder: 'Type a command or search…',
        emptyMessage: 'No matches',
        label: 'Command palette',
    },
    argTypes: {
        commands: { control: 'object' },
        filter: { control: 'inline-radio', options: ['includes', 'none'] },
        placeholder: { control: 'text' },
        emptyMessage: { control: 'text' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-button @click=${open}>Open command palette</hmi-button>
            <hmi-command-palette
                filter=${args.filter as string}
                placeholder=${args.placeholder}
                empty-message=${args.emptyMessage}
                label=${args.label}
                .commands=${args.commands}
                @hmi-action=${log}
                @hmi-close=${close}
            ></hmi-command-palette>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { CommandPalette } from '@ninoverse/hmi-components/react/command-palette'` — `<CommandPalette open={open} commands={commands} onAction={(e) => run(e.detail.value)} onClose={() => setOpen(false)} />`. The palette is controlled: it never closes itself, so set `open` to `false` from `hmi-close`, which also fires after a command is chosen (`reason` is `select`).",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** `empty-message` replaces the default "No matches"; the `empty` slot takes richer content. */
export const CustomEmptyMessage: Story = {
    args: {
        emptyMessage: 'Nothing matches: try a shorter query.',
        placeholder: 'Search commands…',
    },
};

/** An icon, a shortcut, a label and a description can each be a slotted element named for the command's `value`. */
export const RichCommands: Story = {
    render: (args) =>
        html`<hmi-button @click=${open}>Open command palette</hmi-button>
            <hmi-command-palette
                .commands=${args.commands}
                @hmi-action=${log}
                @hmi-close=${close}
            >
                <svg slot="icon-new-doc" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 2h5l3 3v9H4z" /><path d="M9 2v3h3" /></svg>
                <svg slot="icon-go-settings" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="2.5" /><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2" /></svg>
                <b slot="label-export-pdf">Export as <i>PDF</i></b>
                <kbd slot="shortcut-new-doc">⌘N</kbd>
            </hmi-command-palette>`,
};

/** `filter="none"` leaves the filtering to the page: set `commands` from `hmi-input`. */
export const PageFiltered: Story = {
    args: { filter: 'none' },
    render: (args) =>
        html`<hmi-button @click=${open}>Open command palette</hmi-button>
            <hmi-command-palette
                filter="none"
                .commands=${args.commands}
                @hmi-input=${(event: CustomEvent<{ value: string }>) => {
                    const palette = event.currentTarget as HmiCommandPalette;
                    const text = event.detail.value.toLowerCase();
                    palette.commands = COMMANDS.filter((command) =>
                        command.label.toLowerCase().startsWith(text),
                    );
                }}
                @hmi-action=${log}
                @hmi-close=${close}
            ></hmi-command-palette>`,
};
