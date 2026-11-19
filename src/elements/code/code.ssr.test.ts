// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import './code.js';
import { Code } from './code.react.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-code block>const x = 1;</hmi-code>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('part="content"');
    expect(out).toContain('const x = 1;');
});

it('renders the inline variant without the content part', async () => {
    const out = await collectResult(
        render(html`<hmi-code>pnpm add @ninoverse/hmi-components</hmi-code>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).not.toContain('part="content"');
    expect(out).toContain('pnpm add @ninoverse/hmi-components');
});

/* @lit/react renders the bare tag on the server: `block` reaches the
   element when it hydrates. */
it('renders the React wrapper on the server', () => {
    const out = renderToString(
        createElement(Code, { block: true }, 'const x = 1;'),
    );
    expect(out).toMatch(/^<hmi-code[^>]*>const x = 1;<\/hmi-code>$/);
});
