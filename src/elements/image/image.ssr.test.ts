// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './image.js';

it('renders declarative shadow DOM with the image and the shimmer on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-image
                src="/cover.jpg"
                alt="Cover"
                ratio="1.5"
                width="280"
                radius="large"
            ></hmi-image>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('src="/cover.jpg"');
    expect(out).toContain('alt="Cover"');
    expect(out).toContain('loading="lazy"');
    expect(out).toContain('part="loader"');
    expect(out).toContain('radius-large');
    expect(out).toContain('width:280px');
    expect(out).toContain('aspect-ratio:1.5');
});
