import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './tabs.js';
import type { HmiTabs, TabOption } from './tabs.js';

type Args = Pick<HmiTabs, 'options' | 'value' | 'variant' | 'label'>;

const OPTIONS: TabOption[] = [
    { value: 'inbox', label: 'Inbox', badge: '12' },
    { value: 'sent', label: 'Sent' },
    { value: 'archive', label: 'Archive', badge: '3' },
];

const meta = {
    title: 'Components/Navigation/Tabs',
    component: 'hmi-tabs',
    tags: ['autodocs'],
    args: {
        options: OPTIONS,
        value: 'inbox',
        variant: 'pill',
        label: 'Folders',
    },
    argTypes: {
        options: { control: 'object' },
        value: { control: 'text' },
        variant: { control: 'inline-radio', options: ['pill', 'underline'] },
        label: { control: 'text' },
    },
    // Controlled: set `value` back from `hmi-change`.
    render: (args) =>
        html`<hmi-tabs
            .options=${args.options}
            value=${args.value ?? ''}
            variant=${args.variant}
            label=${args.label ?? ''}
            @hmi-change=${(e: CustomEvent) => {
                (e.currentTarget as HmiTabs).value = e.detail.value;
            }}
        ></hmi-tabs>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Tabs } from \'@ninoverse/hmi-components/react/tabs\'` — `<Tabs options={tabs} value={tab} onChange={(e) => setTab(e.detail.value)} />`. It is the tab strip only: switch your panels on `value`. Rich labels, icons and badges are children with `slot="label-<value>"`, `slot="icon-<value>"`, `slot="badge-<value>"` and `slot="end-<value>"`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Pill: Story = {};

export const Underline: Story = {
    args: {
        variant: 'underline',
        value: 'overview',
        options: [
            { value: 'overview', label: 'Overview' },
            { value: 'usage', label: 'Usage', badge: '24' },
            { value: 'billing', label: 'Billing' },
        ],
    },
};

/** `badge` is the text of a pill, primary on the active tab. `badgeVariant` sets it. */
export const BadgeVariants: Story = {
    args: {
        options: [
            { value: 'inbox', label: 'Inbox', badge: '12' },
            {
                value: 'errors',
                label: 'Errors',
                badge: '4',
                badgeVariant: 'danger',
            },
            {
                value: 'done',
                label: 'Done',
                badge: '✓',
                badgeVariant: 'success',
            },
        ],
    },
};

/** An icon is an element slotted as `icon-<value>`. `badge-<value>` is rich content inside the pill; `end-<value>` replaces it. */
export const Slots: Story = {
    render: (args) =>
        html`<hmi-tabs .options=${args.options} value=${args.value ?? ''}>
            <svg slot="icon-inbox" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9l1.5-5.5A1 1 0 014.5 3h7a1 1 0 011 .5L14 9v3.5a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5V9z" /></svg>
            <span slot="badge-inbox">🔥 12</span>
            <span slot="end-archive" style="color: var(--success)">●</span>
        </hmi-tabs>`,
};
