// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './command-palette.js';

const COMMANDS = [
    { value: 'new-doc', label: 'New document', group: 'Create' },
    {
        value: 'go-settings',
        label: 'Go to settings',
        group: 'Navigation',
        shortcut: '⌘,',
    },
];

it('renders declarative shadow DOM with the closed dialog, the field and the commands on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-command-palette
                placeholder="Search…"
                .commands=${COMMANDS}
            ></hmi-command-palette>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<dialog');
    expect(out).toContain('part="base panel"');
    expect(out).toContain('aria-label="Command palette"');
    expect(out).toContain('role="combobox"');
    expect(out).toContain('placeholder="Search…"');
    expect(out).toContain('role="listbox"');
    expect(out).toContain('role="option"');
    expect(out).toContain('New document');
    expect(out).toContain('Navigation');
    expect(out).toContain('⌘,');
    // The dialog is closed: it is opened on the client, with showModal().
    expect(out).not.toMatch(/<dialog[^>]* open/);
});

it('renders the no-match message when there are no commands', async () => {
    const out = await collectResult(
        render(
            html`<hmi-command-palette
                empty-message="Nothing here"
            ></hmi-command-palette>`,
        ),
    );
    expect(out).toContain('part="empty"');
    expect(out).toContain('Nothing here');
});
