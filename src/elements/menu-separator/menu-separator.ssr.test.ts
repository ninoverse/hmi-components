// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './menu-separator.js';

it('renders declarative shadow DOM with the separator on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-menu-separator></hmi-menu-separator>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('role="separator"');
});
