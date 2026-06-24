import type { CSSProperties, InputHTMLAttributes } from 'react';
import { useState } from 'react';
import { applyTemplate } from '../lib/formatTemplate.utility';
import './styled/slider.styled.css';

export type SliderProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'
> & {
    /** Controlled value. Provide with `onChange`. */
    value?: number;
    /** Initial value when uncontrolled. Defaults to `min`. */
    defaultValue?: number;
    /** Minimum value. @default 0 */
    min?: number;
    /** Maximum value. @default 100 */
    max?: number;
    /** Step increment. @default 1 */
    step?: number;
    /** Show the current value beside the track. @default false */
    showValue?: boolean;
    /**
     * Format the displayed value. A function `(value) => string`, or a
     * `{value}` template string (e.g. `"{value}%"`) usable over the
     * web-component boundary.
     */
    formatValue?: string | ((value: number) => string);
    /** Fires with the new value as the thumb moves. */
    onChange?: (value: number) => void;
};

/**
 * Range slider over a native `range` input, with optional value display and
 * formatting. Works controlled or uncontrolled.
 *
 * @example
 * <Slider min={0} max={100} value={vol} onChange={setVol} showValue />
 */
export function Slider({
    value,
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    showValue = false,
    formatValue,
    onChange,
    className,
    disabled,
    style,
    ...rest
}: SliderProps) {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState<number>(defaultValue ?? min);
    const current = isControlled ? value : internal;
    const pct = max === min ? 0 : ((current - min) / (max - min)) * 100;

    const tokens: string[] = ['slider'];
    if (disabled) tokens.push('slider--disabled');
    if (className) tokens.push(className);

    const trackStyle: CSSProperties = {
        ...style,
        ['--slider-pct' as string]: `${pct}%`,
    };

    return (
        <div className={tokens.join(' ')} style={trackStyle}>
            <input
                type="range"
                className="slider__input"
                min={min}
                max={max}
                step={step}
                value={current}
                disabled={disabled}
                onChange={(event) => {
                    const next = Number(event.target.value);
                    if (!isControlled) setInternal(next);
                    onChange?.(next);
                }}
                {...rest}
            />
            {showValue && (
                <span className="slider__value">
                    {typeof formatValue === 'function'
                        ? formatValue(current)
                        : formatValue
                          ? applyTemplate(formatValue, { value: current })
                          : current}
                </span>
            )}
        </div>
    );
}
