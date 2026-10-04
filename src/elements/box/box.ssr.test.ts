// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './box.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-box padding="medium" bordered>Content</hmi-box>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<slot>');
    expect(out).toContain('padding="medium"');
    expect(out).toContain('Content');
});
