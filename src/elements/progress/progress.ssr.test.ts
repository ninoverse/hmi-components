// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './progress.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-progress value="64" label="Uploading"></hmi-progress>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('role="progressbar"');
    expect(out).toContain('aria-valuenow="64"');
    expect(out).toContain('aria-label="Uploading"');
});
