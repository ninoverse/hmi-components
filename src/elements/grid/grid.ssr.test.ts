// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import './grid.js';
import { Grid } from './grid.react.js';

it('renders declarative shadow DOM with the column template on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-grid columns="3" gap="medium"
                ><span>One</span><span>Two</span></hmi-grid
            >`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('--_columns:repeat(3, minmax(0, 1fr))');
    expect(out).toContain('One');
});

it('renders two tracks on the server without columns', async () => {
    const out = await collectResult(
        render(html`<hmi-grid columns=""><span>One</span></hmi-grid>`),
    );
    expect(out).toContain('--_columns:repeat(2, minmax(0, 1fr))');
});

/* @lit/react renders the bare tag on the server: its properties reach the
   element when it hydrates. */
it('renders the React wrapper on the server', () => {
    const out = renderToString(createElement(Grid, { columns: 3 }, 'One'));
    expect(out).toMatch(/^<hmi-grid[^>]*>One<\/hmi-grid>$/);
});
