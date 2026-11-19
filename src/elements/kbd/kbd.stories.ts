import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './kbd.js';
import type { HmiKbd } from './kbd.js';

type Args = Pick<HmiKbd, 'size' | 'label'>;

const sizes = ['small', 'medium'] as const;

const meta = {
    title: 'Components/Data display/Kbd',
    component: 'hmi-kbd',
    tags: ['autodocs'],
    args: { size: 'medium', label: 'Command' },
    argTypes: {
        size: { control: 'inline-radio', options: sizes },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-kbd size=${args.size} label=${args.label}>⌘</hmi-kbd>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Kbd } from \'@ninoverse/hmi-components/react/kbd\'` — `<kbd><Kbd label="Command">⌘</Kbd> + <Kbd>K</Kbd></kbd>`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Sizes: Story = {
    render: () => html`
        <div style="display: flex; gap: var(--space-12); align-items: center">
            ${sizes.map((size) => html`<hmi-kbd size=${size}>Ctrl</hmi-kbd>`)}
        </div>
    `,
};

/** Name a symbol key with `label`: screen readers hear the label, not the glyph. */
export const Label: Story = {
    render: (args) => html`
        <div style="display: flex; gap: var(--space-6); align-items: center">
            <hmi-kbd size=${args.size} label="Command">⌘</hmi-kbd>
            <hmi-kbd size=${args.size} label="Shift">⇧</hmi-kbd>
            <hmi-kbd size=${args.size} label="Option">⌥</hmi-kbd>
            <hmi-kbd size=${args.size} label="Enter">⏎</hmi-kbd>
        </div>
    `,
};

/** Combine caps to spell out a shortcut: a `<kbd>` around the keys marks up
    the combination, and `white-space: nowrap` keeps it on one line. */
export const Shortcut: Story = {
    render: (args) => html`
        <kbd style="white-space: nowrap; font-family: inherit">
            <hmi-kbd size=${args.size} label="Command">⌘</hmi-kbd> +
            <hmi-kbd size=${args.size} label="Shift">⇧</hmi-kbd> +
            <hmi-kbd size=${args.size}>P</hmi-kbd>
        </kbd>
    `,
};

/** Past its own size, the label follows the text around it. */
export const InText: Story = {
    render: () => html`
        <p style="margin: 0 0 var(--space-4)">
            Press <kbd style="white-space: nowrap; font-family: inherit"
                ><hmi-kbd>Ctrl</hmi-kbd> + <hmi-kbd>K</hmi-kbd></kbd
            > to open the command palette.
        </p>
        <h2 style="margin: 0">
            Search with <hmi-kbd label="Command">⌘</hmi-kbd>
            <hmi-kbd>K</hmi-kbd>
        </h2>
    `,
};

export const ArrowKeys: Story = {
    render: (args) => html`
        <div style="display: flex; gap: var(--space-6)">
            ${[
                ['←', 'Left'],
                ['↑', 'Up'],
                ['↓', 'Down'],
                ['→', 'Right'],
            ].map(
                ([key, label]) =>
                    html`<hmi-kbd size=${args.size} label=${label}>${key}</hmi-kbd>`,
            )}
        </div>
    `,
};
