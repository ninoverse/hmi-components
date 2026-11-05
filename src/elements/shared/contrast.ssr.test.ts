// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/* The text tokens on every surface token, in each colour theme, light and
   dark, meet WCAG AA for body text: 4.5:1. Elements set small text in
   `--on-surface` and `--on-surface-variant` on any surface, so a pair below
   it fails wherever an element puts it. */
const themes = ['default', 'ocean', 'forest'];
const texts = ['--on-surface', '--on-surface-variant'];

function tokens(block = ''): Map<string, string> {
    return new Map(
        [...block.matchAll(/(--[a-z0-9-]+):\s*(#[0-9a-f]{6})\b/gi)].map(
            ([, name = '', value = '']) => [name, value],
        ),
    );
}

function luminance(hex: string): number {
    const channel = (i: number) => {
        const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrast(a: string, b: string): number {
    const [x, y] = [luminance(a), luminance(b)];
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

describe('text tokens meet AA on every surface', () => {
    for (const theme of themes) {
        const css = readFileSync(
            new URL(
                `../../../public/css/themes/color/${theme}.css`,
                import.meta.url,
            ),
            'utf8',
        );
        const [light, dark] = css.split(
            /@media \(prefers-color-scheme: dark\)/,
        );
        for (const [scheme, block] of [
            ['light', light],
            ['dark', dark],
        ] as const) {
            it(`${theme}, ${scheme}`, () => {
                const t = tokens(block);
                const surfaces = [...t].filter(([name]) =>
                    name.startsWith('--surface'),
                );
                expect(surfaces.length).toBeGreaterThan(0);
                const failing = texts.flatMap((text) =>
                    surfaces
                        .map(([name, value]) => ({
                            pair: `${text} on ${name}`,
                            ratio: contrast(t.get(text) as string, value),
                        }))
                        .filter(({ ratio }) => ratio < 4.5)
                        .map(
                            ({ pair, ratio }) => `${pair}: ${ratio.toFixed(2)}`,
                        ),
                );
                expect(failing).toEqual([]);
            });
        }
    }
});
