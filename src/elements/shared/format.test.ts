import { describe, expect, it } from 'vitest';
import { applyTemplate } from './format.js';

describe('applyTemplate', () => {
    it('substitutes every placeholder', () => {
        expect(
            applyTemplate('{value}% of {max}', { value: 40, max: 100 }),
        ).toBe('40% of 100');
    });

    it('leaves an unknown placeholder visible', () => {
        expect(applyTemplate('{value} {foo}', { value: 1 })).toBe('1 {foo}');
    });

    it('stringifies zero and empty values rather than dropping them', () => {
        expect(applyTemplate('{a}|{b}', { a: 0, b: '' })).toBe('0|');
    });
});
