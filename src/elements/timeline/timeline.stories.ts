import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './timeline.js';
import type { HmiTimeline, TimelineItem } from './timeline.js';

type Args = Pick<HmiTimeline, 'items' | 'divider'>;

const EVENTS: TimelineItem[] = [
    {
        title: 'Project created',
        time: '09:24',
        description: 'Repository scaffolded and first commit pushed.',
        color: 'primary',
    },
    {
        title: 'CI pipeline green',
        time: '10:02',
        description: 'Lint, build, and tests all passing.',
        color: 'success',
    },
    {
        title: 'Flaky test detected',
        time: '11:47',
        description: 'Intermittent failure in the carousel autoplay spec.',
        color: 'warning',
    },
    {
        title: 'Deploy rolled back',
        time: '12:15',
        description: 'Production deploy reverted after error spike.',
        color: 'error',
    },
    { title: 'Awaiting review', time: '13:30' },
];

const meta = {
    title: 'Components/DataDisplay/Timeline',
    component: 'hmi-timeline',
    tags: ['autodocs'],
    args: { items: EVENTS, divider: false },
    argTypes: {
        items: { control: 'object' },
        divider: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-timeline
            style="max-width: 40rem"
            .items=${args.items}
            ?divider=${args.divider}
        ></hmi-timeline>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Timeline } from \'@ninoverse/hmi-components/react/timeline\'` — `<Timeline divider items={events} />`. Rich titles, descriptions, times and icons are children with `slot="title-<index>"`, `slot="description-<index>"`, `slot="time-<index>"` or `slot="icon-<index>"`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** `divider` draws a hairline between events. */
export const WithDivider: Story = { args: { divider: true } };

export const Minimal: Story = {
    args: { items: [{ title: 'Started' }, { title: 'Finished' }] },
};

/** An icon is an element slotted as `icon-<index>`. */
export const WithIcon: Story = {
    render: (args) =>
        html`<hmi-timeline style="max-width: 40rem" .items=${args.items}>
            <svg slot="icon-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7" /></svg>
        </hmi-timeline>`,
};
