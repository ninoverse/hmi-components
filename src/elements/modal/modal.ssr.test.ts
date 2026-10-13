// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './modal.js';

it('renders declarative shadow DOM with the dialog, its parts and its actions on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-modal
                open
                heading="Confirm publish"
                description="Visible to anyone."
                .actions=${[{ label: 'Save', value: 'save', variant: 'primary' }]}
            >
                Body
            </hmi-modal>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<dialog');
    expect(out).toContain('part="base panel"');
    expect(out).toContain('aria-labelledby="title"');
    expect(out).toContain('aria-describedby="description"');
    expect(out).toContain('Confirm publish');
    expect(out).toContain('Visible to anyone.');
    expect(out).toContain('variant="primary"');
    expect(out).toContain('Save');
    expect(out).toMatch(/<slot\s*>/);
});

it('renders the dialog closed: it opens in the browser, never on the server', async () => {
    const out = await collectResult(render(html`<hmi-modal open></hmi-modal>`));
    expect(out).not.toMatch(/<dialog[^>]*\sopen/);
});
