// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './menu-label.js';

it('renders declarative shadow DOM with the heading slot on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-menu-label>Workspace</hmi-menu-label>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('<slot');
    expect(out).toContain('Workspace');
});
