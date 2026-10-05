// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './input.js';

it('renders declarative shadow DOM with the label, field and hint on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-input
                name="email"
                label="Email"
                hint="We never share it"
                placeholder="you@studio.co"
                required
            ></hmi-input>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('part="control"');
    expect(out).toContain('Email');
    expect(out).toContain('We never share it');
    expect(out).toContain('placeholder="you@studio.co"');
});

it('renders the error as an alert and marks the field invalid', async () => {
    const out = await collectResult(
        render(html`<hmi-input error="Not an email"></hmi-input>`),
    );
    expect(out).toContain('role="alert"');
    expect(out).toContain('Not an email');
    expect(out).toContain('aria-invalid="true"');
});
