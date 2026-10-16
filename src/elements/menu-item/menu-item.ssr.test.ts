// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './menu-item.js';

it('renders declarative shadow DOM with the button, its slots and the shortcut on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-menu-item danger shortcut="⌫">Delete</hmi-menu-item>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('role="menuitem"');
    expect(out).toMatch(/<slot\s+name="icon"/);
    expect(out).toMatch(/<slot\s+name="shortcut"/);
    expect(out).toContain('⌫');
    expect(out).toContain('Delete');
});

it('renders a disabled item with a disabled button', async () => {
    const out = await collectResult(
        render(html`<hmi-menu-item disabled>Save</hmi-menu-item>`),
    );
    expect(out).toMatch(/<button[^>]*\sdisabled/);
});
