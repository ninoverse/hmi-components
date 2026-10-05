// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './number-input.js';

it('renders declarative shadow DOM with the label, field and steppers on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-number-input
                name="qty"
                label="Quantity"
                hint="Between 1 and 99"
                min="1"
                max="99"
                value="3"
            ></hmi-number-input>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="control"');
    expect(out).toContain('type="number"');
    expect(out).toContain('part="increase"');
    expect(out).toContain('part="decrease"');
    expect(out).toContain('Quantity');
    expect(out).toContain('Between 1 and 99');
    expect(out).toContain('min="1"');
    expect(out).toContain('max="99"');
});

it('renders the error as an alert and marks the field invalid', async () => {
    const out = await collectResult(
        render(html`<hmi-number-input error="Too many"></hmi-number-input>`),
    );
    expect(out).toContain('role="alert"');
    expect(out).toContain('Too many');
    expect(out).toContain('aria-invalid="true"');
});
