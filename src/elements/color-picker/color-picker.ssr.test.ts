// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './color-picker.js';

it('renders declarative shadow DOM with the trigger, the swatches and the inputs on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-color-picker
                label="Brand"
                hint="Used for links"
                value="#5C9A6A"
            ></hmi-color-picker>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('<hmi-popover');
    expect(out).toContain('Brand');
    expect(out).toContain('Used for links');
    // The colour is #rrggbb in the trigger's text, the hex field and the sampler.
    expect(out).toContain('part="value"');
    expect(out).toContain('#5c9a6a');
    expect(out).toContain('part="hex"');
    expect(out).toContain('part="sample"');
    expect(out).toContain('role="radiogroup"');
    expect(out).toContain('aria-label="#d49a3f"');
    expect(out).toContain('aria-checked="true"');
});

it('renders only the swatches with hide-input', async () => {
    const out = await collectResult(
        render(html`<hmi-color-picker hide-input></hmi-color-picker>`),
    );
    expect(out).toContain('role="radiogroup"');
    expect(out).not.toContain('part="hex"');
    expect(out).not.toContain('part="sample"');
});
