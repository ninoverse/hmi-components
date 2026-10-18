// @vitest-environment node
import { expect, it } from 'vitest';
import {
    defaultTheme,
    getColorThemes,
    getTheme,
    registerColorTheme,
    restoreTheme,
    setTheme,
    subscribe,
} from './theme.js';

it('imports in Node without a document, and reports the defaults', () => {
    expect(typeof document).toBe('undefined');
    expect(getTheme()).toBe(defaultTheme);
    expect(defaultTheme).toEqual({
        theme: 'default',
        structure: 'default',
        material: 'solid',
    });
});

it('writes, restores and listens to nothing, and does not throw', () => {
    expect(() => {
        setTheme({ theme: 'ocean', structure: 'journal', material: 'glass' });
        restoreTheme();
    }).not.toThrow();
    expect(getTheme()).toBe(defaultTheme);
    const stop = subscribe(() => {
        throw new Error('nothing changes on the server');
    });
    expect(() => stop()).not.toThrow();
});

it('still keeps the list of colour themes', () => {
    registerColorTheme('midnight');
    expect(getColorThemes()).toEqual([
        'default',
        'ocean',
        'forest',
        'midnight',
    ]);
});
