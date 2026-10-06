// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './file-upload.js';

it('renders declarative shadow DOM with the drop zone on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-file-upload
                hint="PDF only"
                accept=".pdf"
                multiple
            ></hmi-file-upload>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('type="file"');
    expect(out).toContain('part="zone"');
    expect(out).toContain('Drop files here or click to browse');
    expect(out).toContain('PDF only');
});
