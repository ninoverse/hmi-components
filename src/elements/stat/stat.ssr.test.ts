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
    expect(out).toContain('part="base panel"');
    expect(out).toContain('role="group"');
    expect(out).toContain('aria-labelledby="label"');
    expect(out).toContain('name="value"');
    expect(out).toContain('$12.4k');
    /* The server can't see the slots: the footer is hidden until the element
       hydrates, and the icon's box kept. */
    expect(out).toMatch(/part="footer"[^>]*hidden/);
    expect(out).not.toMatch(/part="icon"[^>]*hidden/);
    /* The direction in words is server-rendered with the arrow. */
    expect(out).toMatch(/class="trend"[^>]*>(<!--[^>]*-->)*up/);
});

it('draws an unknown trend as neutral on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-stat trend="sideways"></hmi-stat>`),
    );
    expect(out).toContain('d="M3 8h10"');
    expect(out).toContain('data-tone="neutral"');
});
