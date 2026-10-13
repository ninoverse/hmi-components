// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './confirm-dialog.js';

it('renders declarative shadow DOM with the modal and its two buttons on the server', async () => {
    const out = await collectResult(
        render(
            html`<hmi-confirm-dialog
                open
                heading="Delete the project?"
                confirm-label="Delete"
                variant="danger"
            ></hmi-confirm-dialog>`,
        ),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('<hmi-modal');
    expect(out).toContain(
        'exportparts="base, panel, title, description, actions"',
    );
    expect(out).toContain('part="cancel"');
    expect(out).toContain('part="confirm"');
    expect(out).toContain('variant="danger"');
    expect(out).toContain('Delete');
    expect(out).toContain('Cancel');
});
