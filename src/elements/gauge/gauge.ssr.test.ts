// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './gauge.js';

it('renders declarative shadow DOM with the dial and the value as the caption on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-gauge
                value="72"
                label="CPU load"
                color="var(--success)"
            ></hmi-gauge>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="CPU load"');
    expect(out).toContain('part="track"');
    expect(out).toContain('part="value"');
    expect(out).toContain('stroke:var(--success)');
    expect(out).toMatch(/<slot\s+name="caption"/);
    expect(out).toContain('72');
});

it('names the image from the value and the maximum by default', async () => {
    const out = await collectResult(
        render(html`<hmi-gauge value="45" max="80"></hmi-gauge>`),
    );
    expect(out).toContain('aria-label="Gauge: 45 of 80"');
});

it('hides the caption with hide-value', async () => {
    const out = await collectResult(
        render(html`<hmi-gauge value="72" hide-value></hmi-gauge>`),
    );
    expect(out).toMatch(/part="caption"[^>]*hidden/);
});
