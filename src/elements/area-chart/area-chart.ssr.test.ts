// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './area-chart.js';

it('renders declarative shadow DOM with the chart on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-area-chart
                label="Monthly active users"
                .labels=${['Jan', 'Feb', 'Mar']}
                .series=${[{ name: 'Pro', data: [20, 28, 26], color: 'var(--primary)' }]}
            ></hmi-area-chart>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="Monthly active users"');
    expect(out).toContain('part="area"');
    expect(out).toContain('fill:var(--primary)');
    expect(out).toContain('Jan');
});

it('renders no svg without data', async () => {
    const out = await collectResult(
        render(html`<hmi-area-chart></hmi-area-chart>`),
    );
    expect(out).not.toContain('<svg');
});
