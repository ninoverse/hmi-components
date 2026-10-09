// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './tabs.js';

it('renders declarative shadow DOM with the tabs on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-tabs
                value="mine"
                .options=${[
                    { value: 'all', label: 'All' },
                    { value: 'mine', label: 'Mine', badge: '3' },
                ]}
            ></hmi-tabs>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="tablist"');
    expect(out).toContain('role="tab"');
    expect(out).toContain('aria-selected="true"');
    expect(out).toContain('All');
    expect(out).toContain('name="badge-mine"');
    expect(out).toContain('<hmi-badge');
});
