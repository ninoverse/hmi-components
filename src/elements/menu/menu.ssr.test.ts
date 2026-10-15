// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './menu.js';

it('renders declarative shadow DOM with the named menu and its slot on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-menu label="Actions"><button>Edit</button></hmi-menu>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('role="menu"');
    expect(out).toContain('aria-label="Actions"');
    expect(out).toContain('<slot');
    expect(out).toContain('Edit');
});

it('renders an unnamed menu without an aria-label', async () => {
    const out = await collectResult(render(html`<hmi-menu></hmi-menu>`));
    expect(out).toContain('role="menu"');
    expect(out).not.toContain('aria-label');
});
