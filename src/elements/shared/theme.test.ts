import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    colorThemes,
    defaultTheme,
    getColorThemes,
    getTheme,
    materials,
    registerColorTheme,
    restoreTheme,
    setTheme,
    structures,
    subscribe,
} from './theme.js';

const root = document.documentElement;
const AXES = ['theme', 'structure', 'material'] as const;

function clean() {
    for (const axis of AXES) {
        root.removeAttribute(`data-${axis}`);
        localStorage.removeItem(`hmi-${axis}`);
    }
}

// Every listener a test adds, stopped after it, so that a failing test does
// not leave one behind for the next.
const stops: (() => void)[] = [];

function listen(listener: Parameters<typeof subscribe>[0]) {
    const stop = subscribe(listener);
    stops.push(stop);
    return stop;
}

beforeEach(clean);

afterEach(() => {
    for (const stop of stops.splice(0)) stop();
    clean();
    vi.restoreAllMocks();
});

// A MutationObserver reports in a microtask.
const settle = () => new Promise((resolve) => setTimeout(resolve));

const attrs = () => ({
    theme: root.getAttribute('data-theme'),
    structure: root.getAttribute('data-structure'),
    material: root.getAttribute('data-material'),
});

const saved = () => ({
    theme: localStorage.getItem('hmi-theme'),
    structure: localStorage.getItem('hmi-structure'),
    material: localStorage.getItem('hmi-material'),
});

describe('the lists', () => {
    it('re-exports the built-in axes', () => {
        expect(colorThemes).toEqual(['default', 'ocean', 'forest']);
        expect(structures).toContain('journal');
        expect(materials).toEqual(['solid', 'glass', 'liquid']);
    });
});

describe('getTheme', () => {
    it('is the defaults on a page with no attributes', () => {
        expect(getTheme()).toEqual({
            theme: 'default',
            structure: 'default',
            material: 'solid',
        });
        expect(defaultTheme).toEqual(getTheme());
    });

    it('reads the attributes on <html>', () => {
        root.setAttribute('data-theme', 'ocean');
        root.setAttribute('data-structure', 'journal');
        root.setAttribute('data-material', 'glass');
        expect(getTheme()).toEqual({
            theme: 'ocean',
            structure: 'journal',
            material: 'glass',
        });
    });

    it('reads a colour theme as it stands, and a structure or material only if it is built in', () => {
        root.setAttribute('data-theme', 'not-registered');
        root.setAttribute('data-structure', 'bespoke');
        root.setAttribute('data-material', 'bespoke');
        expect(getTheme()).toEqual({
            theme: 'not-registered',
            structure: 'default',
            material: 'solid',
        });
        root.setAttribute('data-theme', '');
        expect(getTheme().theme).toBe('default');
    });

    it('is the same object until an axis changes', () => {
        const first = getTheme();
        expect(getTheme()).toBe(first);
        root.setAttribute('data-theme', 'forest');
        const second = getTheme();
        expect(second).not.toBe(first);
        expect(getTheme()).toBe(second);
        root.setAttribute('data-theme', 'forest');
        expect(getTheme()).toBe(second);
    });

    it('cannot be changed by a caller', () => {
        expect(Object.isFrozen(getTheme())).toBe(true);
        expect(Object.isFrozen(defaultTheme)).toBe(true);
    });
});

