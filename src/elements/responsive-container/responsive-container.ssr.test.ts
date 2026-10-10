// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './responsive-container.js';

it('renders declarative shadow DOM with the slot and the fixed height on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-responsive-container height="160"><p>chart</p></hmi-responsive-container>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<slot');
    expect(out).toContain('height: 160px');
    expect(out).toContain('--container-height: 160px');
    expect(out).not.toContain('--container-width');
    expect(out).toContain('chart');
});
