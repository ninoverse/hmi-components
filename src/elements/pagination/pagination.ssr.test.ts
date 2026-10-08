// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './pagination.js';

it('renders declarative shadow DOM with the page window on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-pagination page="8" total="20"></hmi-pagination>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<nav');
    expect(out).toContain('aria-label="Pagination"');
    expect(out).toContain('aria-current="page"');
    expect(out).toContain('Page 8');
    expect(out).toContain('…');
});
