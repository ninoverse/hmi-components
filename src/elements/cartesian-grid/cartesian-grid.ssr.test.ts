// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './cartesian-grid.js';

it('renders declarative shadow DOM with the grid lines on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-cartesian-grid width="120" height="60" rows="2" cols="3"></hmi-cartesian-grid>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<svg');
    expect(out).toContain('viewBox="0 0 120 60"');
    expect(out).toContain('cartesian-grid__line');
    expect((out.match(/<line /g) ?? []).length).toBe(3 + 4);
});
