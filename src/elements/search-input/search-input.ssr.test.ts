// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './search-input.js';

it('renders declarative shadow DOM with a search field, the icon and the default placeholder on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-search-input name="q" label="Search"></hmi-search-input>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('type="search"');
    expect(out).toContain('placeholder="Search…"');
    expect(out).toContain('class="search-icon"');
    expect(out).toContain('name="left-icon"');
    expect(out).toContain('name="right-icon"');
    expect(out).toContain('Search');
});
