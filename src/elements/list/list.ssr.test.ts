// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './list.js';

it('renders declarative shadow DOM with the rows on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-list
                reorderable
                .items=${[
                    {
                        id: 1,
                        title: 'Inbox',
                        subtitle: '12 unread',
                        right: 'Live',
                    },
                    { id: 2, title: 'Drafts', avatar: 'Ada Lovelace' },
                ]}
            ></hmi-list>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<ul');
    expect(out).toContain('Inbox');
    expect(out).toContain('12 unread');
    expect(out).toContain('Live');
    expect(out).toContain('part="handle"');
    expect(out).toContain('name="title-1"');
});
