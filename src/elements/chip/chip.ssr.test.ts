// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import './chip.js';
import { Chip } from './chip.react.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-chip selectable closable selected>Filter</hmi-chip>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('part="control"');
    expect(out).toContain('aria-pressed="true"');
    expect(out).toContain('part="check"');
    expect(out).toContain('part="close"');
    expect(out).toContain('aria-labelledby="close-label label"');
    expect(out).toContain('Filter');
});

/* @lit/react renders the bare tag on the server: the properties reach the
   element when it hydrates. */
it('renders the React wrapper on the server', () => {
    const out = renderToString(
        createElement(
            Chip,
            { selectable: true, closable: true, selected: true },
            'Filter',
        ),
    );
    expect(out).toMatch(/^<hmi-chip[^>]*>Filter<\/hmi-chip>$/);
});
