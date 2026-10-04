// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './divider.js';

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
