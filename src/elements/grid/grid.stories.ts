import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './grid.js';
import type { HmiGrid } from './grid.js';

type Args = Pick<HmiGrid, 'columns' | 'gap'>;

const gaps = ['none', 'small', 'medium', 'large'] as const;

const cell = (label: string) =>
    html`<div
        style="background: var(--primary-container); color: var(--on-primary-container); padding: 1rem; border-radius: 0.5rem; text-align: center"
    >
        ${label}
    </div>`;

const meta = {
    title: 'Components/Layout/Grid',
    component: 'hmi-grid',
    tags: ['autodocs'],
    args: { columns: 3, gap: 'medium' },
    argTypes: {
        columns: { control: 'text' },
        gap: { control: 'inline-radio', options: gaps },
    },
    render: (args) =>
        html`<hmi-grid .columns=${args.columns} gap=${args.gap}>
            ${Array.from({ length: 6 }, (_, i) => cell(`${i + 1}`))}
        </hmi-grid>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Grid } from \'@ninoverse/hmi-components/react/grid\'` — `<Grid columns={3} gap="medium">…</Grid>`. A number gives equal tracks; a string is the `grid-template-columns` value. There is no `as` prop.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Columns: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1.5rem">
            ${[1, 2, 4].map(
                (n) =>
                    html`<hmi-grid .columns=${n} gap="small">
                        ${Array.from({ length: 4 }, (_, i) => cell(`${n} · ${i + 1}`))}
                    </hmi-grid>`,
            )}
        </div>
    `,
};

/** Any string other than a bare number is the template, as-is. */
export const CustomTemplate: Story = {
    args: { columns: '1fr 2fr', gap: 'small' },
};

/**
 * A grid has one column template, so rows share its tracks. To give rows
 * different splits, use common tracks and let the children span them:
 * `grid-column: span 2`, or `1 / -1` for a full-width row.
 */
export const SpanningRows: Story = {
    args: { columns: 6, gap: 'small' },
    render: (args) =>
        html`<hmi-grid .columns=${args.columns} gap=${args.gap}>
            <div style="grid-column: span 2">${cell('2/6')}</div>
            <div style="grid-column: span 4">${cell('4/6')}</div>
            <div style="grid-column: span 3">${cell('3/6')}</div>
            <div style="grid-column: span 3">${cell('3/6')}</div>
            <div style="grid-column: 1 / -1">${cell('full width')}</div>
        </hmi-grid>`,
};

export const Gaps: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1.5rem">
            ${gaps.map(
                (gap) =>
                    html`<hmi-grid .columns=${3} gap=${gap}>
                        ${cell(gap)} ${cell('b')} ${cell('c')}
                    </hmi-grid>`,
            )}
        </div>
    `,
};
