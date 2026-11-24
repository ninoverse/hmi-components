// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import './divider.js';
import { Divider } from './divider.react.js';

it('renders declarative shadow DOM on the server as a plain separator', async () => {
    const out = await collectResult(
        render(html`<hmi-divider orientation="vertical">OR</hmi-divider>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('role="separator"');
    expect(out).toContain('aria-orientation="vertical"');
    expect(out).toContain('OR');
});

/* @lit/react renders the bare tag on the server: its properties, `align`
   and `orientation`, reach the element when it hydrates. */
it('renders the React wrapper on the server', () => {
    const out = renderToString(
        createElement(Divider, { align: 'start' }, 'OR'),
    );
    expect(out).toMatch(/^<hmi-divider[^>]*>OR<\/hmi-divider>$/);
});
