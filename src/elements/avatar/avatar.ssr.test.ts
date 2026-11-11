// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import './avatar.js';
import { Avatar } from './avatar.react.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-avatar
                name="Ada Lovelace"
                size="large"
                status="online"
            ></hmi-avatar>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('part="status"');
    expect(out).toContain('AL');
    expect(out).toContain('aria-label="Ada Lovelace, Online"');
});

it('keeps an emoji whole in the initials on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-avatar name="🦊 Fox"></hmi-avatar>`),
    );
    expect(out).toContain('🦊F');
});

/* @lit/react renders the bare tag on the server: `name` reaches the element
   when it hydrates. */
it('renders the React wrapper on the server', () => {
    const out = renderToString(
        createElement(Avatar, { name: 'Ada Lovelace', status: 'online' }),
    );
    expect(out).toMatch(/^<hmi-avatar[^>]*><\/hmi-avatar>$/);
});

it('hashes the tint identically on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-avatar name="Ada Lovelace"></hmi-avatar>`),
    );
    expect(out).toContain('#DEEFEC');
    expect(out).toContain('#1F5B58');
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="Ada Lovelace"');
});
