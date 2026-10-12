// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './radar-chart.js';

it('renders declarative shadow DOM with the polygons on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-radar-chart
                label="Skills"
                .axes=${['Speed', 'Power', 'Range']}
                .series=${[
                    {
                        name: 'Alpha',
                        data: [80, 65, 70],
                        color: 'var(--primary)',
                    },
                ]}
            ></hmi-radar-chart>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="Skills"');
    expect((out.match(/part="ring"/g) ?? []).length).toBe(4);
    expect((out.match(/part="spoke"/g) ?? []).length).toBe(3);
    expect(out).toContain('part="area"');
    expect(out).toContain('fill:var(--primary)');
    expect(out).toContain('Speed');
});

it('renders no svg without data', async () => {
    const out = await collectResult(
        render(html`<hmi-radar-chart></hmi-radar-chart>`),
    );
    expect(out).not.toContain('<svg');
});
