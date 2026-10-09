// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './tree.js';

it('renders declarative shadow DOM with the expanded nodes on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-tree
                selected="main"
                .expanded=${['src']}
                .nodes=${[
                    {
                        value: 'src',
                        label: 'src',
                        children: [
                            { value: 'main', label: 'main.ts', badge: 'M' },
                            { value: 'util', label: 'util.ts' },
                        ],
                    },
                    {
                        value: 'docs',
                        label: 'docs',
                        children: [{ value: 'a', label: 'a.md' }],
                    },
                ]}
            ></hmi-tree>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('role="tree"');
    expect(out).toContain('aria-label="Tree"');
    expect(out).toContain('role="group"');
    expect(out).toContain('main.ts');
    expect(out).toContain('aria-expanded="true"');
    expect(out).toContain('aria-expanded="false"');
    expect(out).toContain('aria-selected="true"');
    expect(out).not.toContain('a.md');
    expect(out).toContain('<hmi-badge');
});
