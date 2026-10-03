// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './empty-state.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-empty-state
                ><span slot="title">No results</span
                ><span slot="description">Try another search.</span></hmi-empty-state
            >`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('<h3');
    expect(out).toContain('Try another search.');
});
