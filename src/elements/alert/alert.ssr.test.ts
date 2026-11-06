// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import './alert.js';
import { Alert } from './alert.react.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-alert variant="warning"
                ><span slot="title">Heads up</span>Disk almost full.</hmi-alert
            >`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('<svg');
    expect(out).toContain('Disk almost full.');
});

/* @lit/react renders the bare tag on the server: `variant` reaches the element
   when it hydrates. */
it('renders the React wrapper on the server', () => {
    const out = renderToString(
        createElement(Alert, { variant: 'danger' }, 'Upload failed'),
    );
    expect(out).toMatch(/^<hmi-alert[^>]*>Upload failed<\/hmi-alert>$/);
});
