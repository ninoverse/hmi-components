import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../input/input.js';
import './form-control.js';
import type { HmiFormControl } from './form-control.js';

type Args = Pick<HmiFormControl, 'label' | 'hint' | 'error'>;

/* Deprecated: the form elements render their own label, hint and error. This is
   the wrapper for children that do not, so the examples wrap an input only to
   show the layout. */
const meta = {
    title: 'Components/Forms/FormControl',
    component: 'hmi-form-control',
    tags: ['autodocs'],
    args: { label: 'Full name' },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-form-control
            style="max-width: 28rem"
            label=${ifDefined(args.label)}
            hint=${ifDefined(args.hint)}
            error=${ifDefined(args.error)}
        >
            <hmi-input placeholder="Alex Morgan"></hmi-input>
        </hmi-form-control>`,
    parameters: {
        docs: {
            description: {
                component:
                    'Deprecated: set `label`, `hint` and `error` on the form element itself. React: `import { FormControl } from \'@ninoverse/hmi-components/react/form-control\'` — `<FormControl label="Email" error={err}><MyControl /></FormControl>`. The strings can be replaced by the slots of the same names.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const LabelOnly: Story = {};

export const WithHint: Story = { args: { hint: 'As it appears on documents' } };

/** `error` takes precedence over `hint`: the hint is hidden while an error is set. */
export const WithError: Story = {
    args: {
        hint: 'As it appears on documents',
        error: "Hmm, that doesn't look right.",
    },
};

/** The slots replace the strings with rich content. */
export const SlottedContent: Story = {
    render: () =>
        html`<hmi-form-control style="max-width: 28rem">
            <span slot="label">Email <em>(required)</em></span>
            <hmi-input type="email" placeholder="you@studio.co"></hmi-input>
            <span slot="hint">We only use it to <b>reset your password</b>.</span>
        </hmi-form-control>`,
};
