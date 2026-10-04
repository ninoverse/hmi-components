// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './visually-hidden.js';

it('renders declarative shadow DOM on the server and keeps the text', async () => {
    const out = await collectResult(
        render(html`<hmi-visually-hidden>Search</hmi-visually-hidden>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<slot>');
    expect(out).toContain('Search');
});
