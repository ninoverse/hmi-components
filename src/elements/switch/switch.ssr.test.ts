// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './switch.js';

it('renders declarative shadow DOM with the input and label on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-switch
                label="Accept terms"
                hint="Read them first"
                checked
            ></hmi-switch>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('type="checkbox"');
    expect(out).toContain('part="track"');
    expect(out).toContain('Accept terms');
    expect(out).toContain('Read them first');
});

it('writes the checked attribute only while checked, so an unchecked switch draws unchecked before it hydrates', async () => {
    const off = await collectResult(render(html`<hmi-switch></hmi-switch>`));
    const on = await collectResult(
        render(html`<hmi-switch checked></hmi-switch>`),
    );
    expect(off).toMatch(/<input(?![^>]*\bchecked)[^>]*>/);
    expect(on).toMatch(/<input[^>]*\schecked[\s/>]/);
    expect(`${off}${on}`).not.toContain('checked="');
});
