// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './chart-tooltip.js';

it('renders declarative shadow DOM with the rows on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-chart-tooltip
                heading="Jan 2026"
                .items=${[
                    {
                        label: 'Revenue',
                        value: '$48.2k',
                        color: 'var(--primary)',
                    },
                    { label: 'Costs', value: '$31.7k' },
                ]}
            ></hmi-chart-tooltip>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="tooltip"');
    expect(out).toContain('Jan 2026');
    expect(out).toContain('$48.2k');
    expect(out).toContain('color:var(--primary)');
    expect(out).toContain('name="value-1"');
});
