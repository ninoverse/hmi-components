// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './select.js';

it('renders declarative shadow DOM with the trigger and the options on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-select
                label="Plan"
                hint="Pick one"
                value="pro"
                .options=${[
                    { value: 'free', label: 'Free' },
                    { value: 'pro', label: 'Pro' },
                ]}
            ></hmi-select>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('<hmi-popover');
    expect(out).toContain('<hmi-menu');
    expect(out).toContain('Plan');
    expect(out).toContain('Pick one');
    // The chosen option is the trigger's text, and the options are in the list.
    expect(out).toContain('part="value"');
    expect(out).toContain('Free');
    expect(out).toContain('name="label-pro"');
    expect(out).toContain('<hmi-menu-item');
});

it('renders the placeholder on the server while nothing is chosen', async () => {
    const out = await collectResult(
        render(html`<hmi-select placeholder="Pick a region…"></hmi-select>`),
    );
    expect(out).toContain('part="placeholder"');
    expect(out).toContain('Pick a region…');
});
