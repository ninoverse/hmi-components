import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './progress.js';
import type { HmiProgress } from './progress.js';

type Args = Pick<HmiProgress, 'value' | 'indeterminate' | 'label'>;

const meta = {
    title: 'Components/Feedback/Progress',
    component: 'hmi-progress',
    tags: ['autodocs'],
    args: { value: 64, indeterminate: false, label: 'Uploading' },
    argTypes: {
        value: { control: { type: 'range', min: 0, max: 100 } },
        indeterminate: { control: 'boolean' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-progress
            style="width: 28rem; max-width: 100%"
            .value=${args.value}
            ?indeterminate=${args.indeterminate}
            label=${args.label ?? ''}
        ></hmi-progress>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Progress } from \'@ninoverse/hmi-components/react/progress\'` — `<Progress value={64} label="Uploading" />`. The Field Journal border is the `--progress-track-border` token.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Values: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 28rem; max-width: 100%">
            ${[0, 25, 50, 75, 100].map(
                (value) =>
                    html`<hmi-progress .value=${value} label="${value}%"></hmi-progress>`,
            )}
        </div>
    `,
};

/** The bar loops across the track and `value` is ignored. */
export const Indeterminate: Story = { args: { indeterminate: true } };
