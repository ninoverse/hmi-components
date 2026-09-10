// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './avatar-stack.js';

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
    expect(out).toContain('aria-label="2 more"');
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
