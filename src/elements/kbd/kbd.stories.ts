import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './kbd.js';
import type { HmiKbd } from './kbd.js';

type Args = Pick<HmiKbd, 'size'>;

const sizes = ['small', 'medium'] as const;

const meta = {
    title: 'Components/Data display/Kbd',
    component: 'hmi-kbd',
    tags: ['autodocs'],
    args: { size: 'medium' },
    argTypes: {
        size: { control: 'inline-radio', options: sizes },
    },
    render: (args) => html`<hmi-kbd size=${args.size}>⌘</hmi-kbd>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { Kbd } from '@ninoverse/hmi-components/react/kbd'` — `<Kbd>⌘</Kbd> <Kbd>K</Kbd>`.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Sizes: Story = {
    render: () => html`
        <div style="display: flex; gap: 1.5rem; align-items: center">
            ${sizes.map((size) => html`<hmi-kbd size=${size}>Ctrl</hmi-kbd>`)}
        </div>
    `,
};

/** Combine caps to spell out a shortcut. */
export const Shortcut: Story = {
    render: (args) => html`
        <div style="display: flex; gap: 0.75rem; align-items: center">
            <hmi-kbd size=${args.size}>⌘</hmi-kbd>
            <span>+</span>
            <hmi-kbd size=${args.size}>⇧</hmi-kbd>
            <span>+</span>
            <hmi-kbd size=${args.size}>P</hmi-kbd>
        </div>
    `,
};

export const ArrowKeys: Story = {
    render: (args) => html`
        <div style="display: flex; gap: 0.75rem">
            ${['←', '↑', '↓', '→'].map(
                (key) => html`<hmi-kbd size=${args.size}>${key}</hmi-kbd>`,
            )}
        </div>
    `,
};
