import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './navbar.js';
import '../button/button.js';
import type { HmiNavbar, NavbarLink } from './navbar.js';

type Args = Pick<
    HmiNavbar,
    'brand' | 'links' | 'current' | 'label' | 'toggleLabel'
>;

const LINKS: NavbarLink[] = [
    { value: 'overview', label: 'Overview', href: '#overview' },
    { value: 'reports', label: 'Reports', href: '#reports' },
    { value: 'people', label: 'People', href: '#people' },
    { value: 'settings', label: 'Settings', href: '#settings' },
];

const meta = {
    title: 'Components/Navigation/Navbar',
    component: 'hmi-navbar',
    tags: ['autodocs'],
    args: {
        brand: 'Ninoverse',
        links: LINKS,
        current: 'reports',
        label: 'Main',
        toggleLabel: 'Toggle navigation menu',
    },
    argTypes: {
        brand: { control: 'text' },
        links: { control: 'object' },
        current: { control: 'text' },
        label: { control: 'text' },
        toggleLabel: { control: 'text' },
    },
    // Controlled: set `current` back from `hmi-nav`.
    render: (args) =>
        html`<hmi-navbar
            brand=${args.brand}
            .links=${args.links}
            current=${args.current ?? ''}
            label=${args.label}
            toggle-label=${args.toggleLabel}
            @hmi-nav=${(e: CustomEvent) => {
                e.preventDefault();
                (e.currentTarget as HmiNavbar).current = e.detail.value;
            }}
        >
            <hmi-button slot="right" size="small" variant="primary">Get started</hmi-button>
        </hmi-navbar>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Navbar } from \'@ninoverse/hmi-components/react/navbar\'` — `<Navbar brand="Ninoverse" links={links} current={tab} onNav={(e) => setTab(e.detail.value)} />`. `brand` and `right` are children with `slot="brand"` and `slot="right"`; `label-<value>`, `badge-<value>`, `end-<value>` and `item-<value>` slots take rich content, a badge, a replacement for it, and a whole link (a router link, a button or a menu).',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** A link takes `badge` text and a `badgeVariant`. */
export const WithBadges: Story = {
    args: {
        links: [
            { value: 'overview', label: 'Overview', href: '#overview' },
            {
                value: 'reports',
                label: 'Reports',
                href: '#reports',
                badge: '12',
                badgeVariant: 'primary',
            },
            { value: 'people', label: 'People', href: '#people', badge: 'new' },
        ],
    },
};

/** `badge-<value>` is content inside the pill; `end-<value>` replaces the pill. */
export const RichBadges: Story = {
    render: (args) =>
        html`<hmi-navbar brand=${args.brand} .links=${args.links} current="reports">
            <span slot="badge-reports">🔥 12</span>
            <span slot="end-people" style="color: var(--success)">●</span>
        </hmi-navbar>`,
};

/** `item-<value>` replaces a whole link: a router's own link, a button or a menu. A slotted `<a>` is styled like the others. */
export const SlottedItems: Story = {
    render: (args) =>
        html`<hmi-navbar brand=${args.brand} .links=${args.links}>
            <a slot="item-overview" href="#overview" aria-current="page">Overview (a router link)</a>
            <hmi-button slot="item-settings" size="small" variant="ghost">Settings (a button)</hmi-button>
        </hmi-navbar>`,
};

export const BrandSlot: Story = {
    render: (args) =>
        html`<hmi-navbar .links=${args.links} current="overview">
            <strong slot="brand">★ Custom brand</strong>
        </hmi-navbar>`,
};

/** Only a slotted `<a>` is styled as a link. Another element styles itself, and `aria-current="page"` on it gives the active tint. */
export const SlottedCustomElement: Story = {
    render: (args) =>
        html`<hmi-navbar brand=${args.brand} .links=${args.links}>
            <span
                slot="item-settings"
                role="link"
                tabindex="0"
                aria-current="page"
                style="padding: var(--space-4) var(--space-7); border-radius: var(--corner-extra-small); cursor: pointer"
                >Settings (a custom element)</span
            >
        </hmi-navbar>`,
};
