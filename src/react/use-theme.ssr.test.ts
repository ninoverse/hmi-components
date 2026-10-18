// @vitest-environment node
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { useTheme } from './use-theme.js';

function Probe() {
    const { theme, structure, material } = useTheme();
    return createElement('output', null, `${theme}/${structure}/${material}`);
}

it('renders the defaults on the server, with no document and no provider', () => {
    expect(typeof document).toBe('undefined');
    const out = renderToString(createElement(Probe));
    expect(out).toContain('default/default/solid');
});
