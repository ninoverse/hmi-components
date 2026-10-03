// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './meter.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-meter value="0.5" show-value
                ><span slot="label">Disk</span></hmi-meter
            >`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('role="meter"');
    expect(out).toContain('aria-valuenow="0.5"');
    expect(out).toContain('Disk');
});
