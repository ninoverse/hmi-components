// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './sparkline.js';

it('renders declarative shadow DOM with the trend line on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-sparkline
                area
                show-dot
                label="Upward trend"
                .data=${[0, 10, 5]}
            ></hmi-sparkline>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<svg');
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="Upward trend"');
    expect(out).toContain('<path');
    expect(out).toContain('<circle');
    expect(out).toContain('color: var(--primary)');
});

it('renders no svg without data', async () => {
    const out = await collectResult(
        render(html`<hmi-sparkline></hmi-sparkline>`),
    );
    expect(out).not.toContain('<svg');
});
