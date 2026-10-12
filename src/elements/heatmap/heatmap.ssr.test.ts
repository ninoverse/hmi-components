// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './heatmap.js';

it('renders declarative shadow DOM with the cells on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-heatmap
                show-values
                label="Weekly activity"
                color="var(--primary)"
                .xLabels=${['Mon', 'Tue']}
                .yLabels=${['Morning']}
                .data=${[[4, 8]]}
            ></hmi-heatmap>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="Weekly activity"');
    expect((out.match(/part="cell"/g) ?? []).length).toBe(2);
    expect((out.match(/part="value"/g) ?? []).length).toBe(2);
    expect(out).toContain('fill:var(--primary)');
    expect(out).toContain('Mon');
});

it('renders no svg without data', async () => {
    const out = await collectResult(render(html`<hmi-heatmap></hmi-heatmap>`));
    expect(out).not.toContain('<svg');
});
