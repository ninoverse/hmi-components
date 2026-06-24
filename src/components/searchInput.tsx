import { Input, type InputProps } from './input';

/** Same as {@link InputProps}, minus `leftIcon` and `type` (set internally). */
export type SearchInputProps = Omit<InputProps, 'leftIcon' | 'type'>;

const SearchIcon = () => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <title>Search</title>
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5L13.5 13.5" />
    </svg>
);

/**
 * {@link Input} preconfigured for search, with a leading search icon and
 * `type="search"`.
 *
 * @example
 * <SearchInput value={q} onChange={setQ} />
 */
export function SearchInput({
    placeholder = 'Search…',
    ...rest
}: SearchInputProps) {
    return (
        <Input
            type="search"
            placeholder={placeholder}
            leftIcon={<SearchIcon />}
            {...rest}
        />
    );
}
