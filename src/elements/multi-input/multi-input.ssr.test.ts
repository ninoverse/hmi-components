// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './multi-input.js';

it('renders declarative shadow DOM with a group of cells on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-multi-input
                label="Code"
                length="4"
                group-size="2"
                hint="Four digits"
            ></hmi-multi-input>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="group"');
    expect(out).toContain('part="cell"');
    expect(out).toContain('part="separator"');
    expect(out).toContain('aria-label="Segment 4 of 4"');
    expect(out).toContain('Code');
    expect(out).toContain('Four digits');
});
