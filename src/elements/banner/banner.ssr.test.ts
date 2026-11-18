// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import './banner.js';
import { Banner } from './banner.react.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-banner variant="warning" dismissible
                ><span slot="title">Heads up</span>Disk almost full.</hmi-banner
            >`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('role="alert"');
    expect(out).toContain('part="dismiss"');
    expect(out).toContain('Disk almost full.');
    expect(out).toContain('Warning:');
});

/* @lit/react renders the bare tag on the server: `variant` reaches the element
   when it hydrates. */
it('renders the React wrapper on the server', () => {
    const out = renderToString(
        createElement(Banner, { variant: 'danger' }, 'Upload failed'),
    );
    expect(out).toMatch(/^<hmi-banner[^>]*>Upload failed<\/hmi-banner>$/);
});
