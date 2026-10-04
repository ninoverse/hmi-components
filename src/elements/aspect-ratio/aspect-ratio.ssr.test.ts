// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './aspect-ratio.js';

it('renders declarative shadow DOM with the ratio on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-aspect-ratio ratio="16/9"
                ><div>Frame</div></hmi-aspect-ratio
            >`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('aspect-ratio:16/9');
    expect(out).toContain('Frame');
});
