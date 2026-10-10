// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './legend.js';

it('renders declarative shadow DOM with the entries on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-legend
                align="start"
                .items=${[
                    { label: 'Revenue', color: 'var(--primary)' },
                    {
                        label: 'Forecast',
                        color: 'var(--secondary)',
                        inactive: true,
                    },
                ]}
            ></hmi-legend>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<ul');
    expect(out).toContain('Revenue');
    expect(out).toContain('Forecast');
    expect(out).toContain('color: var(--primary)');
    expect(out).toContain('data-inactive');
    expect(out).toContain('name="label-1"');
});
