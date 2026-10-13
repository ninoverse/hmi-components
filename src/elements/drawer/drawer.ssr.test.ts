// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './drawer.js';

it('renders declarative shadow DOM with the dialog, its parts and its actions on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-drawer
                open
                side="left"
                heading="Filters"
                description="Tune the result set."
                .actions=${[{ label: 'Apply', value: 'apply', variant: 'primary' }]}
            >
                Body
            </hmi-drawer>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<dialog');
    expect(out).toContain('part="base panel"');
    expect(out).toContain('part="body"');
    expect(out).toContain('aria-labelledby="title"');
    expect(out).toContain('Filters');
    expect(out).toContain('Tune the result set.');
    expect(out).toContain('variant="primary"');
    expect(out).toContain('Apply');
});

it('renders the dialog closed: it opens in the browser, never on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-drawer open></hmi-drawer>`),
    );
    expect(out).not.toMatch(/<dialog[^>]*\sopen/);
});
