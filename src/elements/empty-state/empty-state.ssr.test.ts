// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import './empty-state.js';
import { EmptyState } from './empty-state.react.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-empty-state
                ><span slot="title">No results</span
                ><span slot="description">Try another search.</span></hmi-empty-state
            >`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('<h3');
    expect(out).toContain('Try another search.');
});

/* The server can't see what is slotted, so it renders the heading and the
   actions' row; the element hides either on the client if its slot is empty. */
it('renders the heading at its level and the actions row on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-empty-state level="2"
                ><span slot="title">No results</span
                ><button slot="action">Reset</button></hmi-empty-state
            >`,
        ),
    );
    expect(out).toContain('<h2');
    expect(out).not.toMatch(/<h2[^>]*hidden/);
    expect(out).toContain('part="actions"');
    expect(out).toContain('aria-hidden="true"');
});

/* @lit/react renders the bare tag on the server: the properties reach the
   element when it hydrates. */
it('renders the React wrapper on the server', () => {
    const out = renderToString(
        createElement(
            EmptyState,
            { level: 2 },
            createElement('span', { slot: 'title' }, 'No results'),
        ),
    );
    expect(out).toMatch(
        /^<hmi-empty-state[^>]*><span slot="title">No results<\/span><\/hmi-empty-state>$/,
    );
});
