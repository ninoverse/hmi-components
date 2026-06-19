import { type HTMLAttributes, type ReactNode, useState } from 'react';
import './styled/stepper.styled.css';

export type StepperOrientation = 'horizontal' | 'vertical';

export type StepperItem<T extends string = string> = {
    /** Unique step value, emitted via `onChange` and matched against `current`. */
    value: T;
    /** Step title. */
    label: ReactNode;
    /** Optional secondary line under the label. */
    description?: ReactNode;
};

export type StepperProps<T extends string = string> = Omit<
    HTMLAttributes<HTMLOListElement>,
    'onChange'
> & {
    /** Ordered steps. */
    steps: ReadonlyArray<StepperItem<T>>;
    /** Controlled active step value. Provide with `onChange`. */
    current?: T;
    /** Initial active step when uncontrolled. */
    defaultCurrent?: T;
    /** Fires with a completed step's `value` when it is clicked. */
    onChange?: (value: T) => void;
    /** Layout direction. @default 'horizontal' */
    orientation?: StepperOrientation;
    /** Gap between steps; number = rem. */
    spacing?: string | number;
};

/**
 * Step progress indicator. Marks steps before `current` as completed (and
 * clickable), the current step active, and the rest upcoming. Works controlled
 * or uncontrolled.
 *
 * @example
 * <Stepper steps={steps} current={step} onChange={setStep} />
 */

const CheckIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <title>Completed</title>
        <path d="M5 12l4.5 4.5L19 7" />
    </svg>
);

export function Stepper<T extends string = string>({
    steps,
    current,
    defaultCurrent,
    onChange,
    orientation = 'horizontal',
    spacing,
    className,
    style,
    'aria-label': ariaLabel = 'Progress steps',
    ...rest
}: StepperProps<T>) {
    const isControlled = current !== undefined;
    const [internal, setInternal] = useState<T | undefined>(defaultCurrent);
    const active = isControlled ? current : internal;

    const currentIndex = steps.findIndex((s) => s.value === active);

    const tokens: string[] = ['stepper', `stepper--${orientation}`];
    if (className) tokens.push(className);

    const resolvedStyle =
        spacing !== undefined
            ? {
                  '--stepper-item-gap':
                      typeof spacing === 'number' ? `${spacing}rem` : spacing,
                  ...style,
              }
            : style;

    return (
        <ol
            className={tokens.join(' ')}
            aria-label={ariaLabel}
            style={resolvedStyle}
            {...rest}
        >
            {steps.map((step, i) => {
                const status: 'completed' | 'active' | 'upcoming' =
                    i < currentIndex
                        ? 'completed'
                        : i === currentIndex
                          ? 'active'
                          : 'upcoming';
                const interactive =
                    status === 'completed' &&
                    (!isControlled || onChange !== undefined);

                const indicator = (
                    <span className="stepper__indicator" aria-hidden="true">
                        {status === 'completed' ? (
                            <CheckIcon />
                        ) : (
                            <span className="stepper__number">{i + 1}</span>
                        )}
                    </span>
                );

                const labelBlock = (
                    <span className="stepper__text">
                        <span className="stepper__label">{step.label}</span>
                        {step.description && (
                            <span className="stepper__description">
                                {step.description}
                            </span>
                        )}
                    </span>
                );

                return (
                    <li
                        key={step.value}
                        className="stepper__item"
                        data-status={status}
                        {...(status === 'active'
                            ? { 'aria-current': 'step' }
                            : {})}
                    >
                        {interactive ? (
                            <button
                                type="button"
                                className="stepper__button"
                                onClick={() => {
                                    if (!isControlled) setInternal(step.value);
                                    onChange?.(step.value);
                                }}
                            >
                                {indicator}
                                {labelBlock}
                            </button>
                        ) : (
                            <span className="stepper__button">
                                {indicator}
                                {labelBlock}
                            </span>
                        )}
                        {i < steps.length - 1 && (
                            <span
                                className="stepper__connector"
                                aria-hidden="true"
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
