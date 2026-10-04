// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './grid.js';

it('renders declarative shadow DOM with the column template on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-grid columns="3" gap="medium"
                ><span>One</span><span>Two</span></hmi-grid
            >`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('repeat(3, minmax(0, 1fr))');
    expect(out).toContain('gap="medium"');
});
