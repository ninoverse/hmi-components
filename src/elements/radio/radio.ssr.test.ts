// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './radio.js';

it('renders declarative shadow DOM with a radio input and label on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-radio name="size" value="md" label="Medium" checked></hmi-radio>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('type="radio"');
    expect(out).toContain('part="box"');
    expect(out).toContain('Medium');
});
