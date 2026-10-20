/* The chrome every demo page shares: the theme stylesheets, a navbar between
   the pages and an Appearance drawer driven by the theme module. A real app
   imports the same modules from the package: `@ninoverse/hmi-components/wc/<name>`
   (`/<name>` from v6). The demo imports them from source, so it builds without
   the package. */

import '../../public/css/themes/constants.css';
import '../../public/css/themes/color/default.css';
import '../../public/css/themes/color/ocean.css';
import '../../public/css/themes/color/forest.css';
import '../../public/css/themes/structure/default.css';
import '../../public/css/themes/structure/rounded.css';
import '../../public/css/themes/structure/sharp.css';
import '../../public/css/themes/structure/pixel.css';
import '../../public/css/themes/structure/journal.css';
import '../../public/css/themes/material/glass.css';
import '../../public/css/themes/material/liquid.css';
import '../../public/css/base.css';
import './shell.css';
import '../../src/elements/button/button.js';
import '../../src/elements/drawer/drawer.js';
import '../../src/elements/navbar/navbar.js';
import '../../src/elements/radio-group/radio-group.js';
import type { HmiDrawer } from '../../src/elements/drawer/drawer.js';
import type { HmiNavbar } from '../../src/elements/navbar/navbar.js';
import type { HmiRadioGroup } from '../../src/elements/radio-group/radio-group.js';
import {
    colorThemes,
    getTheme,
    materials,
    restoreTheme,
    setTheme,
    structures,
    subscribe,
    type ThemeChange,
    type ThemeState,
} from '../../src/elements/shared/theme.js';

/** The pages, in the order the navbar shows them. */
const PAGES = [
    { value: 'home', label: 'Overview', path: '' },
    { value: 'dashboard', label: 'Dashboard', path: 'dashboard/' },
    { value: 'control', label: 'Control panel', path: 'control/' },
    { value: 'settings', label: 'Settings', path: 'settings/' },
    { value: 'inbox', label: 'Inbox', path: 'inbox/' },
    { value: 'all', label: 'All elements', path: 'all/' },
] as const;

export type DemoPage = (typeof PAGES)[number]['value'];

const AXES: {
    axis: keyof ThemeState;
    label: string;
    values: readonly string[];
}[] = [
    { axis: 'theme', label: 'Colour', values: colorThemes },
    { axis: 'structure', label: 'Structure', values: structures },
    { axis: 'material', label: 'Material', values: materials },
];

/**
 * Puts the navbar and the Appearance drawer at the top of the page and applies
 * the saved theme. `root` is the path from this page to /demo/.
 */
export function mountShell(page: DemoPage, root: string): void {
    restoreTheme();

    const nav = document.createElement('hmi-navbar') as HmiNavbar;
    nav.brand = 'HMI components';
    nav.label = 'Demo pages';
    nav.current = page;
    nav.links = [
        ...PAGES.map(({ value, label, path }) => ({
            value,
            label,
            href: `${root}${path}`,
        })),
        { value: 'storybook', label: 'Storybook', href: '/' },
    ];

    const appearance = document.createElement('hmi-button');
    appearance.slot = 'right';
    appearance.variant = 'ghost';
    appearance.size = 'small';
    appearance.textContent = 'Appearance';
    nav.append(appearance);

    const drawer = document.createElement('hmi-drawer') as HmiDrawer;
    drawer.side = 'right';
    drawer.heading = 'Appearance';
    drawer.description = 'Saved in this browser, for every demo page.';
    const panel = document.createElement('div');
    panel.className = 'demo-theme-panel';
    const groups = AXES.map(({ axis, label, values }) => {
        const group = document.createElement(
            'hmi-radio-group',
        ) as HmiRadioGroup;
        group.label = label;
        group.options = values.map((value) => ({ value, label: value }));
        group.addEventListener('hmi-change', (event) => {
            const { value } = (event as CustomEvent<{ value: string }>).detail;
            setTheme({ [axis]: value } as ThemeChange);
        });
        panel.append(group);
        return { axis, group };
    });
    drawer.append(panel);

    const show = (state: ThemeState) => {
        for (const { axis, group } of groups) group.value = state[axis];
    };
    show(getTheme());
    subscribe(show);

    appearance.addEventListener('click', () => {
        drawer.open = true;
    });
    drawer.addEventListener('hmi-close', () => {
        drawer.open = false;
    });

    document.body.prepend(nav, drawer);
}
