import {
    type CSSProperties,
    type KeyboardEvent,
    type ReactNode,
    useState,
} from 'react';
import { applyTemplate } from '../lib/formatTemplate.utility';
import './styled/valueScaleSelector.styled.css';

export type ValueScaleSelectorSize = 'small' | 'medium' | 'large';

export type ValueScaleSelectorProps = {
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
    max?: number;
    allowHalf?: boolean;
    icon?: ReactNode;
    valueText?: string | ((value: number, max: number) => string);
    readOnly?: boolean;
    disabled?: boolean;
    size?: ValueScaleSelectorSize;
    'aria-label'?: string;
};

const DefaultIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <title>Star</title>
        <path d="M12 2.5l2.94 6.5 7.06.6-5.34 4.76 1.63 6.94L12 17.6 5.71 21.3 7.34 14.36 2 9.6l7.06-.6L12 2.5z" />
    </svg>
);

export function ValueScaleSelector({
    value,
    defaultValue,
    onChange,
    max = 5,
    allowHalf = false,
    icon,
    valueText,
    readOnly = false,
    disabled = false,
    size = 'medium',
    'aria-label': ariaLabel = 'Value selector',
}: ValueScaleSelectorProps) {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState<number>(defaultValue ?? 0);
    const [hover, setHover] = useState<number | null>(null);

    const current = isControlled ? value : internal;
    const display = hover ?? current;
    const fillPct = Math.max(0, Math.min(1, display / max)) * 100;

    const tokens: string[] = [
        'value-scale-selector',
        `value-scale-selector--${size}`,
    ];
    if (disabled) tokens.push('value-scale-selector--disabled');
    if (readOnly) tokens.push('value-scale-selector--readonly');

    const commit = (next: number) => {
        if (!isControlled) setInternal(next);
        onChange?.(next);
    };

    const interactive = !readOnly && !disabled;
    const stepValue = allowHalf ? 0.5 : 1;

    const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!interactive) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault();
            commit(Math.min(max, current + stepValue));
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            event.preventDefault();
            commit(Math.max(0, current - stepValue));
        } else if (event.key === 'Home') {
            event.preventDefault();
            commit(0);
        } else if (event.key === 'End') {
            event.preventDefault();
            commit(max);
        }
    };

    const positions = Array.from({ length: max }, (_, i) => i + 1);
    const fillStyle: CSSProperties = { width: `${fillPct}%` };
    const cellIcon = icon ?? <DefaultIcon />;

    const computedValueText =
        typeof valueText === 'function'
            ? valueText(current, max)
            : valueText
              ? applyTemplate(valueText, { value: current, max })
              : `${current} out of ${max}`;

    return (
        <div
            role="slider"
            aria-label={ariaLabel}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={current}
            aria-valuetext={computedValueText}
            aria-disabled={disabled || undefined}
            aria-readonly={readOnly || undefined}
            tabIndex={interactive ? 0 : -1}
            className={tokens.join(' ')}
            onKeyDown={onKey}
            onMouseLeave={() => setHover(null)}
        >
            <div
                className="value-scale-selector__row value-scale-selector__row--bg"
                aria-hidden="true"
            >
                {positions.map((p) => (
                    <span key={p} className="value-scale-selector__item">
                        {cellIcon}
                    </span>
                ))}
            </div>
            <div
                className="value-scale-selector__row value-scale-selector__row--fg"
                aria-hidden="true"
                style={fillStyle}
            >
                {positions.map((p) => (
                    <span key={p} className="value-scale-selector__item">
                        {cellIcon}
                    </span>
                ))}
            </div>
            {interactive && (
                <div className="value-scale-selector__overlay">
                    {positions.map((p) => {
                        if (allowHalf) {
                            return (
                                <span
                                    key={p}
                                    className="value-scale-selector__cell"
                                >
                                    <button
                                        type="button"
                                        className="value-scale-selector__half value-scale-selector__half--left"
                                        aria-label={`${p - 0.5}`}
                                        tabIndex={-1}
                                        onClick={() => commit(p - 0.5)}
                                        onMouseEnter={() => setHover(p - 0.5)}
                                    />
                                    <button
                                        type="button"
                                        className="value-scale-selector__half value-scale-selector__half--right"
                                        aria-label={`${p}`}
                                        tabIndex={-1}
                                        onClick={() => commit(p)}
                                        onMouseEnter={() => setHover(p)}
                                    />
                                </span>
                            );
                        }
                        return (
                            <span
                                key={p}
                                className="value-scale-selector__cell"
                            >
                                <button
                                    type="button"
                                    className="value-scale-selector__full"
                                    aria-label={`${p}`}
                                    tabIndex={-1}
                                    onClick={() => commit(p)}
                                    onMouseEnter={() => setHover(p)}
                                />
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
