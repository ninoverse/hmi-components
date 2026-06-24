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
    type ReactElement,
    useLayoutEffect,
    useRef,
} from 'react';
import './globals.css';
import * as hmi from './index';
import { HostElementContext } from './lib/portalTarget';

/** r2wc attribute-coercion types we use (a subset of r2wc's transforms). */
type WcType = 'string' | 'number' | 'boolean' | 'function' | 'json';

/** Marks a registration as a form-associated control and describes how its
   value maps to a submitted form value:
   - `text`     — string-valued controls (input, select, date-picker, …)
   - `numeric`  — number-valued controls (number-input, slider)
   - `checkable`— boolean controls (checkbox, radio, switch) */
type FormKind = 'text' | 'numeric' | 'checkable';

/** Symbol used to stash the host element's live light-DOM child nodes before
   r2wc mounts React into it (which detaches the host's children). Real node
   references — not a parsed HTML string — so interactive children keep their
   live properties (`value`, `checked`), event listeners, and framework
   bindings instead of being recreated. */
const CAPTURED = Symbol('hmi.children');

/** r2wc registers these symbols globally (`Symbol.for`), exposing its internal
   props object and render method to subclasses. */
const R2WC_PROPS = Symbol.for('r2wc.props');
const R2WC_RENDER = Symbol.for('r2wc.render');

/** Mirrors r2wc's camelCase prop → kebab-case attribute mapping exactly. */
function toDashedCase(camel: string): string {
    return camel.replace(
        /([a-z0-9])([A-Z])/g,
        (_match, lower: string, upper: string) =>
            `${lower}-${upper.toLowerCase()}`,
    );
}

interface ElementWithCapture extends HTMLElement {
    [CAPTURED]?: Node[];
}

/**
 * Render captured live light-DOM nodes by physically moving them into the React
 * tree via `appendChild` (which relocates rather than clones), preserving their
 * identity, properties, listeners, and bindings. The wrapper uses
 * `display: contents` so it adds no layout box. The cleanup detaches the nodes
 * so a remount (e.g. React StrictMode) can re-append the same references.
 */
function SlottedChildren({ nodes }: { nodes: Node[] }): ReactElement {
    const ref = useRef<HTMLSpanElement | null>(null);
    useLayoutEffect(() => {
        const host = ref.current;
        if (!host) return;
        for (const node of nodes) host.appendChild(node);
        return () => {
            for (const node of nodes) {
                if (node.parentNode === host) host.removeChild(node);
            }
        };
    }, [nodes]);
    return createElement('span', { style: { display: 'contents' }, ref });
}

/** Base element type produced by r2wc, exposing the lifecycle hooks we
   override plus its internal props object and render method. */
interface ReactiveElement extends HTMLElement {
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null,
    ): void;
    [R2WC_PROPS]: Record<string, unknown>;
    [R2WC_RENDER](): void;
}

/**
 * Wrap a React component so the host element's initial light-DOM children
 * (captured as live nodes before r2wc takes over the container) are projected
 * back into the React tree, and so descendants can discover the host element
 * for portal routing. r2wc passes the host element as the `container` prop.
 */
