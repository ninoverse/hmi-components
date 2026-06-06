/* Web Components entry — registers every exported component as a light-DOM
   custom element via @r2wc/react-to-web-component. This is the IIFE drop-in
   bundle entry: importing it auto-registers all <hmi-*> elements on load.

   globals.css is imported here (not just the per-component styled CSS) so the
   bundled stylesheet carries the `html { font-size: 8px }` base that all rem
   sizing depends on. */

import r2wc from '@r2wc/react-to-web-component';
import {
    type ComponentType,
    createElement,
    type FunctionComponent,
} from 'react';
import './globals.css';
import * as hmi from './index';

/** r2wc attribute-coercion types we use (a subset of r2wc's transforms). */
type WcType = 'string' | 'number' | 'boolean' | 'function' | 'json';

/** Symbol used to stash author-provided light-DOM markup on the host element
   before r2wc mounts React into it (which replaces the host's children). */
const CAPTURED = Symbol('hmi.children');

interface ElementWithCapture extends HTMLElement {
    [CAPTURED]?: string;
}

/** Base element type produced by r2wc, exposing the lifecycle hook we override. */
interface ReactiveElement extends HTMLElement {
    connectedCallback(): void;
}

/**
 * Wrap a React component so the host element's initial markup (captured before
 * r2wc takes over the container) is rendered as React `children`. r2wc passes
 * the host element to the component as the `container` prop, which we read the
 * stashed markup from. Without this, child content authored in HTML would be
 * discarded when React mounts into the host.
 */
function withChildren<P extends object>(
    Component: ComponentType<P>,
): FunctionComponent<P> {
    return function ChildrenWrapper(props: P) {
        const { container, ...rest } = props as P & {
            container?: ElementWithCapture;
        };
        const html = container ? container[CAPTURED] : undefined;
        const children = html
            ? createElement('span', {
                  style: { display: 'contents' },
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: reproduces the host element's own author-provided light-DOM markup
                  dangerouslySetInnerHTML: { __html: html },
              })
            : undefined;
        return createElement(Component, rest as P, children);
    };
}

/**
 * Register one component as an `hmi-<name>` custom element. `props` maps
 * camelCase prop names to r2wc coercion types so kebab-case attributes are
 * parsed correctly. Guarded against double-registration.
 */
function define<P extends object>(
    name: string,
    Component: ComponentType<P>,
    props: Partial<Record<Extract<keyof P, string>, WcType>> = {},
): void {
    const tag = `hmi-${name}`;
    if (customElements.get(tag)) return;

    const Base = r2wc(withChildren(Component), { props }) as unknown as {
        new (): ReactiveElement;
    };

    class HmiElement extends Base {
        #captured = false;

        override connectedCallback(): void {
            if (!this.#captured) {
                this.#captured = true;
                const html = this.innerHTML.trim();
                if (html) {
                    (this as ElementWithCapture)[CAPTURED] = html;
                }
            }
            super.connectedCallback();
        }
    }

    customElements.define(tag, HmiElement as CustomElementConstructor);
}

