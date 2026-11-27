// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import './flex.js';
import { Flex } from './flex.react.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-flex direction="column" gap="small" wrap
                ><span>One</span><span>Two</span></hmi-flex
            >`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<slot>');
    expect(out).toContain('direction="column"');
    expect(out).toContain('One');
});

/* @lit/react renders the bare tag on the server: its properties reach the
   element when it hydrates. */
it('renders the React wrapper on the server', () => {
    const out = renderToString(
        createElement(Flex, { direction: 'column' }, 'One'),
    );
    expect(out).toMatch(/^<hmi-flex[^>]*>One<\/hmi-flex>$/);
});
