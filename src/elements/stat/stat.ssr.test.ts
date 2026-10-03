// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './stat.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-stat trend="up"
                ><span slot="label">Revenue</span
                ><span slot="value">$12.4k</span
                ><span slot="delta">8%</span></hmi-stat
            >`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('part="footer"');
    expect(out).toContain('name="value"');
    expect(out).toContain('$12.4k');
});
