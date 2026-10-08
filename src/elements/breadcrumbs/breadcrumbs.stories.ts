import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './breadcrumbs.js';
import type { BreadcrumbItem, HmiBreadcrumbs } from './breadcrumbs.js';

type Args = Pick<HmiBreadcrumbs, 'items' | 'separator' | 'label'>;

const TRAIL: BreadcrumbItem[] = [
    { label: 'Home', href: '#home' },
    { label: 'Library', href: '#library' },
    { label: 'Components', href: '#components' },
    { label: 'Breadcrumbs' },
];

const meta = {
    title: 'Components/Navigation/Breadcrumbs',
    component: 'hmi-breadcrumbs',
    tags: ['autodocs'],
    args: { items: TRAIL, separator: '/', label: 'Breadcrumb' },
    argTypes: {
        items: { control: 'object' },
        separator: { control: 'text' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-breadcrumbs
            .items=${args.items}
            separator=${args.separator}
            label=${args.label}
        ></hmi-breadcrumbs>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Breadcrumbs } from \'@ninoverse/hmi-components/react/breadcrumbs\'` — `<Breadcrumbs items={trail} onNav={(e) => go(e.detail.index)} />`. Rich labels are children with `slot="label-<index>"`, and one child with `slot="separator"` is copied between the crumbs.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const CustomSeparator: Story = { args: { separator: '›' } };

/** A slotted element, copied into every gap. */
export const SlottedSeparator: Story = {
    render: (args) =>
        html`<hmi-breadcrumbs .items=${args.items}>
            <svg slot="separator" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4l4 4-4 4" /></svg>
        </hmi-breadcrumbs>`,
};

/** `label-<index>` replaces a crumb's text with any element. */
export const RichLabel: Story = {
    render: (args) =>
        html`<hmi-breadcrumbs .items=${args.items}>
            <span slot="label-0">🏠 Home</span>
        </hmi-breadcrumbs>`,
};

/** Cancel `hmi-nav` to handle the navigation yourself, as a router does. */
export const WithoutHref: Story = {
    args: {
        items: [{ label: 'Home' }, { label: 'Library' }, { label: 'Settings' }],
    },
    render: (args) =>
        html`<hmi-breadcrumbs
            .items=${args.items}
            @hmi-nav=${(e: CustomEvent) => console.log('hmi-nav', e.detail)}
        ></hmi-breadcrumbs>`,
};