function withChildren<P extends object>(
    Component: ComponentType<P>,
): FunctionComponent<P> {
    return function ChildrenWrapper(props: P) {
        const { container, ...rest } = props as P & {
            container?: ElementWithCapture;
        };
        const nodes = container ? container[CAPTURED] : undefined;
        const children =
            nodes && nodes.length > 0
                ? createElement(SlottedChildren, { nodes })
                : undefined;
        return createElement(
            HostElementContext.Provider,
            { value: container ?? null },
            createElement(Component, rest as P, children),
        );
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
    events: Partial<Record<Extract<keyof P, string>, EventInit>> = {},
    form?: FormKind,
): void {
    const tag = `hmi-${name}`;
    if (customElements.get(tag)) return;

    const Base = r2wc(withChildren(Component), {
        props,
        events,
    }) as unknown as {
        new (): ReactiveElement;
    };

    const propNames = Object.keys(props) as Extract<keyof P, string>[];
    const attributeToProp = new Map<string, Extract<keyof P, string>>();
    for (const prop of propNames) attributeToProp.set(toDashedCase(prop), prop);

    class HmiElement extends Base {
        /* Read by the browser at customElements.define time. Only form
           registrations opt in, so attachInternals is never reached for the
           rest. */
        static formAssociated = form !== undefined;

        #captured = false;
        #internals?: ElementInternals;

        override connectedCallback(): void {
            /* Upgrade-properties pattern: a prop set as an own property before
               the element was defined shadows r2wc's prototype accessor and is
               never applied — re-route it through the accessor. Function props
               are skipped: r2wc replaces them internally with its CustomEvent
               dispatcher, which reassignment would clobber. */
            for (const prop of propNames) {
                if (props[prop] === 'function') continue;
                if (Object.hasOwn(this, prop)) {
                    const self = this as unknown as Record<string, unknown>;
                    const value = self[prop];
                    delete self[prop];
                    self[prop] = value;
                }
            }
            if (!this.#captured) {
                this.#captured = true;
                if (this.childNodes.length > 0) {
                    /* Hold live references to the author's child nodes. r2wc's
                       mount (in super.connectedCallback) detaches them from the
                       host, but the nodes — with their properties, listeners,
                       and bindings — survive and are re-projected by
                       SlottedChildren. */
                    (this as ElementWithCapture)[CAPTURED] = Array.from(
                        this.childNodes,
                    );
                }
            }
            super.connectedCallback();

            /* Attach ElementInternals so the control participates in a native
               <form>. The browser maps the host's `name` attribute to the
               FormData key; we only report the value. */
            if (
                form &&
                !this.#internals &&
                typeof this.attachInternals === 'function'
            ) {
                this.#internals = this.attachInternals();
                this.addEventListener('change', this.#onFormChange);
                this.#syncFromProps();
            }
        }

        override disconnectedCallback(): void {
            this.removeEventListener('change', this.#onFormChange);
            super.disconnectedCallback();
        }

        override attributeChangedCallback(
            name: string,
            oldValue: string | null,
            newValue: string | null,
        ): void {
            super.attributeChangedCallback(name, oldValue, newValue);
            /* r2wc drops empty-string and removed attribute values, so a
               controlled host can never clear a value. Apply them here: empty
               string and false are real values; removal reverts the prop to
               undefined (uncontrolled). */
            if (!newValue) {
                const prop = attributeToProp.get(name);
                if (prop !== undefined) {
                    const type = props[prop];
                    this[R2WC_PROPS][prop] =
                        newValue === null
                            ? undefined
                            : type === 'string'
                              ? ''
                              : type === 'boolean'
                                ? false
                                : undefined;
                    this[R2WC_RENDER]();
                }
            }
            /* Keep the submitted form value in step with a controlled host
               that sets value/checked through attributes. */
            if (this.#internals) this.#syncFromProps();
        }

        /* r2wc dispatches the React onChange as CustomEvent('change', {detail})
           on the host; `detail` is the new (possibly uncontrolled) value — the
           only signal of internal state. Native change events from inner
           <input>s also bubble here but are plain Events with no detail, so we
           ignore them. */
        #onFormChange = (event: Event): void => {
            if (!(event instanceof CustomEvent) || event.target !== this) {
                return;
            }
            this.#internals?.setFormValue(this.#coerce(event.detail));
        };

        #syncFromProps(): void {
            const bag = this[R2WC_PROPS];
            const detail =
                form === 'checkable'
                    ? (bag.checked ?? bag.defaultChecked ?? false)
                    : (bag.value ?? bag.defaultValue ?? null);
            this.#internals?.setFormValue(this.#coerce(detail));
        }

        #coerce(detail: unknown): string | null {
            if (form === 'checkable') {
                return detail ? (this.getAttribute('value') ?? 'on') : null;
            }
            if (detail === null || detail === undefined) return null;
            if (typeof detail === 'object') return JSON.stringify(detail);
            return String(detail);
        }
    }

    customElements.define(tag, HmiElement as CustomElementConstructor);
}

/** Define every component. Tag names mirror the kebab keys in package.json. */
function registerAll(): void {
    define(
        'accordion',
        hmi.Accordion,
        {
            items: 'json',
            multiple: 'boolean',
            open: 'json',
            defaultOpen: 'json',
            onOpenChange: 'function',
        },
        { onOpenChange: { bubbles: true } },
    );
    define('alert', hmi.Alert, {
        variant: 'string',
        title: 'string',
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
    define(
        'banner',
        hmi.Banner,
        {
            variant: 'string',
            title: 'string',
            icon: 'json',
            action: 'json',
            onDismiss: 'function',
            dismissLabel: 'string',
        },
        { onDismiss: { bubbles: true } },
    );
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
    define('blockquote', hmi.Blockquote, { cite: 'string' });
    define('box', hmi.Box, {
        as: 'string',
        background: 'string',
        padding: 'string',
        radius: 'string',
        bordered: 'boolean',
    });
    define('breadcrumbs', hmi.Breadcrumbs, {
        items: 'json',
        separator: 'string',
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
    define(
        'carousel',
        hmi.Carousel,
        {
            slides: 'json',
            index: 'number',
            defaultIndex: 'number',
            onIndexChange: 'function',
            loop: 'boolean',
            autoPlay: 'number',
            showArrows: 'boolean',
            showDots: 'boolean',
            'aria-label': 'string',
        },
        { onIndexChange: { bubbles: true } },
    );
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
        title: 'string',
        items: 'json',
    });
    define(
        'checkbox',
        hmi.Checkbox,
        {
            label: 'string',
            checked: 'boolean',
            defaultChecked: 'boolean',
            onChange: 'function',
            disabled: 'boolean',
            name: 'string',
            value: 'string',
        },
        { onChange: { bubbles: true } },
        'checkable',
    );
    define(
        'chip',
        hmi.Chip,
        {
            selected: 'boolean',
            icon: 'json',
            onSelect: 'function',
            onClose: 'function',
        },
        {
            onSelect: { bubbles: true },
            onClose: { bubbles: true },
        },
    );
    define('code', hmi.Code, { block: 'boolean' });
    define(
        'color-picker',
        hmi.ColorPicker,
        {
            value: 'string',
            defaultValue: 'string',
            onChange: 'function',
            swatches: 'json',
            disabled: 'boolean',
            showInput: 'boolean',
            'aria-label': 'string',
        },
        { onChange: { bubbles: true } },
        'text',
    );
    define(
        'combobox',
        hmi.Combobox,
        {
            value: 'string',
            defaultValue: 'string',
            onChange: 'function',
            options: 'json',
            placeholder: 'string',
            disabled: 'boolean',
            filterOption: 'function',
            emptyMessage: 'string',
            'aria-label': 'string',
        },
        { onChange: { bubbles: true } },
        'text',
    );
    define(
        'command-palette',
        hmi.CommandPalette,
        {
            open: 'boolean',
            onOpenChange: 'function',
            commands: 'json',
            placeholder: 'string',
            emptyMessage: 'string',
            onAction: 'function',
            'aria-label': 'string',
        },
        {
            onOpenChange: { bubbles: true },
            onAction: { bubbles: true },
        },
    );
    define(
        'confirm-dialog',
        hmi.ConfirmDialog,
        {
            open: 'boolean',
            onCancel: 'function',
            onConfirm: 'function',
            title: 'string',
            description: 'string',
            confirmLabel: 'string',
            cancelLabel: 'string',
            variant: 'string',
            loading: 'boolean',
            confirmDisabled: 'boolean',
        },
        {
            onCancel: { bubbles: true },
            onConfirm: { bubbles: true },
        },
    );
    define('context-menu', hmi.ContextMenu, { menu: 'json' });
    define(
        'date-picker',
        hmi.DatePicker,
        {
            mode: 'string',
            value: 'json',
            defaultValue: 'json',
            onChange: 'function',
            min: 'string',
            max: 'string',
            placeholder: 'string',
            disabled: 'boolean',
            'aria-label': 'string',
        },
        { onChange: { bubbles: true } },
        'text',
    );
    define('divider', hmi.Divider, {
        orientation: 'string',
        align: 'string',
    });
    define('donut-chart', hmi.DonutChart, {
        segments: 'json',
        size: 'number',
        thickness: 'number',
        gap: 'number',
        centerLabel: 'string',
        'aria-label': 'string',
    });
    define(
        'drawer',
        hmi.Drawer,
        {
            open: 'boolean',
            onClose: 'function',
            side: 'string',
            size: 'string',
            title: 'string',
            description: 'string',
            actions: 'json',
            onAction: 'function',
        },
        {
            onClose: { bubbles: true },
            onAction: { bubbles: true },
        },
    );
    define('empty-state', hmi.EmptyState, {
        icon: 'json',
        title: 'string',
        description: 'string',
        action: 'json',
    });
    define(
        'file-upload',
        hmi.FileUpload,
        {
            onChange: 'function',
            accept: 'string',
            multiple: 'boolean',
            disabled: 'boolean',
            label: 'string',
            hint: 'string',
            'aria-label': 'string',
        },
        { onChange: { bubbles: true } },
    );
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
        label: 'string',
        hint: 'string',
        error: 'string',
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
        label: 'string',
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
    define(
        'input',
        hmi.Input,
        {
            leftIcon: 'json',
            rightIcon: 'json',
            error: 'boolean',
            value: 'string',
            defaultValue: 'string',
            onChange: 'function',
            placeholder: 'string',
            disabled: 'boolean',
            type: 'string',
            name: 'string',
        },
        { onChange: { bubbles: true } },
        'text',
    );
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
    define(
        'list',
        hmi.List,
        {
            items: 'json',
            draggable: 'boolean',
            onReorder: 'function',
            renderItem: 'function',
        },
        { onReorder: { bubbles: true } },
    );
    define('menu', hmi.Menu);
    define('meter', hmi.Meter, {
        value: 'number',
        min: 'number',
        max: 'number',
        low: 'number',
        high: 'number',
        optimum: 'number',
        label: 'string',
        showValue: 'boolean',
    });
    define(
        'modal',
        hmi.Modal,
        {
            open: 'boolean',
            onClose: 'function',
            title: 'string',
            description: 'string',
            size: 'string',
            actions: 'json',
            onAction: 'function',
        },
        {
            onClose: { bubbles: true },
            onAction: { bubbles: true },
        },
    );
    define(
        'multi-input',
        hmi.MultiInput,
        {
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
        },
        {
            onChange: { bubbles: true },
            onComplete: { bubbles: true },
        },
        'text',
    );
    define(
        'navbar',
        hmi.Navbar,
        {
            brand: 'json',
            links: 'json',
            current: 'string',
            onNav: 'function',
            right: 'json',
            'aria-label': 'string',
        },
        { onNav: { bubbles: true } },
    );
    define(
        'number-input',
        hmi.NumberInput,
        {
            value: 'number',
            defaultValue: 'number',
            min: 'number',
            max: 'number',
            step: 'number',
            error: 'boolean',
            onChange: 'function',
            disabled: 'boolean',
            placeholder: 'string',
        },
        { onChange: { bubbles: true } },
        'numeric',
    );
    define(
        'pagination',
        hmi.Pagination,
        {
            page: 'number',
            total: 'number',
            onChange: 'function',
        },
        { onChange: { bubbles: true } },
    );
    define(
        'password-input',
        hmi.PasswordInput,
        {
            leftIcon: 'json',
            error: 'boolean',
            value: 'string',
            defaultValue: 'string',
            onChange: 'function',
            placeholder: 'string',
            disabled: 'boolean',
        },
        { onChange: { bubbles: true } },
        'text',
    );
    define(
        'popover',
        hmi.Popover,
        {
            open: 'boolean',
            onOpenChange: 'function',
            trigger: 'json',
            align: 'string',
            width: 'string',
        },
        { onOpenChange: { bubbles: true } },
    );
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
    define(
        'radio',
        hmi.Radio,
        {
            label: 'string',
            checked: 'boolean',
            defaultChecked: 'boolean',
            onChange: 'function',
            disabled: 'boolean',
            name: 'string',
            value: 'string',
        },
        { onChange: { bubbles: true } },
        'checkable',
    );
    define(
        'radio-group',
        hmi.RadioGroup,
        {
            name: 'string',
            value: 'string',
            defaultValue: 'string',
            options: 'json',
            onChange: 'function',
        },
        { onChange: { bubbles: true } },
        'text',
    );
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
    define(
        'search-input',
        hmi.SearchInput,
        {
            error: 'boolean',
            value: 'string',
            defaultValue: 'string',
            onChange: 'function',
            placeholder: 'string',
            disabled: 'boolean',
        },
        { onChange: { bubbles: true } },
        'text',
    );
    define(
        'segmented-control',
        hmi.SegmentedControl,
        {
            value: 'string',
            defaultValue: 'string',
            onChange: 'function',
            options: 'json',
            size: 'string',
            fullWidth: 'boolean',
            disabled: 'boolean',
            'aria-label': 'string',
        },
        { onChange: { bubbles: true } },
        'text',
    );
    define(
        'select',
        hmi.Select,
        {
            value: 'string',
            defaultValue: 'string',
            onChange: 'function',
            options: 'json',
            placeholder: 'string',
            align: 'string',
            disabled: 'boolean',
        },
        { onChange: { bubbles: true } },
        'text',
    );
    define(
        'sidebar',
        hmi.Sidebar,
        {
            groups: 'json',
            current: 'string',
            onNav: 'function',
            'aria-label': 'string',
        },
        { onNav: { bubbles: true } },
    );
    define('skeleton', hmi.Skeleton, {
        variant: 'string',
        width: 'string',
        height: 'string',
        radius: 'string',
    });
    define(
        'slider',
        hmi.Slider,
        {
            value: 'number',
            defaultValue: 'number',
            min: 'number',
            max: 'number',
            step: 'number',
            showValue: 'boolean',
            formatValue: 'string',
            onChange: 'function',
            disabled: 'boolean',
        },
        { onChange: { bubbles: true } },
        'numeric',
    );
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
        label: 'string',
        value: 'string',
        icon: 'json',
        trend: 'string',
        delta: 'string',
        helpText: 'string',
    });
    define(
        'stepper',
        hmi.Stepper,
        {
            steps: 'json',
            current: 'string',
            defaultCurrent: 'string',
            onChange: 'function',
            orientation: 'string',
            spacing: 'string',
        },
        { onChange: { bubbles: true } },
    );
    define(
        'switch',
        hmi.Switch,
        {
            label: 'string',
            checked: 'boolean',
            defaultChecked: 'boolean',
            onChange: 'function',
            disabled: 'boolean',
            name: 'string',
            value: 'string',
        },
        { onChange: { bubbles: true } },
        'checkable',
    );
    define('table', hmi.Table, {
        columns: 'json',
        rows: 'json',
        sortable: 'boolean',
        getRowKey: 'function',
    });
    define(
        'tabs',
        hmi.Tabs,
        {
            value: 'string',
            defaultValue: 'string',
            onChange: 'function',
            options: 'json',
            variant: 'string',
        },
        { onChange: { bubbles: true } },
    );
    define('text', hmi.Text, {
        as: 'string',
        size: 'string',
        weight: 'string',
        tone: 'string',
        align: 'string',
        truncate: 'boolean',
    });
    define(
        'textarea',
        hmi.Textarea,
        {
            error: 'boolean',
            value: 'string',
            defaultValue: 'string',
            onChange: 'function',
            placeholder: 'string',
            disabled: 'boolean',
            rows: 'number',
            name: 'string',
        },
        { onChange: { bubbles: true } },
        'text',
    );
    define('timeline', hmi.Timeline, { items: 'json' });
    define('toast', hmi.ToastHost);
    define('tooltip', hmi.Tooltip, {
        label: 'string',
        side: 'string',
        delay: 'number',
    });
    define(
        'tree',
        hmi.Tree,
        {
            nodes: 'json',
            expanded: 'json',
            defaultExpanded: 'json',
            onExpandedChange: 'function',
            selected: 'string',
            defaultSelected: 'string',
            onSelect: 'function',
            'aria-label': 'string',
        },
        {
            onExpandedChange: { bubbles: true },
            onSelect: { bubbles: true },
        },
    );
    define(
        'value-scale-selector',
        hmi.ValueScaleSelector,
        {
            value: 'number',
            defaultValue: 'number',
            onChange: 'function',
            max: 'number',
            allowHalf: 'boolean',
            icon: 'json',
            valueText: 'string',
            readOnly: 'boolean',
            disabled: 'boolean',
            size: 'string',
            'aria-label': 'string',
        },
        { onChange: { bubbles: true } },
    );
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
