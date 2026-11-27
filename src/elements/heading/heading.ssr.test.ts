// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import './heading.js';
import { Heading } from './heading.react.js';

it('renders declarative shadow DOM with the inner heading on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-heading level="3" tone="muted">Title</hmi-heading>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<h3');
    expect(out).toContain('part="base"');
    expect(out).toContain('Title');
});

/* The sizes and tones select on the host's attributes, so the server writes
   them for properties too. */
it('reflects the properties it is styled by on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-heading .level=${1} .size=${'small'} .tone=${'primary'}
                >Title</hmi-heading
            >`,
        ),
    );
    expect(out).toMatch(/<hmi-heading[^>]*\slevel="1"/);
    expect(out).toMatch(/<hmi-heading[^>]*\ssize="small"/);
    expect(out).toMatch(/<hmi-heading[^>]*\stone="primary"/);
    expect(out).toContain('<h1');
});

/* @lit/react renders the bare tag on the server: its properties reach the
   element when it hydrates. */
it('renders the React wrapper on the server', () => {
    const out = renderToString(createElement(Heading, { level: 3 }, 'Title'));
    expect(out).toMatch(/^<hmi-heading[^>]*>Title<\/hmi-heading>$/);
});
