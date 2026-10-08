// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './navbar.js';

it('renders declarative shadow DOM with the brand and links on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-navbar
                brand="Ninoverse"
                current="reports"
                .links=${[
                    { value: 'overview', label: 'Overview', href: '/' },
                    { value: 'reports', label: 'Reports', badge: '3' },
                ]}
            ></hmi-navbar>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<nav');
    expect(out).toContain('aria-label="Main"');
    expect(out).toContain('Ninoverse');
    expect(out).toContain('aria-current="page"');
    expect(out).toContain('Overview');
    expect(out).toContain('name="item-reports"');
    expect(out).toContain('<hmi-badge');
});
