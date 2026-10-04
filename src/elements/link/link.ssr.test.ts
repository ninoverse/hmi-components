// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './link.js';

it('renders declarative shadow DOM with the anchor on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-link href="/docs" target="_blank">Read the docs</hmi-link>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('href="/docs"');
    expect(out).toContain('rel="noopener noreferrer"');
    expect(out).toContain('Read the docs');
});
