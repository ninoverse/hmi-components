import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './list.js';
import type { HmiList, ListItem, ListReorderDetail } from './list.js';

type Args = Pick<HmiList, 'items' | 'reorderable'>;

const PEOPLE: ListItem[] = [
    {
        id: 'ada',
        avatar: 'Ada Lovelace',
        title: 'Ada Lovelace',
        subtitle: 'Computing pioneer',
    },
    {
        id: 'alan',
        avatar: 'Alan Turing',
        title: 'Alan Turing',
        subtitle: 'Theoretical foundation',
    },
    {
        id: 'grace',
        avatar: 'Grace Hopper',
        title: 'Grace Hopper',
        subtitle: 'Compiler genealogy',
    },
];

const FOLDERS: ListItem[] = [
    { id: 1, title: 'Inbox', subtitle: '12 unread messages' },
    { id: 2, title: 'Drafts', subtitle: '3 unsent' },
    { id: 3, title: 'Archive', subtitle: 'Older than 30 days', right: '312' },
];

const meta = {
    title: 'Components/DataDisplay/List',
    component: 'hmi-list',
    tags: ['autodocs'],
    args: { items: FOLDERS, reorderable: false },
    argTypes: {
        items: { control: 'object' },
        reorderable: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-list
            style="max-width: 40rem"
            .items=${args.items}
            ?reorderable=${args.reorderable}
        ></hmi-list>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { List } from \'@ninoverse/hmi-components/react/list\'` — `<List reorderable items={items} onReorder={(e) => setItems(e.detail.items)} />`. Rich content is a child with `slot="title-<id>"`, `slot="subtitle-<id>"`, `slot="right-<id>"`, or `slot="item-<id>"` for the whole row.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const WithAvatars: Story = { args: { items: PEOPLE } };

/** Drag a row, or focus its handle and press Alt+ArrowUp / Alt+ArrowDown. The list fires `hmi-reorder`; the consumer sets `items` back. */
export const Reorderable: Story = {
    args: { items: PEOPLE, reorderable: true },
    render: (args) =>
        html`<hmi-list
            style="max-width: 40rem"
            .items=${args.items}
            ?reorderable=${args.reorderable}
            @hmi-reorder=${(e: CustomEvent<ListReorderDetail>) => {
                (e.currentTarget as HmiList).items = e.detail.items;
            }}
        ></hmi-list>`,
};

/** `right-<id>` takes any element, and `item-<id>` replaces a whole row. */
export const Slots: Story = {
    render: (args) =>
        html`<hmi-list style="max-width: 40rem" .items=${args.items}>
            <hmi-badge slot="right-1">Live</hmi-badge>
            <strong slot="item-2">A fully custom row</strong>
        </hmi-list>`,
};
