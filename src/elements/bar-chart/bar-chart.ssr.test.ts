// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './bar-chart.js';

it('renders declarative shadow DOM with the bars on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-bar-chart
                label="Quarterly units"
                .labels=${['Q1', 'Q2']}
                .series=${[{ name: 'A', data: [42, 55], color: 'var(--primary)' }]}
            ></hmi-bar-chart>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="Quarterly units"');
    expect((out.match(/part="bar"/g) ?? []).length).toBe(2);
    expect(out).toContain('fill:var(--primary)');
    expect(out).toContain('Q1');
});

it('renders no svg without data', async () => {
    const out = await collectResult(
        render(html`<hmi-bar-chart></hmi-bar-chart>`),
    );
    expect(out).not.toContain('<svg');
});
