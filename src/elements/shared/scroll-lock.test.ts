import { afterEach, describe, expect, it } from 'vitest';
import { lockScroll } from './scroll-lock.js';

const overflow = () => document.documentElement.style.overflow;

afterEach(() => {
    document.documentElement.style.overflow = '';
});

describe('lockScroll', () => {
    it('hides the page overflow until released', () => {
        const unlock = lockScroll();
        expect(overflow()).toBe('hidden');
        unlock();
        expect(overflow()).toBe('');
    });

    it('gives back the overflow the page had', () => {
        document.documentElement.style.overflow = 'scroll';
        const unlock = lockScroll();
        expect(overflow()).toBe('hidden');
        unlock();
        expect(overflow()).toBe('scroll');
    });

    it('is counted: stacked locks release the page only when the last lets go', () => {
        const first = lockScroll();
        const second = lockScroll();
        first();
        expect(overflow()).toBe('hidden');
        second();
        expect(overflow()).toBe('');
    });

    it('ignores a second call to the same release', () => {
        const first = lockScroll();
        const second = lockScroll();
        first();
        first();
        expect(overflow()).toBe('hidden');
        second();
        expect(overflow()).toBe('');
    });
});
