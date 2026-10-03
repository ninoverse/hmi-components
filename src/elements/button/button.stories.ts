import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './button.js';
import type { HmiButton } from './button.js';

type Args = Pick<
    HmiButton,
    'variant' | 'size' | 'asIcon' | 'disabled' | 'type' | 'label'
>;

const variants = [
    'primary',
    'secondary',
    'ghost',
    'soft',
    'danger',
    'link',
] as const;
const sizes = ['small', 'medium', 'large'] as const;

const star = html`<svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    aria-hidden="true"
>
    <path d="M10 2l2.4 5 5.6.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.6-.8z" />
</svg>`;

const meta = {
    title: 'Components/Forms/Button',
    component: 'hmi-button',
    tags: ['autodocs'],
    args: {
        variant: 'primary',
        size: 'medium',
        asIcon: false,
        disabled: false,
        type: 'button',
    },
    argTypes: {
        variant: { control: 'select', options: variants },
        size: { control: 'inline-radio', options: sizes },
        type: {
            control: 'inline-radio',
            options: ['button', 'submit', 'reset'],
        },
    },
    render: (args) =>
        html`<hmi-button
            variant=${args.variant}
            size=${args.size}
            type=${args.type}
            label=${ifDefined(args.label)}
            ?as-icon=${args.asIcon}
            ?disabled=${args.disabled}
            >Launch</hmi-button
        >`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Button } from \'@ninoverse/hmi-components/react/button\'` — `<Button variant="primary"><Icon slot="left-icon" />Save</Button>`. `leftIcon` and `rightIcon` are the `left-icon` and `right-icon` slots. `type="submit"` and `"reset"` act one timer tick after the click, so a click handler\'s `preventDefault()` cancels them like on a native button; `ignore-prevent-default` skips that tick and ignores `preventDefault()`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Variants: Story = {
    render: () => html`
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap">
            ${variants.map(
                (variant) =>
                    html`<hmi-button variant=${variant}>${variant}</hmi-button>`,
            )}
        </div>
    `,
};

export const Sizes: Story = {
    render: () => html`
        <div style="display: flex; gap: 1.5rem; align-items: center">
            ${sizes.map(
                (size) => html`<hmi-button size=${size}>${size}</hmi-button>`,
            )}
        </div>
    `,
};

export const Icons: Story = {
    render: () => html`
        <div style="display: flex; gap: 1.5rem; align-items: center">
            <hmi-button>
                <span slot="left-icon">${star}</span>Save
            </hmi-button>
            <hmi-button variant="secondary">
                Next<span slot="right-icon">${star}</span>
            </hmi-button>
        </div>
    `,
};

/** A square button has no visible text, so `label` names it. */
export const IconOnly: Story = {
    render: () => html`
        <div style="display: flex; gap: 1.5rem; align-items: center">
            ${sizes.map(
                (size) =>
                    html`<hmi-button as-icon size=${size} label="Favourite">
                        ${star}
                    </hmi-button>`,
            )}
        </div>
    `,
};

export const Disabled: Story = {
    render: () => html`
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap">
            ${variants.map(
                (variant) =>
                    html`<hmi-button variant=${variant} disabled>${variant}</hmi-button>`,
            )}
        </div>
    `,
};

/** `preventDefault()` in a click handler cancels the reset, as on a native
    button. Add `ignore-prevent-default` and the reset runs during the click
    regardless, without the one-tick wait. */
export const IgnorePreventDefault: Story = {
    render: () => html`
        <form style="display: flex; gap: 1.5rem; align-items: center">
            <input value="edit me" />
            <hmi-button
                type="reset"
                variant="secondary"
                @click=${(event: Event) => event.preventDefault()}
                >Reset (cancelled)</hmi-button
            >
            <hmi-button
                type="reset"
                variant="secondary"
                ignore-prevent-default
                @click=${(event: Event) => event.preventDefault()}
                >Reset (ignores preventDefault)</hmi-button
            >
        </form>
    `,
};
