import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './file-upload.js';
import type { HmiFileUpload } from './file-upload.js';

type Args = Pick<
    HmiFileUpload,
    'label' | 'hint' | 'error' | 'accept' | 'multiple' | 'required' | 'disabled'
>;

const meta = {
    title: 'Components/Forms/FileUpload',
    component: 'hmi-file-upload',
    tags: ['autodocs'],
    args: {
        label: 'Drop files here or click to browse',
        multiple: false,
        required: false,
        disabled: false,
    },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        accept: { control: 'text' },
        multiple: { control: 'boolean' },
        required: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-file-upload
            style="max-width: 40rem"
            label=${ifDefined(args.label)}
            hint=${ifDefined(args.hint)}
            error=${ifDefined(args.error)}
            accept=${ifDefined(args.accept)}
            ?multiple=${args.multiple}
            ?required=${args.required}
            ?disabled=${args.disabled}
        ></hmi-file-upload>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { FileUpload } from '@ninoverse/hmi-components/react/file-upload'` — `<FileUpload multiple onChange={(e) => setFiles(e.detail.value)} />`. `label` and `hint` are the text inside the zone. `hmi-change` carries descriptors; the real files are the element's `files` property, and a form submits them.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Click the zone or drop a file on it. */
export const Default: Story = {};

export const Multiple: Story = {
    args: { multiple: true, hint: 'PNG, JPG, or PDF up to 10 MB each' },
};

export const ImagesOnly: Story = {
    args: { accept: 'image/*', hint: 'Images only' },
};

export const WithError: Story = {
    args: { required: true, error: 'A file is required.' },
};

export const Disabled: Story = { args: { disabled: true } };
