// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './breadcrumbs.js';

it('renders declarative shadow DOM with the trail on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-breadcrumbs
                separator="›"
                .items=${[{ label: 'Home', href: '/' }, { label: 'Settings' }]}
            ></hmi-breadcrumbs>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<nav');
    expect(out).toContain('aria-label="Breadcrumb"');
    expect(out).toContain('href="/"');
    expect(out).toContain('aria-current="page"');
    expect(out).toContain('Settings');
});
