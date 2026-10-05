// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './form-control.js';

it('renders declarative shadow DOM with the label, hint and control slot on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-form-control label="Full name" hint="As on documents"
                ><span>control</span></hmi-form-control
            >`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="label"');
    expect(out).toContain('Full name');
    expect(out).toContain('As on documents');
    expect(out).toContain('control');
});
