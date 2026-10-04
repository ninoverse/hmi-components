// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './spacer.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-spacer size="large" axis="horizontal"></hmi-spacer>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('size="large"');
    expect(out).toContain('axis="horizontal"');
});
