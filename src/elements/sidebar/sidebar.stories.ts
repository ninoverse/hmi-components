import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './sidebar.js';
import type { HmiSidebar, SidebarGroup } from './sidebar.js';

type Args = Pick<HmiSidebar, 'groups' | 'current' | 'label'>;

const GROUPS: SidebarGroup[] = [
    {
        label: 'Mail',
        items: [
            {
                value: 'inbox',
                label: 'Inbox',
                href: '#inbox',
                badge: '12',
                badgeVariant: 'primary',
            },
            { value: 'starred', label: 'Starred', href: '#starred' },
            { value: 'sent', label: 'Sent', href: '#sent' },
        ],
    },
    {
        label: 'Workspace',
        items: [
            {
                value: 'team',
                label: 'Team',
                href: '#team',
                badge: 'New',
                badgeVariant: 'success',
            },
            { value: 'settings', label: 'Settings', href: '#settings' },
        ],
    },
];

const ICON =
    '<svg slot="ICON" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9l1.5-5.5A1 1 0 014.5 3h7a1 1 0 011 .5L14 9v3.5a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5V9z" /></svg>';

const meta = {
    title: 'Components/Navigation/Sidebar',
    component: 'hmi-sidebar',
    tags: ['autodocs'],
    args: { groups: GROUPS, current: 'inbox', label: 'Sidebar' },
    argTypes: {
        groups: { control: 'object' },
        current: { control: 'text' },
        label: { control: 'text' },
    },
    // Controlled: set `current` back from `hmi-nav`.
    render: (args) =>
        html`<hmi-sidebar
            .groups=${args.groups}
            current=${args.current ?? ''}
            label=${args.label}
            @hmi-nav=${(e: CustomEvent) => {
                e.preventDefault();
                (e.currentTarget as HmiSidebar).current = e.detail.value;
            }}
        ></hmi-sidebar>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Sidebar } from \'@ninoverse/hmi-components/react/sidebar\'` — `<Sidebar groups={groups} current={page} onNav={(e) => setPage(e.detail.value)} />`. Icons, rich labels, group headings, badges and whole links are children with `slot="icon-<value>"`, `slot="label-<value>"`, `slot="group-<index>"`, `slot="badge-<value>"`, `slot="end-<value>"` and `slot="item-<value>"`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** An icon is an element slotted as `icon-<value>`. */
export const WithIcons: Story = {
    render: (args) => {
        const host = document.createElement('hmi-sidebar') as HmiSidebar;
        host.groups = args.groups;
        host.current = args.current;
        host.innerHTML = ['inbox', 'starred', 'sent', 'team', 'settings']
            .map((v) => ICON.replace('ICON', `icon-${v}`))
            .join('');
        host.addEventListener('hmi-nav', ((e: CustomEvent) => {
            e.preventDefault();
            host.current = e.detail.value;
        }) as EventListener);
        return host;
    },
};

/** `badge-<value>` is content inside the pill; `end-<value>` replaces the pill. */
export const RichBadges: Story = {
    render: (args) =>
        html`<hmi-sidebar .groups=${args.groups} current="inbox">
            <span slot="badge-inbox">🔥 12</span>
            <span slot="end-sent" style="color: var(--success)">●</span>
        </hmi-sidebar>`,
};

/** `item-<value>` replaces a whole link: a router's own link or a button. A slotted `<a>` is styled like the others. */
export const SlottedItems: Story = {
    render: (args) =>
        html`<hmi-sidebar .groups=${args.groups}>
            <a slot="item-inbox" href="#inbox" aria-current="page">Inbox (a router link)</a>
            <a slot="item-settings" href="#settings">Settings (a router link)</a>
        </hmi-sidebar>`,
};
