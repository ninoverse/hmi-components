// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './tooltip.js';

it('renders declarative shadow DOM with the trigger slot, the label and the closed bubble on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-tooltip label="Copy" side="bottom" delay="0">
                <button slot="trigger">Hover</button>
            </hmi-tooltip>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toMatch(/<slot\s+name="trigger"/);
    expect(out).toContain('part="trigger"');
    expect(out).toContain('part="base"');
    expect(out).toContain('popover="hint"');
    expect(out).toContain('role="tooltip"');
    expect(out).toMatch(/<slot\s+name="label"/);
    expect(out).toContain('Copy');
});

it('renders an open tooltip without throwing: it is shown in the browser, never on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-tooltip open label="Copy"><button slot="trigger">Hover</button></hmi-tooltip>`,
        ),
    );
    expect(out).toContain('popover="hint"');
});