/** Define every component. Tag names mirror the kebab keys in package.json. */
function registerAll(): void {
    define('accordion', hmi.Accordion, {
        items: 'json',
        multiple: 'boolean',
        defaultOpen: 'json',
    });
    define('alert', hmi.Alert, {
        variant: 'string',
        title: 'json',
        action: 'json',
    });
    define('area-chart', hmi.AreaChart, {
        series: 'json',
        labels: 'json',
        width: 'number',
        height: 'number',
        min: 'number',
        max: 'number',
        yTicks: 'number',
        'aria-label': 'string',
    });
    define('aspect-ratio', hmi.AspectRatio, { ratio: 'string' });
    define('avatar', hmi.Avatar, {
        name: 'string',
        src: 'string',
        size: 'string',
        status: 'string',
    });
    define('avatar-stack', hmi.AvatarStack, {
        names: 'json',
        max: 'number',
        size: 'string',
    });
    define('badge', hmi.Badge, { variant: 'string', dot: 'boolean' });
    define('banner', hmi.Banner, {
        variant: 'string',
        title: 'json',
        icon: 'json',
        action: 'json',
        onDismiss: 'function',
        dismissLabel: 'string',
    });
    define('bar-chart', hmi.BarChart, {
        series: 'json',
        labels: 'json',
        width: 'number',
        height: 'number',
        min: 'number',
        max: 'number',
        yTicks: 'number',
        'aria-label': 'string',
    });
    define('blockquote', hmi.Blockquote, { cite: 'json' });
    define('box', hmi.Box, {
        as: 'string',
        background: 'string',
        padding: 'string',
        radius: 'string',
        bordered: 'boolean',
    });
    define('breadcrumbs', hmi.Breadcrumbs, {
        items: 'json',
        separator: 'json',
    });
    define('bullet-chart', hmi.BulletChart, {
        value: 'number',
        target: 'number',
        max: 'number',
        min: 'number',
        ranges: 'json',
        color: 'string',
        label: 'string',
        width: 'number',
        height: 'number',
        'aria-label': 'string',
    });
    define('button', hmi.Button, {
        variant: 'string',
        size: 'string',
        leftIcon: 'json',
        rightIcon: 'json',
        asIcon: 'boolean',
        disabled: 'boolean',
        type: 'string',
    });
    define('card', hmi.Card, { variant: 'string' });
    define('carousel', hmi.Carousel, {
        slides: 'json',
        index: 'number',
        defaultIndex: 'number',
        onIndexChange: 'function',
        loop: 'boolean',
        autoPlay: 'number',
        showArrows: 'boolean',
        showDots: 'boolean',
        'aria-label': 'string',
    });
    define('cartesian-grid', hmi.CartesianGrid, {
        width: 'number',
        height: 'number',
        rows: 'number',
        cols: 'number',
        padding: 'number',
        horizontal: 'boolean',
        vertical: 'boolean',
    });
    define('chart-tooltip', hmi.ChartTooltip, {
        title: 'json',
        items: 'json',
    });
    define('checkbox', hmi.Checkbox, {
        label: 'json',
        checked: 'boolean',
        disabled: 'boolean',
        name: 'string',
        value: 'string',
    });
    define('chip', hmi.Chip, {
        selected: 'boolean',
        icon: 'json',
        onSelect: 'function',
        onClose: 'function',
    });
    define('code', hmi.Code, { block: 'boolean' });
    define('color-picker', hmi.ColorPicker, {
        value: 'string',
        defaultValue: 'string',
        onChange: 'function',
        swatches: 'json',
        disabled: 'boolean',
        showInput: 'boolean',
        'aria-label': 'string',
    });
    define('combobox', hmi.Combobox, {
        value: 'string',
        defaultValue: 'string',
        onChange: 'function',
        options: 'json',
        placeholder: 'string',
        disabled: 'boolean',
        filterOption: 'function',
        emptyMessage: 'json',
        'aria-label': 'string',
    });
    define('command-palette', hmi.CommandPalette, {
        open: 'boolean',
        onOpenChange: 'function',
        commands: 'json',
        placeholder: 'string',
        emptyMessage: 'json',
        'aria-label': 'string',
    });
    define('confirm-dialog', hmi.ConfirmDialog, {
        open: 'boolean',
        onCancel: 'function',
        onConfirm: 'function',
        title: 'json',
        description: 'json',
        confirmLabel: 'json',
        cancelLabel: 'json',
        variant: 'string',
        loading: 'boolean',
        confirmDisabled: 'boolean',
    });
    define('context-menu', hmi.ContextMenu, { menu: 'json' });
    define('date-picker', hmi.DatePicker, {
        mode: 'string',
        value: 'json',
        defaultValue: 'json',
        onChange: 'function',
        min: 'json',
        max: 'json',
        placeholder: 'string',
        disabled: 'boolean',
        'aria-label': 'string',
    });
    define('divider', hmi.Divider, {
        orientation: 'string',
        align: 'string',
    });
    define('donut-chart', hmi.DonutChart, {
        segments: 'json',
        size: 'number',
        thickness: 'number',
        gap: 'number',
        centerLabel: 'json',
        'aria-label': 'string',
    });
    define('drawer', hmi.Drawer, {
        open: 'boolean',
        onClose: 'function',
        side: 'string',
        size: 'string',
        title: 'json',
        description: 'json',
        actions: 'json',
    });
    define('empty-state', hmi.EmptyState, {
        icon: 'json',
        title: 'json',
        description: 'json',
        action: 'json',
    });
    define('file-upload', hmi.FileUpload, {
        value: 'json',
        defaultValue: 'json',
        onChange: 'function',
        accept: 'string',
        multiple: 'boolean',
        disabled: 'boolean',
        label: 'string',
        hint: 'string',
        'aria-label': 'string',
    });
    define('flex', hmi.Flex, {
        as: 'string',
        direction: 'string',
        align: 'string',
        justify: 'string',
        gap: 'string',
        wrap: 'boolean',
        inline: 'boolean',
    });
    define('form-control', hmi.FormControl, {
        label: 'json',
        hint: 'json',
        error: 'json',
    });
    define('funnel-chart', hmi.FunnelChart, {
        stages: 'json',
        width: 'number',
        height: 'number',
        gap: 'number',
        labelWidth: 'number',
        showValues: 'boolean',
        'aria-label': 'string',
    });
    define('gauge', hmi.Gauge, {
        value: 'number',
        min: 'number',
        max: 'number',
        color: 'string',
        trackColor: 'string',
        thickness: 'number',
        size: 'number',
        label: 'json',
        'aria-label': 'string',
    });
    define('grid', hmi.Grid, {
        as: 'string',
        columns: 'string',
        gap: 'string',
    });
    define('heading', hmi.Heading, {
        level: 'number',
        size: 'string',
        tone: 'string',
        truncate: 'boolean',
    });
    define('heatmap', hmi.Heatmap, {
        data: 'json',
        xLabels: 'json',
        yLabels: 'json',
        color: 'string',
        min: 'number',
        max: 'number',
        cellSize: 'number',
        gap: 'number',
        showValues: 'boolean',
        'aria-label': 'string',
    });
    define('hover-card', hmi.HoverCard, {
        trigger: 'json',
        side: 'string',
        align: 'string',
        openDelay: 'number',
        closeDelay: 'number',
        width: 'string',
    });
    define('image', hmi.Image, {
        src: 'string',
        alt: 'string',
        ratio: 'number',
        fit: 'string',
        radius: 'string',
        width: 'string',
        height: 'string',
        fallback: 'json',
        loading: 'string',
    });
    define('input', hmi.Input, {
        leftIcon: 'json',
        rightIcon: 'json',
        error: 'boolean',
        value: 'string',
        placeholder: 'string',
        disabled: 'boolean',
        type: 'string',
        name: 'string',
    });
    define('kbd', hmi.Kbd, { size: 'string' });
    define('legend', hmi.Legend, { items: 'json', align: 'string' });
    define('line-chart', hmi.LineChart, {
        series: 'json',
        labels: 'json',
        width: 'number',
        height: 'number',
        min: 'number',
        max: 'number',
        yTicks: 'number',
        showDots: 'boolean',
        'aria-label': 'string',
    });
    define('link', hmi.Link, {
        underline: 'string',
        tone: 'string',
        href: 'string',
        target: 'string',
    });
    define('list', hmi.List, {
        items: 'json',
        draggable: 'boolean',
        onReorder: 'function',
        renderItem: 'function',
    });
    define('menu', hmi.Menu);
    define('meter', hmi.Meter, {
        value: 'number',
        min: 'number',
        max: 'number',
        low: 'number',
        high: 'number',
        optimum: 'number',
        label: 'json',
        showValue: 'boolean',
    });
    define('modal', hmi.Modal, {
        open: 'boolean',
        onClose: 'function',
        title: 'json',
        description: 'json',
        size: 'string',
        actions: 'json',
    });
    define('multi-input', hmi.MultiInput, {
        length: 'number',
        groupSize: 'number',
        separator: 'string',
        value: 'string',
        defaultValue: 'string',
        onChange: 'function',
        onComplete: 'function',
        type: 'string',
        mask: 'boolean',
        disabled: 'boolean',
        readOnly: 'boolean',
        autoFocus: 'boolean',
        autoComplete: 'string',
        'aria-label': 'string',
    });
    define('navbar', hmi.Navbar, {
        brand: 'json',
        links: 'json',
        current: 'string',
        onNav: 'function',
        right: 'json',
        'aria-label': 'string',
    });
    define('number-input', hmi.NumberInput, {
        value: 'number',
        defaultValue: 'number',
        min: 'number',
        max: 'number',
        step: 'number',
        error: 'boolean',
        onChange: 'function',
        disabled: 'boolean',
        placeholder: 'string',
    });
    define('pagination', hmi.Pagination, {
        page: 'number',
        total: 'number',
        onChange: 'function',
    });
    define('password-input', hmi.PasswordInput, {
        leftIcon: 'json',
        error: 'boolean',
        value: 'string',
        placeholder: 'string',
        disabled: 'boolean',
    });
    define('popover', hmi.Popover, {
        open: 'boolean',
        onOpenChange: 'function',
        trigger: 'json',
        align: 'string',
        width: 'string',
    });
    define('progress', hmi.Progress, {
        value: 'number',
        indeterminate: 'boolean',
        label: 'string',
    });
    define('radar-chart', hmi.RadarChart, {
        axes: 'json',
        series: 'json',
        size: 'number',
        min: 'number',
        max: 'number',
        rings: 'number',
        'aria-label': 'string',
    });
    define('radio', hmi.Radio, {
        label: 'json',
        checked: 'boolean',
        disabled: 'boolean',
        name: 'string',
        value: 'string',
    });
    define('radio-group', hmi.RadioGroup, {
        name: 'string',
        value: 'string',
        defaultValue: 'string',
        options: 'json',
        onChange: 'function',
    });
    define('responsive-container', hmi.ResponsiveContainer, {
        height: 'number',
        aspect: 'number',
    });
    define('scatter-plot', hmi.ScatterPlot, {
        series: 'json',
        width: 'number',
        height: 'number',
        xMin: 'number',
        xMax: 'number',
        yMin: 'number',
        yMax: 'number',
        xTicks: 'number',
        yTicks: 'number',
        radius: 'number',
        'aria-label': 'string',
    });
    define('scroll-area', hmi.ScrollArea, {
        orientation: 'string',
        maxHeight: 'string',
    });
    define('search-input', hmi.SearchInput, {
        error: 'boolean',
        value: 'string',
        placeholder: 'string',
        disabled: 'boolean',
    });
    define('segmented-control', hmi.SegmentedControl, {
        value: 'string',
        defaultValue: 'string',
        onChange: 'function',
        options: 'json',
        size: 'string',
        fullWidth: 'boolean',
        disabled: 'boolean',
        'aria-label': 'string',
    });
    define('select', hmi.Select, {
        value: 'string',
        defaultValue: 'string',
        onChange: 'function',
        options: 'json',
        placeholder: 'json',
        align: 'string',
        disabled: 'boolean',
    });
    define('sidebar', hmi.Sidebar, {
        groups: 'json',
        current: 'string',
        onNav: 'function',
        'aria-label': 'string',
    });
    define('skeleton', hmi.Skeleton, {
        variant: 'string',
        width: 'string',
        height: 'string',
        radius: 'string',
    });
    define('slider', hmi.Slider, {
        value: 'number',
        defaultValue: 'number',
        min: 'number',
        max: 'number',
        step: 'number',
        showValue: 'boolean',
        formatValue: 'function',
        onChange: 'function',
        disabled: 'boolean',
    });
    define('spacer', hmi.Spacer, {
        size: 'string',
        axis: 'string',
        grow: 'boolean',
    });
    define('sparkline', hmi.Sparkline, {
        data: 'json',
        width: 'number',
        height: 'number',
        color: 'string',
        strokeWidth: 'number',
        area: 'boolean',
        showDot: 'boolean',
        min: 'number',
        max: 'number',
        'aria-label': 'string',
    });
    define('spinner', hmi.Spinner, { size: 'string', label: 'string' });
    define('stat', hmi.Stat, {
        label: 'json',
        value: 'json',
        icon: 'json',
        trend: 'string',
        delta: 'json',
        helpText: 'json',
    });
    define('stepper', hmi.Stepper, {
        steps: 'json',
        current: 'string',
        onChange: 'function',
        orientation: 'string',
        spacing: 'string',
    });
    define('switch', hmi.Switch, {
        label: 'json',
        checked: 'boolean',
        disabled: 'boolean',
        name: 'string',
        value: 'string',
    });
    define('table', hmi.Table, {
        columns: 'json',
        rows: 'json',
        sortable: 'boolean',
        getRowKey: 'function',
    });
    define('tabs', hmi.Tabs, {
        value: 'string',
        onChange: 'function',
        options: 'json',
        variant: 'string',
    });
    define('text', hmi.Text, {
        as: 'string',
        size: 'string',
        weight: 'string',
        tone: 'string',
        align: 'string',
        truncate: 'boolean',
    });
    define('textarea', hmi.Textarea, {
        error: 'boolean',
        value: 'string',
        placeholder: 'string',
        disabled: 'boolean',
        rows: 'number',
        name: 'string',
    });
    define('timeline', hmi.Timeline, { items: 'json' });
    define('toast', hmi.ToastHost);
    define('tooltip', hmi.Tooltip, {
        label: 'json',
        side: 'string',
        delay: 'number',
    });
    define('tree', hmi.Tree, {
        nodes: 'json',
        defaultExpanded: 'json',
        selected: 'string',
        defaultSelected: 'string',
        onSelect: 'function',
        'aria-label': 'string',
    });
    define('value-scale-selector', hmi.ValueScaleSelector, {
        value: 'number',
        defaultValue: 'number',
        onChange: 'function',
        max: 'number',
        allowHalf: 'boolean',
        icon: 'json',
        valueText: 'function',
        readOnly: 'boolean',
        disabled: 'boolean',
        size: 'string',
        'aria-label': 'string',
    });
    define('visually-hidden', hmi.VisuallyHidden, { as: 'string' });
}

/* Register as soon as the bundle runs. Loaded at the end of <body> (or with
   `defer`), every element authored above the script is already fully parsed, so
   each upgrades with its child markup present. Registering eagerly (rather than
   waiting for DOMContentLoaded) also means elements are defined before any
   following consumer script sets properties on them. */
if (typeof customElements !== 'undefined') {
    registerAll();
}
