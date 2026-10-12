// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './donut-chart.js';

it('renders declarative shadow DOM with the arcs and the centre slot on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-donut-chart
                label="Traffic by source"
                .segments=${[
                    { label: 'Direct', value: 45 },
                    { label: 'Search', value: 30, color: 'var(--tertiary)' },
                ]}
            ></hmi-donut-chart>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="Traffic by source"');
    expect((out.match(/part="segment"/g) ?? []).length).toBe(2);
    expect(out).toContain('fill:var(--primary)');
    expect(out).toContain('fill:var(--tertiary)');
    expect(out).toMatch(/<slot\s+name="center-label"/);
});

it('renders no svg without data', async () => {
    const out = await collectResult(
        render(html`<hmi-donut-chart></hmi-donut-chart>`),
    );
    expect(out).not.toContain('<svg');
});
