import type { HTMLAttributes, ReactNode } from 'react';
import './styled/stepper.styled.css';

export type StepperOrientation = 'horizontal' | 'vertical';

export type StepperItem<T extends string = string> = {
    value: T;
    label: ReactNode;
    description?: ReactNode;
};

export type StepperProps<T extends string = string> = Omit<
    HTMLAttributes<HTMLOListElement>,
    'onChange'
> & {
    steps: ReadonlyArray<StepperItem<T>>;
    current: T;
    onChange?: (value: T) => void;
    orientation?: StepperOrientation;
    spacing?: string | number;
};

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
    onChange,
    orientation = 'horizontal',
    spacing,
    className,
    style,
    'aria-label': ariaLabel = 'Progress steps',
    ...rest
}: StepperProps<T>) {
    const currentIndex = steps.findIndex((s) => s.value === current);

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
                    onChange !== undefined && status === 'completed';

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
                                onClick={() => onChange?.(step.value)}
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
