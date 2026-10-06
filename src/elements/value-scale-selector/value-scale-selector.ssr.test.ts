// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './value-scale-selector.js';

it('renders declarative shadow DOM with a slider of icons on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-value-scale-selector
                label="Rating"
                hint="Rate it"
                value="3"
                max="5"
            ></hmi-value-scale-selector>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="slider"');
    expect(out).toContain('aria-valuenow="3"');
    expect(out).toContain('aria-valuetext="3 out of 5"');
    expect(out).toContain('Rating');
    expect(out).toContain('Rate it');
});
