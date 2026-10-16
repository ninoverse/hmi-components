// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './table.js';

it('renders declarative shadow DOM with the headers and rows on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-table
                sort-key="commits"
                sort-dir="desc"
                row-key="id"
                .columns=${[
                    { key: 'name', label: 'Name' },
                    {
                        key: 'commits',
                        label: 'Commits',
                        style: { textAlign: 'right' },
                    },
                    {
                        key: 'status',
                        label: 'Status',
                        kind: 'badge',
                        badgeVariant: { active: 'success' },
                    },
                    {
                        key: 'id',
                        label: 'Profile',
                        kind: 'link',
                        href: '/people/{id}',
                    },
                ]}
                .rows=${[
                    { id: 'ada', name: 'Ada', commits: 142, status: 'active' },
                    {
                        id: 'alan',
                        name: 'Alan',
                        commits: 87,
                        status: 'pending',
                    },
                ]}
            ></hmi-table>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('<table');
    expect(out).toContain('Commits');
    expect(out).toContain('aria-sort="descending"');
    expect(out).toContain('text-align:right');
    expect(out).toContain('name="cell-ada-name"');
    expect(out).toContain('Ada');
    expect(out).toContain('<hmi-badge');
    expect(out).toContain('variant="success"');
    expect(out).toContain('/people/ada');
    // Sorted by commits, descending: Ada's row comes before Alan's.
    expect(out.indexOf('cell-ada-name')).toBeLessThan(
        out.indexOf('cell-alan-name'),
    );
});
