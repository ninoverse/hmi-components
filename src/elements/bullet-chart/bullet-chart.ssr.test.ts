// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './bullet-chart.js';

it('renders declarative shadow DOM with the bands, bar and target on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-bullet-chart
                caption="Revenue"
                value="78"
                target="85"
                max="100"
                .ranges=${[50, 75]}
            ></hmi-bullet-chart>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="Revenue"');
    expect((out.match(/part="band"/g) ?? []).length).toBe(3);
    expect(out).toContain('part="measure"');
    expect(out).toContain('part="target"');
    expect(out).toContain('fill:var(--primary)');
    expect(out).toContain('Revenue');
});
