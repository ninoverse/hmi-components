// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './code.js';

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
