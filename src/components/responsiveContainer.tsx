import { type ReactNode, useEffect, useRef, useState } from 'react';
import './styled/responsiveContainer.styled.css';

export type ResponsiveContainerSize = {
    width: number;
    height: number;
};

export type ResponsiveContainerProps = {
    /** Fixed height in px. Ignored when `aspect` is set. */
    height?: number;
    /** Width / height ratio; height is derived from the measured width. */
    aspect?: number;
    /** Render prop called with the measured pixel size once width is known. */
    children: (size: ResponsiveContainerSize) => ReactNode;
};

/** Measures its own width (via ResizeObserver) and hands a concrete pixel
 *  size to its render-prop child — the foundation chart primitives build on,
 *  since SVG coordinate math needs real numbers, not percentages.
 * @deprecated Use `ResponsiveContainer` from `@ninoverse/hmi-components/react/responsive-container`. Removed in 6.0.0.
 */
export function ResponsiveContainer({
    height = 300,
    aspect,
    children,
}: ResponsiveContainerProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) setWidth(entry.contentRect.width);
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const resolvedHeight = aspect && width ? width / aspect : height;

    return (
        <div
            ref={ref}
            className="responsive-container"
            style={{ height: resolvedHeight }}
        >
            {width > 0 && children({ width, height: resolvedHeight })}
        </div>
    );
}
