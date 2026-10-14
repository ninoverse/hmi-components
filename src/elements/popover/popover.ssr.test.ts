// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './popover.js';

it('renders declarative shadow DOM with the trigger slot and the closed panel on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-popover align="end" width="320">
                <button slot="trigger">Open</button>
                Content
            </hmi-popover>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toMatch(/<slot\s+name="trigger"/);
    expect(out).toContain('part="trigger"');
    expect(out).toContain('part="base panel"');
    expect(out).toContain('popover="auto"');
    expect(out).toContain('Content');
});

it('renders an open popover without throwing: it is shown in the browser, never on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-popover open><button slot="trigger">Open</button>x</hmi-popover>`,
        ),
    );
    expect(out).toContain('popover="auto"');
});
