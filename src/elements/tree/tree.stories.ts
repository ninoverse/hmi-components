import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './tree.js';
import type { HmiTree, TreeNode } from './tree.js';

type Args = Pick<HmiTree, 'nodes' | 'expanded' | 'selected' | 'label'>;

const NODES: TreeNode[] = [
    {
        value: 'src',
        label: 'src',
        children: [
            {
                value: 'src/components',
                label: 'components',
                children: [
                    { value: 'button.tsx', label: 'button.tsx' },
                    { value: 'tree.tsx', label: 'tree.tsx' },
                ],
            },
            { value: 'src/index.ts', label: 'index.ts' },
        ],
    },
    {
        value: 'public',
        label: 'public',
        children: [
            {
                value: 'public/themes',
                label: 'themes',
                children: [{ value: 'default.css', label: 'default.css' }],
            },
        ],
    },
    { value: 'package.json', label: 'package.json' },
    {
        value: 'node_modules',
        label: 'node_modules',
        disabled: true,
        children: [{ value: 'nm/react', label: 'react' }],
    },
];

const meta = {
    title: 'Components/Navigation/Tree',
    component: 'hmi-tree',
    tags: ['autodocs'],
    args: {
        nodes: NODES,
        expanded: ['src', 'src/components'],
        selected: 'button.tsx',
        label: 'Project files',
    },
    argTypes: {
        nodes: { control: 'object' },
        expanded: { control: 'object' },
        selected: { control: 'text' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-tree
            style="width: 44rem"
            .nodes=${args.nodes}
            .expanded=${args.expanded}
            selected=${args.selected ?? ''}
            label=${args.label}
        ></hmi-tree>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Tree } from \'@ninoverse/hmi-components/react/tree\'` — `<Tree nodes={nodes} expanded={[\'src\']} onSelect={(e) => setSelected(e.detail.value)} />`. The element owns `expanded` and `selected`; set them for the initial state. Rich labels, icons and badges are children with `slot="label-<value>"`, `slot="icon-<value>"`, `slot="badge-<value>"` and `slot="end-<value>"`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** A node takes `badge` text and a `badgeVariant`. */
export const WithBadges: Story = {
    args: {
        nodes: [
            {
                value: 'src',
                label: 'src',
                badge: '3',
                children: [
                    {
                        value: 'a.ts',
                        label: 'a.ts',
                        badge: 'M',
                        badgeVariant: 'warning',
                    },
                    {
                        value: 'b.ts',
                        label: 'b.ts',
                        badge: 'A',
                        badgeVariant: 'success',
                    },
                    {
                        value: 'c.ts',
                        label: 'c.ts',
                        badge: 'D',
                        badgeVariant: 'danger',
                    },
                ],
            },
        ],
        expanded: ['src'],
        selected: 'a.ts',
    },
};

/** An icon is an element slotted as `icon-<value>`. `badge-<value>` is rich content inside the pill; `end-<value>` replaces it. */
export const Slots: Story = {
    render: (args) =>
        html`<hmi-tree
            style="width: 44rem"
            .nodes=${args.nodes}
            .expanded=${args.expanded}
            selected=${args.selected ?? ''}
        >
            <svg slot="icon-package.json" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 2h7l3 3v9H3z" /></svg>
            <span slot="badge-button.tsx">🔥 2</span>
            <span slot="end-tree.tsx" style="color: var(--success)">●</span>
        </hmi-tree>`,
};

/** Listen to `hmi-expanded-change` and `hmi-select`; set the property back to veto. */
export const Events: Story = {
    render: (args) =>
        html`<hmi-tree
            style="width: 44rem"
            .nodes=${args.nodes}
            .expanded=${args.expanded}
            @hmi-select=${(e: CustomEvent) => console.log('hmi-select', e.detail)}
            @hmi-expanded-change=${(e: CustomEvent) =>
                console.log('hmi-expanded-change', e.detail)}
        ></hmi-tree>`,
};
