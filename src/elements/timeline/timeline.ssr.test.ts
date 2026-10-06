// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './timeline.js';

it('renders declarative shadow DOM with the events on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-timeline
                divider
                .items=${[
                    { title: 'Deployed', time: '09:24', color: 'success' },
                    { title: 'Reviewed', description: 'Looks good' },
                ]}
            ></hmi-timeline>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<ol');
    expect(out).toContain('data-color="success"');
    expect(out).toContain('Deployed');
    expect(out).toContain('09:24');
    expect(out).toContain('Looks good');
});
