import { html, render } from 'lit';
import { afterEach, describe, expect, it } from 'vitest';
import type { ButtonSize } from '../button/button.js';
import { type DialogAction, renderDialogActions } from './dialog-actions.js';

function mount(
    actions: DialogAction[],
    onAction: (value: string) => void,
    size?: ButtonSize,
) {
    const host = document.createElement('div');
    document.body.append(host);
    render(html`${renderDialogActions(actions, onAction, size)}`, host);
    return Array.from(host.querySelectorAll('hmi-button'));
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('renderDialogActions', () => {
    it('renders a button per action, in order, with its label', () => {
        const buttons = mount(
            [
                { label: 'Cancel', value: 'cancel' },
                { label: 'Save', value: 'save', variant: 'primary' },
            ],
            () => {},
        );
        expect(buttons.map((b) => b.textContent?.trim())).toEqual([
            'Cancel',
            'Save',
        ]);
    });

    it('defaults the variant to secondary', () => {
        const [button, danger] = mount(
            [
                { label: 'A', value: 'a' },
                { label: 'B', value: 'b', variant: 'danger' },
            ],
            () => {},
        );
        expect(button?.getAttribute('variant')).toBe('secondary');
        expect(danger?.getAttribute('variant')).toBe('danger');
    });

    it('calls onAction with the value of the activated action', () => {
        const values: string[] = [];
        const [, save] = mount(
            [
                { label: 'Cancel', value: 'cancel' },
                { label: 'Save', value: 'save' },
            ],
            (value) => values.push(value),
        );
        save?.click();
        expect(values).toEqual(['save']);
    });

    it('sets the size of every button only when one is given', () => {
        const actions = [
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
        ];
        expect(
            mount(actions, () => {}).map((b) => b.hasAttribute('size')),
        ).toEqual([false, false]);
        expect(
            mount(actions, () => {}, 'small').map((b) =>
                b.getAttribute('size'),
            ),
        ).toEqual(['small', 'small']);
    });

    it('renders nothing for no actions', () => {
        expect(mount([], () => {})).toHaveLength(0);
    });
});