describe('setTheme', () => {
    it('sets the attributes and saves the choices under the v5 keys', () => {
        setTheme({ theme: 'ocean', structure: 'sharp', material: 'liquid' });
        expect(attrs()).toEqual({
            theme: 'ocean',
            structure: 'sharp',
            material: 'liquid',
        });
        expect(saved()).toEqual({
            theme: 'ocean',
            structure: 'sharp',
            material: 'liquid',
        });
        expect(getTheme()).toEqual({
            theme: 'ocean',
            structure: 'sharp',
            material: 'liquid',
        });
    });

    it('changes the axes it is given and leaves the others', () => {
        setTheme({ theme: 'forest', material: 'glass' });
        setTheme({ structure: 'pixel' });
        expect(attrs()).toEqual({
            theme: 'forest',
            structure: 'pixel',
            material: 'glass',
        });
        setTheme({});
        setTheme({ theme: undefined });
        expect(getTheme().theme).toBe('forest');
    });

    it('checks each axis on its own and ignores one that is not a known value, with no error', () => {
        setTheme({ theme: 'ocean' });
        expect(() =>
            setTheme({
                theme: 'unknown',
                structure: 'bogus' as never,
                material: 'glass',
            }),
        ).not.toThrow();
        expect(attrs()).toEqual({
            theme: 'ocean',
            structure: null,
            material: 'glass',
        });
        expect(saved()).toEqual({
            theme: 'ocean',
            structure: null,
            material: 'glass',
        });
    });

    it('ignores an empty value and one that is not a string', () => {
        setTheme({ theme: '', material: 3 as never, structure: null as never });
        expect(attrs()).toEqual({
            theme: null,
            structure: null,
            material: null,
        });
    });

    it('still applies the choice when storage refuses it', () => {
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new DOMException('blocked', 'SecurityError');
        });
        expect(() => setTheme({ theme: 'forest' })).not.toThrow();
        expect(root.getAttribute('data-theme')).toBe('forest');
        expect(getTheme().theme).toBe('forest');
    });
});

describe('registerColorTheme', () => {
    it('lets setTheme take a colour theme that was added, and not before', () => {
        setTheme({ theme: 'midnight' });
        expect(root.getAttribute('data-theme')).toBeNull();
        registerColorTheme('midnight');
        setTheme({ theme: 'midnight' });
        expect(root.getAttribute('data-theme')).toBe('midnight');
        expect(saved().theme).toBe('midnight');
    });

    it('lists the built-in themes, then the registered ones, each once', () => {
        registerColorTheme('dusk', 'dusk', '', 'ocean', 'dawn');
        const list = getColorThemes();
        expect(list.slice(0, 3)).toEqual([...colorThemes]);
        expect(list.filter((name) => name === 'dusk')).toHaveLength(1);
        expect(list).toContain('dawn');
        expect(list).not.toContain('');
        expect(list.filter((name) => name === 'ocean')).toHaveLength(1);
    });

    it('returns the same array until something is added', () => {
        registerColorTheme('twilight');
        const list = getColorThemes();
        registerColorTheme('twilight');
        expect(getColorThemes()).toBe(list);
        registerColorTheme('sunrise');
        expect(getColorThemes()).not.toBe(list);
    });
});

describe('restoreTheme', () => {
    it('applies the saved choices', () => {
        localStorage.setItem('hmi-theme', 'forest');
        localStorage.setItem('hmi-structure', 'rounded');
        localStorage.setItem('hmi-material', 'glass');
        restoreTheme();
        expect(attrs()).toEqual({
            theme: 'forest',
            structure: 'rounded',
            material: 'glass',
        });
        expect(getTheme().material).toBe('glass');
    });

    it('overrides what the shell set, and keeps it where nothing is saved', () => {
        root.setAttribute('data-theme', 'forest');
        root.setAttribute('data-structure', 'sharp');
        localStorage.setItem('hmi-theme', 'ocean');
        restoreTheme();
        expect(attrs()).toEqual({
            theme: 'ocean',
            structure: 'sharp',
            material: null,
        });
    });

    it('skips a saved value that is not a known one', () => {
        root.setAttribute('data-structure', 'sharp');
        localStorage.setItem('hmi-theme', 'nope');
        localStorage.setItem('hmi-structure', 'bogus');
        localStorage.setItem('hmi-material', '');
        restoreTheme();
        expect(attrs()).toEqual({
            theme: null,
            structure: 'sharp',
            material: null,
        });
    });

    it('skips a saved custom theme until it is registered', () => {
        localStorage.setItem('hmi-theme', 'late-bloomer');
        restoreTheme();
        expect(root.getAttribute('data-theme')).toBeNull();
        registerColorTheme('late-bloomer');
        restoreTheme();
        expect(root.getAttribute('data-theme')).toBe('late-bloomer');
    });

    it('does not throw when storage cannot be read', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new DOMException('blocked', 'SecurityError');
        });
        root.setAttribute('data-theme', 'ocean');
        expect(() => restoreTheme()).not.toThrow();
        expect(getTheme().theme).toBe('ocean');
    });
});

