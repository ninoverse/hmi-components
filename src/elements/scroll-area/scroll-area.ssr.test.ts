// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './scroll-area.js';

it('renders declarative shadow DOM with the max height on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-scroll-area .maxHeight=${160}
                ><p>Content</p></hmi-scroll-area
            >`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('max-height:160px');
    expect(out).toContain('Content');
});
