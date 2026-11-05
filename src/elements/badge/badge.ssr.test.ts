// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import './badge.js';
import { Badge } from './badge.react.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-badge variant="success" dot>Online</hmi-badge>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('part="dot"');
    expect(out).toContain('Online');
});

/* @lit/react renders the bare tag on the server: its properties, `variant`
   and `dot`, reach the element when it hydrates. */
it('renders the React wrapper on the server', () => {
    const out = renderToString(
        createElement(Badge, { variant: 'success', dot: true }, 'Online'),
    );
    expect(out).toMatch(/^<hmi-badge[^>]*>Online<\/hmi-badge>$/);
});
