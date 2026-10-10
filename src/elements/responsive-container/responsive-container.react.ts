import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    HmiResponsiveContainer,
    type ResponsiveContainerResizeDetail,
} from './responsive-container.js';

export type { ResponsiveContainerResizeDetail } from './responsive-container.js';

/**
 * React wrapper for `<hmi-responsive-container>`.
 *
 * The v5 render prop is replaced by `onResize`, whose event `detail` is
 * `{ width, height }`: keep it in state and pass it to a chart's `width` and
 * `height`. The same size is on the `--container-width` and
 * `--container-height` custom properties. The children always render, even
 * before the width is known.
 *
 * @example
 * const [size, setSize] = useState({ width: 0, height: 160 });
 * <ResponsiveContainer height={160} onResize={(e) => setSize(e.detail)}>
 *   {size.width > 0 && <LineChart width={size.width} height={size.height} series={series} />}
 * </ResponsiveContainer>
 */
export const ResponsiveContainer = createComponent({
    tagName: 'hmi-responsive-container',
    elementClass: HmiResponsiveContainer,
    react: React,
    displayName: 'ResponsiveContainer',
    events: {
        onResize: 'hmi-resize' as EventName<
            CustomEvent<ResponsiveContainerResizeDetail>
        >,
    },
});
