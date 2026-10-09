import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './stepper.js';
import type { HmiStepper, StepperStep } from './stepper.js';

type Args = Pick<
    HmiStepper,
    'steps' | 'current' | 'orientation' | 'spacing' | 'readonly' | 'label'
>;

const STEPS: StepperStep[] = [
    { value: 'cart', label: 'Cart', description: '3 items' },
    { value: 'address', label: 'Address', description: 'Delivery details' },
    { value: 'payment', label: 'Payment', description: 'Choose method' },
    { value: 'review', label: 'Review' },
];

const meta = {
    title: 'Components/Navigation/Stepper',
    component: 'hmi-stepper',
    tags: ['autodocs'],
    args: {
        steps: STEPS,
        current: 'payment',
        orientation: 'horizontal',
        spacing: undefined,
        readonly: false,
        label: 'Checkout progress',
    },
    argTypes: {
        steps: { control: 'object' },
        current: { control: 'text' },
        orientation: {
            control: 'inline-radio',
            options: ['horizontal', 'vertical'],
        },
        spacing: { control: 'text' },
        readonly: { control: 'boolean' },
        label: { control: 'text' },
    },
    // Controlled: set `current` back from `hmi-change`.
    render: (args) =>
        html`<hmi-stepper
            .steps=${args.steps}
            current=${args.current ?? ''}
            orientation=${args.orientation}
            spacing=${args.spacing ?? ''}
            ?readonly=${args.readonly}
            label=${args.label}
            @hmi-change=${(e: CustomEvent) => {
                (e.currentTarget as HmiStepper).current = e.detail.value;
            }}
        ></hmi-stepper>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Stepper } from \'@ninoverse/hmi-components/react/stepper\'` — `<Stepper steps={steps} current={step} onChange={(e) => setStep(e.detail.value)} />`. Rich labels and descriptions are children with `slot="label-<value>"` and `slot="description-<value>"`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Horizontal: Story = {};

export const Vertical: Story = { args: { orientation: 'vertical' } };

/** `spacing` is a CSS length; `--stepper-item-gap` on the host or an ancestor does the same. */
export const VerticalSpacing: Story = {
    args: { orientation: 'vertical', spacing: '4rem' },
};

/** Completed steps are buttons: choose one to go back. `readonly` makes them plain text. */
export const Readonly: Story = { args: { readonly: true } };

export const Slots: Story = {
    render: (args) =>
        html`<hmi-stepper .steps=${args.steps} current="payment">
            <b slot="label-cart">🛒 Basket</b>
            <em slot="description-payment">Card or invoice</em>
        </hmi-stepper>`,
};
