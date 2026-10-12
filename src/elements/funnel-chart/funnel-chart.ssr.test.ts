// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './funnel-chart.js';

it('renders declarative shadow DOM with the bands and labels on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-funnel-chart
                show-values
                label="Signup funnel"
                .stages=${[
                    { label: 'Visited', value: 1200, color: 'var(--primary)' },
                    { label: 'Signed up', value: 600 },
                ]}
            ></hmi-funnel-chart>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="Signup funnel"');
    expect((out.match(/part="band"/g) ?? []).length).toBe(2);
    expect(out).toContain('fill:var(--primary)');
    expect(out).toContain('Visited · 1200 (100%)');
});

it('renders no svg without data', async () => {
    const out = await collectResult(
        render(html`<hmi-funnel-chart></hmi-funnel-chart>`),
    );
    expect(out).not.toContain('<svg');
});
