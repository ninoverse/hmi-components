// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import './avatar-stack.js';
import { AvatarStack } from './avatar-stack.react.js';

const NAMES = ['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Linus Torvalds'];

/* Lit separates a literal from an interpolation with marker comments, so the
   chip ships as `+<!--lit-part-->2<!--/lit-part-->`. Strip the comments before
   asserting on text. */
const text = (markup: string) => markup.replace(/<!--.*?-->/gs, '');

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-avatar-stack
                .names=${NAMES}
                max=${2}
                size="large"
            ></hmi-avatar-stack>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('part="overflow"');
    expect(out).toContain('role="group"');
    expect(out).toContain('aria-label="4 people"');
    expect(out).toContain('aria-label="2 more: Grace Hopper, Linus Torvalds"');
    expect(text(out)).toContain('+2');
});

it('renders one nested hmi-avatar per shown name, with the size applied', async () => {
    const out = await collectResult(
        render(
            html`<hmi-avatar-stack
                .names=${NAMES}
                max=${2}
                size="large"
            ></hmi-avatar-stack>`,
        ),
    );
    expect([...out.matchAll(/<hmi-avatar[\s>]/g)]).toHaveLength(2);
    expect([...out.matchAll(/name="([^"]+)"/g)].map((m) => m[1])).toEqual([
        'Ada Lovelace',
        'Alan Turing',
    ]);
    // The nested avatars render their own shadow roots, initials included.
    expect(text(out)).toContain('AL');
    expect(text(out)).toContain('AT');
    expect([...out.matchAll(/size="large"/g)].length).toBeGreaterThanOrEqual(3);
});

it('renders no chip when the names fit', async () => {
    const out = await collectResult(
        render(html`<hmi-avatar-stack .names=${NAMES}></hmi-avatar-stack>`),
    );
    expect(out).not.toContain('part="overflow"');
    expect([...out.matchAll(/<hmi-avatar[\s>]/g)]).toHaveLength(4);
});

it('renders through the React wrapper on the server', () => {
    const out = renderToString(
        createElement(AvatarStack, { names: NAMES, max: 2 }),
    );
    expect(out).toMatch(/^<hmi-avatar-stack[^>]*><\/hmi-avatar-stack>$/);
});