describe('subscribe', () => {
    it('tells a listener the new state at once when setTheme changes it', () => {
        const listener = vi.fn();
        const stop = listen(listener);
        setTheme({ theme: 'ocean' });
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenLastCalledWith({
            theme: 'ocean',
            structure: 'default',
            material: 'solid',
        });
        expect(listener.mock.calls[0]?.[0]).toBe(getTheme());
        stop();
    });

    it('tells it once, however many times the attribute is set afterwards', async () => {
        const listener = vi.fn();
        const stop = listen(listener);
        setTheme({ theme: 'ocean' });
        await settle();
        expect(listener).toHaveBeenCalledTimes(1);
        setTheme({ theme: 'ocean' });
        root.setAttribute('data-theme', 'ocean');
        await settle();
        expect(listener).toHaveBeenCalledTimes(1);
        stop();
    });

    it('tells it of a change made by anything else', async () => {
        const listener = vi.fn();
        const stop = listen(listener);
        root.setAttribute('data-structure', 'journal');
        await settle();
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenLastCalledWith(
            expect.objectContaining({ structure: 'journal' }),
        );
        root.removeAttribute('data-structure');
        await settle();
        expect(listener).toHaveBeenLastCalledWith(
            expect.objectContaining({ structure: 'default' }),
        );
        stop();
    });

    it('is not told of an attribute value that reads the same', async () => {
        const listener = vi.fn();
        const stop = listen(listener);
        root.setAttribute('data-material', 'bespoke');
        await settle();
        expect(listener).not.toHaveBeenCalled();
        stop();
    });

    it('stops when asked, and stopping twice is harmless', async () => {
        const listener = vi.fn();
        const stop = listen(listener);
        stop();
        stop();
        setTheme({ theme: 'forest' });
        root.setAttribute('data-structure', 'sharp');
        await settle();
        expect(listener).not.toHaveBeenCalled();
    });

    it('keeps listening for the others while one stops, even the same function twice', async () => {
        const listener = vi.fn();
        const other = vi.fn();
        const stopFirst = listen(listener);
        const stopSecond = listen(listener);
        const stopOther = listen(other);
        setTheme({ theme: 'ocean' });
        expect(listener).toHaveBeenCalledTimes(2);
        stopFirst();
        setTheme({ theme: 'forest' });
        expect(listener).toHaveBeenCalledTimes(3);
        expect(other).toHaveBeenCalledTimes(2);
        stopSecond();
        stopOther();
        root.setAttribute('data-theme', 'ocean');
        await settle();
        expect(listener).toHaveBeenCalledTimes(3);
        expect(other).toHaveBeenCalledTimes(2);
    });

    it('survives a listener that stops itself', () => {
        const other = vi.fn();
        const stopOther = listen(other);
        const stop = listen(() => stop());
        expect(() => setTheme({ theme: 'ocean' })).not.toThrow();
        expect(other).toHaveBeenCalledTimes(1);
        stopOther();
    });
});

describe("another tab's choice", () => {
    const fromOtherTab = (key: string, newValue: string | null) =>
        window.dispatchEvent(new StorageEvent('storage', { key, newValue }));

    it('is applied while something subscribes, and the subscriber is told', () => {
        const listener = vi.fn();
        const stop = listen(listener);
        fromOtherTab('hmi-theme', 'forest');
        fromOtherTab('hmi-material', 'liquid');
        expect(attrs()).toEqual({
            theme: 'forest',
            structure: null,
            material: 'liquid',
        });
        expect(listener).toHaveBeenCalledTimes(2);
        expect(listener).toHaveBeenLastCalledWith({
            theme: 'forest',
            structure: 'default',
            material: 'liquid',
        });
        stop();
    });

    it('is ignored when it is not a known value, is a removal, or is another key', () => {
        const listener = vi.fn();
        const stop = listen(listener);
        root.setAttribute('data-theme', 'ocean');
        fromOtherTab('hmi-theme', 'nope');
        fromOtherTab('hmi-structure', null);
        fromOtherTab('hmi-material', '');
        fromOtherTab('something-else', 'glass');
        expect(attrs()).toEqual({
            theme: 'ocean',
            structure: null,
            material: null,
        });
        stop();
    });

    it('is left alone when nothing subscribes', () => {
        const stop = listen(() => undefined);
        stop();
        fromOtherTab('hmi-theme', 'forest');
        expect(root.getAttribute('data-theme')).toBeNull();
    });
});
