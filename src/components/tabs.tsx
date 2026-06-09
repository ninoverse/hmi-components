import {
    type HTMLAttributes,
    type ReactNode,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { Badge } from './badge';
import './styled/tabs.styled.css';

export type TabsVariant = 'pill' | 'underline';

export type TabOption<T extends string = string> = {
    value: T;
    label: ReactNode;
    icon?: ReactNode;
    count?: number;
};

export type TabsProps<T extends string = string> = Omit<
    HTMLAttributes<HTMLDivElement>,
    'onChange'
> & {
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
    options: ReadonlyArray<TabOption<T>>;
    variant?: TabsVariant;
};

type Indicator = { left: number; width: number; opacity: number };

export function Tabs<T extends string = string>({
    value,
    defaultValue,
    onChange,
    options,
    variant = 'pill',
    className,
    ...rest
}: TabsProps<T>) {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState<T | undefined>(defaultValue);
    const current = isControlled ? value : internal;

    const wrapRef = useRef<HTMLDivElement | null>(null);
    const [indicator, setIndicator] = useState<Indicator>({
        left: 0,
        width: 0,
        opacity: 0,
    });

    // biome-ignore lint/correctness/useExhaustiveDependencies: current and options drive the [data-active] selector queried inside measure.
    useLayoutEffect(() => {
        const measure = () => {
            const wrap = wrapRef.current;
            if (!wrap) return;
            const active = wrap.querySelector<HTMLElement>(
                '[data-active="true"]',
            );
            if (!active) {
                setIndicator((prev) => ({ ...prev, opacity: 0 }));
                return;
            }
            const wr = wrap.getBoundingClientRect();
            const ar = active.getBoundingClientRect();
            setIndicator({
                left: ar.left - wr.left,
                width: ar.width,
                opacity: 1,
            });
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [current, options]);

    const tokens: string[] = ['tabs'];
    if (variant !== 'pill') tokens.push(`tabs--${variant}`);
    if (className) tokens.push(className);

    return (
        <div
            ref={wrapRef}
            className={tokens.join(' ')}
            role="tablist"
            {...rest}
        >
            <span
                aria-hidden="true"
                className="tabs__indicator"
                style={{
                    transform: `translateX(${indicator.left}px)`,
                    width: indicator.width,
                    opacity: indicator.opacity,
                }}
            />
            {options.map((opt) => {
                const isActive = opt.value === current;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className="tab"
                        data-active={isActive}
                        onClick={() => {
                            if (!isControlled) setInternal(opt.value);
                            onChange?.(opt.value);
                        }}
                    >
                        {opt.icon && (
                            <span className="tab__icon">{opt.icon}</span>
                        )}
                        <span className="tab__label">{opt.label}</span>
                        {opt.count != null && (
                            <Badge variant={isActive ? 'primary' : 'default'}>
                                {opt.count}
                            </Badge>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
