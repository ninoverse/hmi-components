// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './segmented-control.js';

it('renders declarative shadow DOM with a radio group of segments on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-segmented-control
                label="View"
                hint="Pick one"
                value="grid"
                .options=${[
                    { value: 'list', label: 'List' },
                    { value: 'grid', label: 'Grid' },
                ]}
            ></hmi-segmented-control>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="radiogroup"');
    expect(out).toContain('role="radio"');
    expect(out).toContain('aria-checked="true"');
    expect(out).toContain('View');
    expect(out).toContain('Pick one');
});
