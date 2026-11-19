// @vitest-environment node
import { readFileSync } from 'node:fs';
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import './kbd.js';
import { Kbd } from './kbd.react.js';

const css = (path: string) =>
    readFileSync(
        new URL(`../../../public/css/${path}`, import.meta.url),
        'utf8',
    );

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-kbd size="small">Ctrl</hmi-kbd>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('Ctrl');
});

/* The server can't see what is slotted, so it draws the cap; the element
   hides it on the client if the slot and the label are both empty. */
it('renders the cap and the label on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-kbd label="Command">⌘</hmi-kbd>`),
    );
    expect(out).not.toMatch(/<kbd[^>]*hidden/);
    expect(out).toContain('aria-hidden="true"');
    expect(out).toContain('Command');
});

/* @lit/react renders the bare tag on the server: the properties reach the
   element when it hydrates. */
it('renders the React wrapper on the server', () => {
    const out = renderToString(
        createElement(Kbd, { size: 'small', label: 'Control' }, 'Ctrl'),
    );
    expect(out).toMatch(/^<hmi-kbd[^>]*>Ctrl<\/hmi-kbd>$/);
});

describe('the key cap fonts', () => {
    it('base.css draws the arrows and key symbols from a system symbol font', () => {
        const face = css('base.css').match(
            /@font-face\s*{[^}]*font-family:\s*hmi-key-symbols;[^}]*}/,
        )?.[0];
        expect(face).toBeDefined();
        expect(face).toContain("local('Apple Symbols')");
        expect(face).toContain("local('Segoe UI Symbol')");
        expect(face).toMatch(/unicode-range:\s*U\+2190-21FF, U\+2300-23FF/);
        expect(face).not.toContain('url(');
    });

    it.each([
        'structure/journal.css',
        'structure/pixel.css',
    ])('%s sets --kbd-font to the body font', (file) => {
        expect(css(`themes/${file}`)).toContain(
            '--kbd-font: var(--font-default);',
        );
    });
});
