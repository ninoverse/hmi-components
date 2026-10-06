// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './accordion.js';

it('renders declarative shadow DOM with the sections on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-accordion
                .items=${[
                    { title: 'First', body: 'First body' },
                    { title: 'Second', body: 'Second body' },
                ]}
                .open=${[0]}
            ></hmi-accordion>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('aria-expanded="true"');
    expect(out).toContain('aria-expanded="false"');
    expect(out).toContain('First');
    expect(out).toContain('Second body');
});
