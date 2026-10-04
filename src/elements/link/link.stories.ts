import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './link.js';
import type { HmiLink } from './link.js';

type Args = Pick<
    HmiLink,
    'underline' | 'tone' | 'href' | 'target' | 'rel' | 'label'
>;

const underlines = ['always', 'hover', 'none'] as const;
const tones = ['primary', 'muted'] as const;

const meta = {
    title: 'Components/Typography/Link',
    component: 'hmi-link',
    tags: ['autodocs'],
    args: { underline: 'always', tone: 'primary', href: '#' },
    argTypes: {
        underline: { control: 'inline-radio', options: underlines },
        tone: { control: 'inline-radio', options: tones },
        href: { control: 'text' },
        target: { control: 'text' },
        rel: { control: 'text' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<p style="margin: 0">
            Some text with
            <hmi-link
                underline=${args.underline}
                tone=${args.tone}
                href=${ifDefined(args.href)}
                target=${ifDefined(args.target)}
                rel=${ifDefined(args.rel)}
                label=${ifDefined(args.label)}
                >a link inside it</hmi-link
            >
            and more text after.
        </p>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Link } from \'@ninoverse/hmi-components/react/link\'` — `<Link href="/docs" underline="hover">Read the docs</Link>`. Only `href`, `target`, `rel`, `download` and `label` reach the inner anchor; `aria-*` on the host does not, so name an icon-only link with `label`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Underlines: Story = {
    render: () =>
        html`<div style="display: flex; flex-direction: column; gap: 0.5rem">
            ${underlines.map(
                (underline) =>
                    html`<span><hmi-link href="#" underline=${underline}>underline="${underline}"</hmi-link></span>`,
            )}
        </div>`,
};

export const Tones: Story = {
    render: () =>
        html`<div style="display: flex; flex-direction: column; gap: 0.5rem">
            ${tones.map(
                (tone) =>
                    html`<span><hmi-link href="#" tone=${tone}>tone="${tone}"</hmi-link></span>`,
            )}
        </div>`,
};

/** `target="_blank"` adds `rel="noopener noreferrer"` unless `rel` is set. */
export const OpensInNewTab: Story = {
    args: { href: 'https://example.com', target: '_blank' },
};

/** An icon-only link takes its accessible name from `label`. */
export const IconOnly: Story = {
    args: { href: '#', label: 'Home' },
    render: (args) =>
        html`<hmi-link href=${ifDefined(args.href)} label=${ifDefined(args.label)} underline="none">
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10l7-6 7 6M5 9v8h10V9" /></svg>
        </hmi-link>`,
};
