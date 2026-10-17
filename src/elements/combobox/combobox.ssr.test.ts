// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './combobox.js';

it('renders declarative shadow DOM with the field and the options on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-combobox
                label="City"
                hint="Start typing"
                placeholder="Search cities…"
                value="paris"
                .options=${[
                    {
                        value: 'amsterdam',
                        label: 'Amsterdam',
                        description: 'Netherlands',
                    },
                    { value: 'paris', label: 'Paris', description: 'France' },
                ]}
            ></hmi-combobox>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('part="input"');
    expect(out).toContain('role="combobox"');
    expect(out).toContain('placeholder="Search cities…"');
    expect(out).toContain('City');
    expect(out).toContain('Start typing');
    // The list is closed on the server, and holds every option.
    expect(out).toContain('popover="manual"');
    expect(out).toContain('role="listbox"');
    expect(out).toContain('role="option"');
    expect(out).toContain('Amsterdam');
    expect(out).toContain('Netherlands');
    expect(out).toContain('aria-selected="true"');
});

it('renders the empty message on the server while there are no options', async () => {
    const out = await collectResult(
        render(
            html`<hmi-combobox empty-message="Nothing here"></hmi-combobox>`,
        ),
    );
    expect(out).toContain('part="empty"');
    expect(out).toContain('Nothing here');
});
