// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './heading.js';

it('renders declarative shadow DOM with the inner heading on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-heading level="3" tone="muted">Title</hmi-heading>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<h3');
    expect(out).toContain('part="base"');
    expect(out).toContain('size-medium');
    expect(out).toContain('Title');
});
