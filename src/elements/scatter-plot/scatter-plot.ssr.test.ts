// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './scatter-plot.js';

it('renders declarative shadow DOM with the markers on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-scatter-plot
                label="Height versus weight"
                .series=${[
                    {
                        name: 'A',
                        color: 'var(--primary)',
                        data: [
                            { x: 1, y: 2 },
                            { x: 3, y: 4 },
                        ],
                    },
                ]}
            ></hmi-scatter-plot>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="Height versus weight"');
    expect((out.match(/part="point"/g) ?? []).length).toBe(2);
    expect(out).toContain('fill:var(--primary)');
});

it('renders no svg without data', async () => {
    const out = await collectResult(
        render(html`<hmi-scatter-plot></hmi-scatter-plot>`),
    );
    expect(out).not.toContain('<svg');
});
