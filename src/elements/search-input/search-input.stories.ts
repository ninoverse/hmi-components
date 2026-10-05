import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './search-input.js';
import type { HmiSearchInput } from './search-input.js';

type Args = Pick<
    HmiSearchInput,
    'label' | 'hint' | 'error' | 'placeholder' | 'value' | 'disabled'
>;

const meta = {
    title: 'Components/Forms/SearchInput',
    component: 'hmi-search-input',
    tags: ['autodocs'],
    args: { label: 'Search', disabled: false },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        placeholder: { control: 'text' },
        value: { control: 'text' },
        disabled: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-search-input
            style="width: 22rem; max-width: 100%"
            label=${ifDefined(args.label)}
            hint=${ifDefined(args.hint)}
            error=${ifDefined(args.error)}
            placeholder=${ifDefined(args.placeholder)}
            value=${ifDefined(args.value)}
            ?disabled=${args.disabled}
        ></hmi-search-input>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { SearchInput } from \'@ninoverse/hmi-components/react/search-input\'` — `<SearchInput name="q" label="Search" value={q} onInput={(e) => setQ(e.detail.value)} />`. Extends `hmi-input`: the `type` property is ignored (the field is `search`) and the built-in icon is the fallback of the `left-icon` slot. `error` is the message text, not a boolean.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Placeholder defaults to "Search…" and the leading icon is built in. */
export const Default: Story = {};

export const CustomPlaceholder: Story = {
    args: { placeholder: 'Find a component…' },
};

export const WithValue: Story = { args: { value: 'tabs' } };

export const WithError: Story = {
    args: { error: 'No results.', value: 'zzz' },
};

export const Disabled: Story = { args: { disabled: true } };

/** A slotted icon replaces the built-in one. */
export const CustomIcon: Story = {
    render: () =>
        html`<hmi-search-input style="width: 22rem" label="Search the docs">
            <svg slot="left-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 2h7l3 3v9H3z" /><path d="M10 2v3h3" /></svg>
        </hmi-search-input>`,
};
