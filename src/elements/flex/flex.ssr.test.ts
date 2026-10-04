// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './flex.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-flex direction="column" gap="small" wrap
                ><span>One</span><span>Two</span></hmi-flex
            >`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<slot>');
    expect(out).toContain('direction="column"');
    expect(out).toContain('One');
});
