// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './sidebar.js';

it('renders declarative shadow DOM with the groups on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-sidebar
                current="inbox"
                .groups=${[
                    {
                        label: 'Mail',
                        items: [
                            { value: 'inbox', label: 'Inbox', badge: '12' },
                            { value: 'sent', label: 'Sent', href: '/sent' },
                        ],
                    },
                ]}
            ></hmi-sidebar>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<aside');
    expect(out).toContain('aria-label="Sidebar"');
    expect(out).toContain('Mail');
    expect(out).toContain('aria-current="page"');
    expect(out).toContain('Inbox');
    expect(out).toContain('name="item-sent"');
    expect(out).toContain('<hmi-badge');
});
