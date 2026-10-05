import { describe, expect, it } from 'vitest';
import { coerceFormValue, syncValidity } from './form.js';

const host = (attrs: Record<string, string> = {}) => {
    const el = document.createElement('div');
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
};

describe('coerceFormValue', () => {
    it('submits text and numbers as strings and nothing for null or undefined', () => {
        expect(coerceFormValue('text', 'abc', host())).toBe('abc');
        expect(coerceFormValue('text', '', host())).toBe('');
        expect(coerceFormValue('numeric', 3.5, host())).toBe('3.5');
        expect(coerceFormValue('numeric', 0, host())).toBe('0');
        expect(coerceFormValue('numeric', null, host())).toBeNull();
        expect(coerceFormValue('text', undefined, host())).toBeNull();
    });

    it('submits an object or array as JSON', () => {
        expect(coerceFormValue('text', ['a', 'b'], host())).toBe('["a","b"]');
        expect(coerceFormValue('text', { a: 1 }, host())).toBe('{"a":1}');
    });

    it('submits a checkable control as its value attribute or "on", and nothing when unchecked', () => {
        expect(coerceFormValue('checkable', true, host())).toBe('on');
        expect(coerceFormValue('checkable', true, host({ value: 'yes' }))).toBe(
            'yes',
        );
        expect(coerceFormValue('checkable', false, host())).toBeNull();
    });
});

describe('syncValidity', () => {
    function fakeInternals() {
        const calls: unknown[][] = [];
        return {
            calls,
            internals: {
                setValidity: (...args: unknown[]) => calls.push(args),
            } as unknown as ElementInternals,
        };
    }

    it('mirrors the native control, anchored on it', () => {
        const input = document.createElement('input');
        input.required = true;
        const { calls, internals } = fakeInternals();
        syncValidity(internals, input, '');
        expect(calls).toHaveLength(1);
        const [flags, message, anchor] = calls[0] as [
            ValidityState,
            string,
            Element,
        ];
        expect(flags.valueMissing).toBe(true);
        expect(message).toBe(input.validationMessage);
        expect(anchor).toBe(input);
    });

    it('lets a non-empty error override the native validity', () => {
        const input = document.createElement('input');
        const { calls, internals } = fakeInternals();
        syncValidity(internals, input, 'Taken');
        expect(calls[0]).toEqual([{ customError: true }, 'Taken', input]);
    });

    it('clears the validity when there is no control and no error', () => {
        const { calls, internals } = fakeInternals();
        syncValidity(internals, null, '');
        expect(calls[0]).toEqual([{}]);
    });
});
