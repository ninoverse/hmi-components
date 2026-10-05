// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './textarea.js';

it('renders declarative shadow DOM with the label, field and hint on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-textarea
                name="bio"
                label="About you"
                hint="240 characters max"
                placeholder="Tell us a bit"
                rows="4"
            ></hmi-textarea>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base control"');
    expect(out).toContain('About you');
    expect(out).toContain('240 characters max');
    expect(out).toContain('placeholder="Tell us a bit"');
    expect(out).toContain('rows="4"');
});

it('renders the error as an alert and marks the field invalid', async () => {
    const out = await collectResult(
        render(html`<hmi-textarea error="Describe the issue"></hmi-textarea>`),
    );
    expect(out).toContain('role="alert"');
    expect(out).toContain('Describe the issue');
    expect(out).toContain('aria-invalid="true"');
});
