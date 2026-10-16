// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './context-menu.js';

it('renders declarative shadow DOM with the trigger and menu slots and the closed card on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-context-menu focus-on-open="always">
                <div slot="trigger">Right-click</div>
                <div slot="menu">Menu</div>
            </hmi-context-menu>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toMatch(/<slot\s+name="trigger"/);
    expect(out).toMatch(/<slot\s+name="menu"/);
    expect(out).toContain('part="trigger"');
    expect(out).toContain('part="base panel"');
    expect(out).toContain('popover="manual"');
    expect(out).toContain('Right-click');
});

it('renders an open context menu without throwing: it is shown in the browser, never on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-context-menu open
                ><div slot="trigger">T</div><div slot="menu">M</div></hmi-context-menu
            >`,
        ),
    );
    expect(out).toContain('popover="manual"');
});
