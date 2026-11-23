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

it('writes the checked attribute only while checked, so an unchecked radio draws unchecked before it hydrates', async () => {
    const off = await collectResult(
        render(html`<hmi-radio value="a"></hmi-radio>`),
    );
    const on = await collectResult(
        render(html`<hmi-radio value="a" checked></hmi-radio>`),
    );
    expect(off).toMatch(/<input(?![^>]*\bchecked)[^>]*>/);
    expect(on).toMatch(/<input[^>]*\schecked[\s/>]/);
    expect(`${off}${on}`).not.toContain('checked="');
});
