// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './text.js';

it('renders declarative shadow DOM on the server and keeps the text', async () => {
    const out = await collectResult(
        render(html`<hmi-text size="small" tone="muted">Copy</hmi-text>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<slot>');
    expect(out).toContain('size="small"');
    expect(out).toContain('Copy');
});
