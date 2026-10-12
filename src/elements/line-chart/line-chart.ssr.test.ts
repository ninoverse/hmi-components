// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './line-chart.js';

it('renders declarative shadow DOM with the chart on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-line-chart
                show-dots
                label="Monthly revenue"
                .labels=${['Jan', 'Feb', 'Mar']}
                .series=${[{ name: 'Revenue', data: [32, 40, 38], color: 'var(--primary)' }]}
            ></hmi-line-chart>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="Monthly revenue"');
    expect(out).toContain('viewBox="0 0 520 260"');
    expect(out).toContain('cartesian-grid__line');
    expect(out).toContain('Jan');
    expect(out).toContain('stroke:var(--primary)');
    expect(out).toContain('<circle');
});

it('renders no svg without data', async () => {
    const out = await collectResult(
        render(html`<hmi-line-chart></hmi-line-chart>`),
    );
    expect(out).not.toContain('<svg');
});
