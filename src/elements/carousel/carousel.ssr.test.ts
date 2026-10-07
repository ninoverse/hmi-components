// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './carousel.js';

it('renders declarative shadow DOM with the carousel region and its slot on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-carousel label="Highlights"
                ><div>One</div
                ><div>Two</div></hmi-carousel
            >`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('aria-roledescription="carousel"');
    expect(out).toContain('aria-label="Highlights"');
    expect(out).toContain('<slot');
    expect(out).toContain('One');
});
