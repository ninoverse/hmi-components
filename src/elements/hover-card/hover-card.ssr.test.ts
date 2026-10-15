// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './hover-card.js';

it('renders declarative shadow DOM with the trigger slot and the closed card on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-hover-card side="top" align="start" width="280">
                <a slot="trigger" href="/ada">@ada</a>
                Ada Lovelace
            </hmi-hover-card>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toMatch(/<slot\s+name="trigger"/);
    expect(out).toContain('part="trigger"');
    expect(out).toContain('part="base panel"');
    expect(out).toContain('popover="hint"');
    expect(out).toContain('Ada Lovelace');
});

it('renders an open hover card without throwing: it is shown in the browser, never on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-hover-card open width="280"><a slot="trigger" href="/ada">@ada</a>x</hmi-hover-card>`,
        ),
    );
    expect(out).toContain('popover="hint"');
});
