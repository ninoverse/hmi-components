// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './checkbox.js';

it('renders declarative shadow DOM with the input and label on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-checkbox
                label="Accept terms"
                hint="Read them first"
                checked
            ></hmi-checkbox>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('type="checkbox"');
    expect(out).toContain('part="box"');
    expect(out).toContain('Accept terms');
    expect(out).toContain('Read them first');
});

it('writes the checked attribute only while checked, so an unchecked checkbox draws unchecked before it hydrates', async () => {
    const off = await collectResult(
        render(html`<hmi-checkbox></hmi-checkbox>`),
    );
    const on = await collectResult(
        render(html`<hmi-checkbox checked></hmi-checkbox>`),
    );
    expect(off).toMatch(/<input(?![^>]*\bchecked)[^>]*>/);
    expect(on).toMatch(/<input[^>]*\schecked[\s/>]/);
    expect(`${off}${on}`).not.toContain('checked="');
});
