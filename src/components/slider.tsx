import type { CSSProperties, InputHTMLAttributes } from 'react';
import { useState } from 'react';
import { applyTemplate } from '../lib/formatTemplate.utility';
import './styled/slider.styled.css';

export type SliderProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'
> & {
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    showValue?: boolean;
    formatValue?: string | ((value: number) => string);
    onChange?: (value: number) => void;
};

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
