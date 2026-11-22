// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './spinner.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-spinner size="large" label="Fetching"></hmi-spinner>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('role="status"');
    /* The status starts empty, and the label joins it in the browser, so a
       screen reader announces it once the page is live. */
    const shadow = out.slice(
        out.indexOf('<template'),
        out.indexOf('</template>'),
    );
    expect(shadow).not.toContain('Fetching');
});

it('renders a decorative spinner hidden on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-spinner label=""></hmi-spinner>`),
    );
    expect(out).toContain('aria-hidden="true"');
    expect(out).not.toContain('role="status"');
});
