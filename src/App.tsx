import { useState } from 'react';
import { Accordion } from './components/accordion';
import { Alert } from './components/alert';
import { AreaChart } from './components/areaChart';
import { AspectRatio } from './components/aspectRatio';
import { Avatar } from './components/avatar';
import { AvatarStack } from './components/avatarStack';
import { Badge } from './components/badge';
import { Banner } from './components/banner';
import { BarChart } from './components/barChart';
import { Blockquote } from './components/blockquote';
import { Box } from './components/box';
import { Breadcrumbs } from './components/breadcrumbs';
import { BulletChart } from './components/bulletChart';
import { Button } from './components/button';
import { Card } from './components/card';
import { Carousel } from './components/carousel';
import { CartesianGrid } from './components/cartesianGrid';
import { ChartTooltip } from './components/chartTooltip';
import { Checkbox } from './components/checkbox';
import { Chip } from './components/chip';
import { Code } from './components/code';
import { ColorPicker } from './components/colorPicker';
import { Combobox, type ComboboxOption } from './components/combobox';
import {
    CommandPalette,
    type CommandPaletteCommand,
} from './components/commandPalette';
import { ConfirmDialog } from './components/confirmDialog';
import { ContextMenu } from './components/contextMenu';
import { DatePicker, type DateRange } from './components/datePicker';
import { Divider } from './components/divider';
import { DonutChart } from './components/donutChart';
import { Drawer } from './components/drawer';
import { EmptyState } from './components/emptyState';
import { FileUpload } from './components/fileUpload';
import { Flex } from './components/flex';
import { FormControl } from './components/formControl';
import { FunnelChart } from './components/funnelChart';
import { Gauge } from './components/gauge';
import { Grid } from './components/grid';
import { Heading } from './components/heading';
import { Heatmap } from './components/heatmap';
import { HoverCard } from './components/hoverCard';
import { Image } from './components/image';
import { Input } from './components/input';
import { Kbd } from './components/kbd';
import { Legend } from './components/legend';
import { LineChart } from './components/lineChart';
import { Link } from './components/link';
import { List, type ListItem } from './components/list';
import { Menu, MenuItem, MenuLabel, MenuSeparator } from './components/menu';
import { Meter } from './components/meter';
import { Modal } from './components/modal';
import { MultiInput } from './components/multiInput';
import { Navbar } from './components/navbar';
import { NumberInput } from './components/numberInput';
import { Pagination } from './components/pagination';
import { PasswordInput } from './components/passwordInput';
import { Popover } from './components/popover';
import { Progress } from './components/progress';
import { RadarChart } from './components/radarChart';
import { Radio } from './components/radio';
import { RadioGroup } from './components/radioGroup';
import { ResponsiveContainer } from './components/responsiveContainer';
import { ScatterPlot } from './components/scatterPlot';
import { ScrollArea } from './components/scrollArea';
import { SearchInput } from './components/searchInput';
import { SegmentedControl } from './components/segmentedControl';
import { Select } from './components/select';
import { Sidebar } from './components/sidebar';
import { Skeleton } from './components/skeleton';
import { Slider } from './components/slider';
import { Spacer } from './components/spacer';
import { Sparkline } from './components/sparkline';
import { Spinner } from './components/spinner';
import { Stat } from './components/stat';
import { Stepper } from './components/stepper';
import { Switch } from './components/switch';
import { Table } from './components/table';
import { Tabs } from './components/tabs';
import { Text } from './components/text';
import { Textarea } from './components/textarea';
import { Timeline } from './components/timeline';
import { ToastHost, toast } from './components/toast';
import { Tooltip } from './components/tooltip';
import { Tree, type TreeNode } from './components/tree';
import { ValueScaleSelector } from './components/valueScaleSelector';
import { VisuallyHidden } from './components/visuallyHidden';

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

export default function App() {
    const [plan, setPlan] = useState<'free' | 'pro' | 'team'>('pro');
    const [brandColor, setBrandColor] = useState('#e87a5d');
    const [filters, setFilters] = useState<Set<string>>(
        () => new Set(['react', 'typescript']),
    );
    const [tags, setTags] = useState<string[]>([
        'design',
        'tokens',
        'a11y',
        'docs',
    ]);
    const toggleFilter = (key: string) =>
        setFilters((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    const [popoverStartOpen, setPopoverStartOpen] = useState(false);
    const [popoverEndOpen, setPopoverEndOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [lastMenuAction, setLastMenuAction] = useState<string>('none');
    const [ctxAction, setCtxAction] = useState<string>('none');
    const [treeSelected, setTreeSelected] = useState<string>('button.tsx');
    const sampleImage =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='360'%3E%3Crect width='480' height='360' fill='%23e87a5d'/%3E%3Ctext x='240' y='195' font-size='44' text-anchor='middle' fill='white' font-family='sans-serif'%3ENinoverse%3C/text%3E%3C/svg%3E";
    const sampleImageTall =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='420'%3E%3Crect width='300' height='420' fill='%231f5b58'/%3E%3Ctext x='150' y='220' font-size='40' text-anchor='middle' fill='white' font-family='sans-serif'%3EHMI%3C/text%3E%3C/svg%3E";
    const [framework, setFramework] = useState<
        'react' | 'vue' | 'svelte' | 'solid'
    >('react');
    const [modalMedium, setModalMedium] = useState(false);
    const [modalLarge, setModalLarge] = useState(false);
    const [pillTab, setPillTab] = useState<'inbox' | 'sent' | 'archive'>(
        'inbox',
    );
    const [crumbsCurrent, setCrumbsCurrent] = useState<string>('Components');
    const [navTab, setNavTab] = useState<
        'overview' | 'reports' | 'people' | 'settings'
    >('reports');
    const [sideNav, setSideNav] = useState<
        'inbox' | 'starred' | 'sent' | 'team' | 'settings' | 'logout'
    >('inbox');
    const [pageShort, setPageShort] = useState(3);
    const [pageLong, setPageLong] = useState(8);
    const [reorderable, setReorderable] = useState<ListItem[]>([
        {
            id: 'ada',
            avatar: 'Ada Lovelace',
            title: 'Ada Lovelace',
            subtitle: 'Computing pioneer',
        },
        {
            id: 'alan',
            avatar: 'Alan Turing',
            title: 'Alan Turing',
            subtitle: 'Theoretical foundation',
        },
        {
            id: 'grace',
            avatar: 'Grace Hopper',
            title: 'Grace Hopper',
            subtitle: 'Compiler genealogy',
        },
        {
            id: 'linus',
            avatar: 'Linus Torvalds',
            title: 'Linus Torvalds',
            subtitle: 'Kernel maintainer',
        },
    ]);
    const [underlineTab, setUnderlineTab] = useState<
        'overview' | 'usage' | 'billing'
    >('overview');
    const [volume, setVolume] = useState(64);
    const [contrast, setContrast] = useState(50);
    const [quantity, setQuantity] = useState<number | null>(1);
    const [age, setAge] = useState<number | null>(28);
    const [city, setCity] = useState<string | null>('paris');
    const [pickedDate, setPickedDate] = useState<Date | null>(
        new Date(2026, 4, 15),
    );
    const [pickedRange, setPickedRange] = useState<DateRange | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [productRating, setProductRating] = useState(3);
    const [halfRating, setHalfRating] = useState(2.5);
    const [otpCode, setOtpCode] = useState('');
    const [drawerRight, setDrawerRight] = useState(false);
    const [drawerLeft, setDrawerLeft] = useState(false);
    const [drawerBottom, setDrawerBottom] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState<
        'cart' | 'address' | 'payment' | 'review'
    >('payment');
    const [paletteOpen, setPaletteOpen] = useState(false);
    const [paletteResult, setPaletteResult] = useState<string>('none');
    const [view, setView] = useState<'list' | 'board' | 'calendar'>('list');
    const [density, setDensity] = useState<'compact' | 'cozy' | 'spacious'>(
        'cozy',
    );
    const [maintenanceVisible, setMaintenanceVisible] = useState(true);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [confirmResult, setConfirmResult] = useState<string>('none');
    const cityOptions: ComboboxOption[] = [
        { value: 'amsterdam', label: 'Amsterdam', description: 'Netherlands' },
        { value: 'berlin', label: 'Berlin', description: 'Germany' },
        { value: 'lisbon', label: 'Lisbon', description: 'Portugal' },
        { value: 'london', label: 'London', description: 'United Kingdom' },
        { value: 'madrid', label: 'Madrid', description: 'Spain' },
        { value: 'milan', label: 'Milan', description: 'Italy' },
        { value: 'paris', label: 'Paris', description: 'France' },
        { value: 'rome', label: 'Rome', description: 'Italy' },
        { value: 'vienna', label: 'Vienna', description: 'Austria' },
        { value: 'warsaw', label: 'Warsaw', description: 'Poland' },
    ];
    return (
        <div
            style={{
                padding: '5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '4rem',
                maxWidth: '120rem',
            }}
        >
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Box</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                    }}
                >
                    <Box
                        background="surface-variant"
                        padding="medium"
                        radius="medium"
                    >
                        Surface variant
                    </Box>
                    <Box
                        background="surface-container-high"
                        padding="large"
                        radius="leaf"
                    >
                        Container · leaf corners
                    </Box>
                    <Box bordered padding="medium" radius="medium">
                        Bordered
                    </Box>
                    <Box
                        background="surface-container"
                        bordered
                        padding="large"
                        radius="full"
                    >
                        Pill
                    </Box>
                    <Box
                        as="section"
                        background="surface"
                        bordered
                        padding="small"
                        radius="small"
                    >
                        as=&quot;section&quot;
                    </Box>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>VisuallyHidden</h2>
                <Text tone="muted">
                    Renders nothing visible — content stays available to screen
                    readers. The icon-only button below carries a hidden label.
                </Text>
                <button
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '5rem',
                        height: '5rem',
                        borderRadius: 'var(--corner-medium)',
                        border: '0.125rem solid var(--outline-variant)',
                        background: 'var(--surface-container-high)',
                        color: 'var(--on-surface)',
                        cursor: 'pointer',
                    }}
                    type="button"
                >
                    <span
                        style={{
                            display: 'inline-flex',
                            width: '2.5rem',
                            height: '2.5rem',
                        }}
                    >
                        <SearchIcon />
                    </span>
                    <VisuallyHidden>Search</VisuallyHidden>
                </button>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>ScrollArea</h2>
                <Grid columns={2} gap="medium">
                    <ScrollArea maxHeight="18rem">
                        <Box
                            background="surface-container"
                            padding="medium"
                            radius="medium"
                        >
                            {Array.from(
                                { length: 12 },
                                (_, i) => `Vertical scroll row ${i + 1}`,
                            ).map((label) => (
                                <Text key={label}>{label}</Text>
                            ))}
                        </Box>
                    </ScrollArea>
                    <ScrollArea orientation="horizontal">
                        <Flex
                            gap="medium"
                            style={{
                                width: 'max-content',
                                paddingBottom: '1rem',
                            }}
                        >
                            {Array.from(
                                { length: 10 },
                                (_, i) => `Card ${i + 1}`,
                            ).map((label) => (
                                <Box
                                    background="surface-container-high"
                                    key={label}
                                    padding="large"
                                    radius="medium"
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {label}
                                </Box>
                            ))}
                        </Flex>
                    </ScrollArea>
                </Grid>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Flex</h2>
                <Flex gap="medium" wrap>
                    <Box
                        background="surface-variant"
                        padding="medium"
                        radius="medium"
                    >
                        Row
                    </Box>
                    <Box
                        background="surface-variant"
                        padding="medium"
                        radius="medium"
                    >
                        with
                    </Box>
                    <Box
                        background="surface-variant"
                        padding="medium"
                        radius="medium"
                    >
                        gap
                    </Box>
                </Flex>
                <Flex align="center" gap="medium" justify="between">
                    <Box
                        background="surface-container-high"
                        padding="small"
                        radius="small"
                    >
                        space-between
                    </Box>
                    <Box
                        background="surface-container-high"
                        padding="large"
                        radius="small"
                    >
                        align-center
                    </Box>
                    <Box
                        background="surface-container-high"
                        padding="small"
                        radius="small"
                    >
                        end
                    </Box>
                </Flex>
                <Flex direction="column" gap="small">
                    <Box
                        background="surface-container"
                        padding="small"
                        radius="small"
                    >
                        column
                    </Box>
                    <Box
                        background="surface-container"
                        padding="small"
                        radius="small"
                    >
                        direction
                    </Box>
                </Flex>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Grid</h2>
                <Grid columns={3} gap="medium">
                    {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map(
                        (label) => (
                            <Box
                                background="surface-variant"
                                key={label}
                                padding="medium"
                                radius="medium"
                            >
                                {label}
                            </Box>
                        ),
                    )}
                </Grid>
                <Grid columns="2fr 1fr" gap="medium">
                    <Box
                        background="surface-container-high"
                        padding="large"
                        radius="small"
                    >
                        2fr (main)
                    </Box>
                    <Box
                        background="surface-container-high"
                        padding="large"
                        radius="small"
                    >
                        1fr (aside)
                    </Box>
                </Grid>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Spacer</h2>
                <Box
                    background="surface-variant"
                    padding="medium"
                    radius="medium"
                >
                    Above
                    <Spacer size="large" />
                    Below (vertical large spacer between)
                </Box>
                <Flex align="center">
                    <Box
                        background="surface-container-high"
                        padding="small"
                        radius="small"
                    >
                        Left
                    </Box>
                    <Spacer axis="horizontal" size="large" />
                    <Box
                        background="surface-container-high"
                        padding="small"
                        radius="small"
                    >
                        Right (horizontal spacer)
                    </Box>
                </Flex>
                <Flex
                    align="center"
                    style={{
                        background: 'var(--surface-container)',
                        borderRadius: 'var(--corner-medium)',
                        padding: '1rem 2rem',
                    }}
                >
                    <span>Start</span>
                    <Spacer grow />
                    <span>End (pushed by grow spacer)</span>
                </Flex>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>AspectRatio</h2>
                <Grid columns={3} gap="medium">
                    <AspectRatio
                        ratio={16 / 9}
                        style={{ borderRadius: 'var(--corner-medium)' }}
                    >
                        <Box
                            background="surface-container-high"
                            padding="medium"
                        >
                            16 / 9
                        </Box>
                    </AspectRatio>
                    <AspectRatio
                        ratio={1}
                        style={{ borderRadius: 'var(--corner-medium)' }}
                    >
                        <Box background="surface-variant" padding="medium">
                            1 / 1
                        </Box>
                    </AspectRatio>
                    <AspectRatio
                        ratio={4 / 3}
                        style={{ borderRadius: 'var(--corner-medium)' }}
                    >
                        <Box background="surface-container" padding="medium">
                            4 / 3
                        </Box>
                    </AspectRatio>
                </Grid>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Text</h2>
                <Text size="xlarge" weight="bold">
                    Extra-large bold body text
                </Text>
                <Text size="large" weight="semibold">
                    Large semibold body text
                </Text>
                <Text>Default medium regular body text</Text>
                <Text size="small" tone="muted">
                    Small muted helper text
                </Text>
                <Text size="xsmall" tone="primary" weight="medium">
                    Extra-small primary caption
                </Text>
                <Text tone="error">Error-tone message text</Text>
                <Text align="center">Center-aligned text</Text>
                <Text style={{ maxWidth: '32rem' }} truncate>
                    Truncated single line that is far too long to fit within the
                    constrained width and should end with an ellipsis
                </Text>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Heading</h2>
                <Heading level={1}>Heading level 1 (xlarge)</Heading>
                <Heading level={2}>Heading level 2 (large)</Heading>
                <Heading level={3}>Heading level 3 (medium)</Heading>
                <Heading level={4}>Heading level 4 (small)</Heading>
                <Heading level={6}>Heading level 6 (xsmall)</Heading>
                <Heading level={2} size="medium" tone="primary">
                    Level 2 styled as medium, primary tone
                </Heading>
                <Heading level={3} tone="muted">
                    Level 3, muted tone
                </Heading>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Link</h2>
                <Text>
                    Read the <Link href="#docs">documentation</Link> for more,
                    or{' '}
                    <Link href="#hover" underline="hover">
                        hover to underline
                    </Link>
                    , or a{' '}
                    <Link href="#plain" underline="none">
                        plain link
                    </Link>
                    .
                </Text>
                <Text tone="muted">
                    A{' '}
                    <Link href="#muted" tone="muted">
                        muted secondary link
                    </Link>{' '}
                    and an{' '}
                    <Link href="https://example.com" target="_blank">
                        external link
                    </Link>{' '}
                    (auto rel).
                </Text>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Blockquote</h2>
                <Blockquote cite="— Antoine de Saint-Exupéry, The Little Prince">
                    What is essential is invisible to the eye. It is only with
                    the heart that one can see rightly.
                </Blockquote>
                <Blockquote>
                    A quotation without an attribution renders just the quote
                    body.
                </Blockquote>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Code</h2>
                <Text>
                    Install with <Code>pnpm add @ninoverse/hmi-components</Code>{' '}
                    then import the <Code>Code</Code> component.
                </Text>
                <Code block>{`import { Code } from '@ninoverse/hmi-components';

export function Example() {
    return <Code block>{'const x = 42;'}</Code>;
}`}</Code>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Color picker</h2>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap',
                    }}
                >
                    <ColorPicker
                        aria-label="Brand color"
                        onChange={setBrandColor}
                        value={brandColor}
                    />
                    <span
                        style={{
                            fontSize: '1.625rem',
                            color: 'var(--on-surface-variant)',
                        }}
                    >
                        Selected: {brandColor}
                    </span>
                    <ColorPicker defaultValue="#5c9a6a" showInput={false} />
                    <ColorPicker defaultValue="#6b86b3" disabled />
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Variants</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="soft">Soft</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Delete</Button>
                    <Button variant="link">Read the docs</Button>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Sizes</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <Button size="small">Small</Button>
                    <Button size="medium">Medium</Button>
                    <Button size="large">Large</Button>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>States</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <Button disabled>Disabled</Button>
                    <Button variant="secondary" disabled>
                        Disabled
                    </Button>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Text inputs</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 40rem))',
                        gap: '3rem',
                    }}
                >
                    <FormControl
                        label="Full name"
                        hint="As it appears on documents"
                    >
                        <Input placeholder="Alex Morgan" />
                    </FormControl>
                    <FormControl
                        label="Email"
                        error="Hmm, that doesn't look right."
                    >
                        <Input
                            type="email"
                            placeholder="you@studio.co"
                            defaultValue="not-an-email"
                            error
                        />
                    </FormControl>
                    <FormControl label="Search">
                        <Input
                            placeholder="Search…"
                            leftIcon={<SearchIcon />}
                        />
                    </FormControl>
                    <FormControl label="Disabled">
                        <Input
                            placeholder="Read-only"
                            defaultValue="Already filled"
                            disabled
                        />
                    </FormControl>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Textarea</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 40rem))',
                        gap: '3rem',
                    }}
                >
                    <FormControl
                        label="About you"
                        hint="A short bio, 240 chars max"
                    >
                        <Textarea placeholder="Tell us a bit about yourself…" />
                    </FormControl>
                    <FormControl
                        label="Feedback"
                        error="Please describe the issue."
                    >
                        <Textarea error defaultValue="" />
                    </FormControl>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Radio</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 40rem))',
                        gap: '3rem',
                    }}
                >
                    <FormControl
                        label="Single radios (shared name)"
                        hint="Native browser handles mutual exclusion."
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.25rem',
                            }}
                        >
                            <Radio
                                name="size"
                                value="sm"
                                label="Small"
                                defaultChecked
                            />
                            <Radio name="size" value="md" label="Medium" />
                            <Radio name="size" value="lg" label="Large" />
                            <Radio
                                name="size"
                                value="xl"
                                label="Extra large (disabled)"
                                disabled
                            />
                        </div>
                    </FormControl>
                    <FormControl
                        label="Controlled RadioGroup"
                        hint={`Selected: ${plan}`}
                    >
                        <RadioGroup
                            name="plan"
                            value={plan}
                            onChange={setPlan}
                            options={[
                                { value: 'free', label: 'Free' },
                                { value: 'pro', label: 'Pro' },
                                {
                                    value: 'team',
                                    label: 'Team (disabled)',
                                    disabled: true,
                                },
                            ]}
                        />
                    </FormControl>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Checkbox</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '3rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <Checkbox label="Accept terms" defaultChecked />
                    <Checkbox label="Subscribe to updates" />
                    <Checkbox label="Disabled" disabled />
                    <Checkbox
                        label="Disabled checked"
                        disabled
                        defaultChecked
                    />
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Switch</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '3rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <Switch label="Notifications" defaultChecked />
                    <Switch label="Email digest" />
                    <Switch label="Beta features (disabled)" disabled />
                    <Switch
                        label="Auto-save (disabled, on)"
                        disabled
                        defaultChecked
                    />
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>
                    Password & Search
                </h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 40rem))',
                        gap: '3rem',
                    }}
                >
                    <FormControl
                        label="Password"
                        hint="Click the eye to reveal."
                    >
                        <PasswordInput
                            placeholder="••••••••"
                            defaultValue="super-secret"
                        />
                    </FormControl>
                    <FormControl label="Search">
                        <SearchInput />
                    </FormControl>
                    <FormControl
                        label="Password (error)"
                        error="Must include a number."
                    >
                        <PasswordInput defaultValue="letters-only" error />
                    </FormControl>
                    <FormControl label="Search (custom placeholder)">
                        <SearchInput placeholder="Find a component…" />
                    </FormControl>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Badge</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '1.5rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <Badge>Default</Badge>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="danger">Danger</Badge>
                    <Badge variant="info">Info</Badge>
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: '1.5rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <Badge dot>Live</Badge>
                    <Badge variant="primary" dot>
                        New
                    </Badge>
                    <Badge variant="success" dot>
                        Online
                    </Badge>
                    <Badge variant="warning" dot>
                        Pending
                    </Badge>
                    <Badge variant="danger" dot>
                        Offline
                    </Badge>
                    <Badge variant="info" dot>
                        Beta
                    </Badge>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Chip</h2>
                <FormControl
                    label="Filters (toggle to select)"
                    hint={`Active: ${[...filters].join(', ') || 'none'}`}
                >
                    <div
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            flexWrap: 'wrap',
                        }}
                    >
                        {['react', 'typescript', 'vite', 'biome', 'figma'].map(
                            (key) => (
                                <Chip
                                    key={key}
                                    selected={filters.has(key)}
                                    onSelect={() => toggleFilter(key)}
                                >
                                    {key}
                                </Chip>
                            ),
                        )}
                    </div>
                </FormControl>
                <FormControl
                    label="Removable tags"
                    hint={`Tags: ${tags.join(', ') || 'none'}`}
                >
                    <div
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            flexWrap: 'wrap',
                        }}
                    >
                        {tags.map((tag) => (
                            <Chip
                                key={tag}
                                onClose={() =>
                                    setTags((prev) =>
                                        prev.filter((t) => t !== tag),
                                    )
                                }
                            >
                                {tag}
                            </Chip>
                        ))}
                    </div>
                </FormControl>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Spinner</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '3rem',
                        alignItems: 'center',
                    }}
                >
                    <Spinner size="small" />
                    <Spinner />
                    <Spinner size="large" />
                    <Button leftIcon={<Spinner size="small" />} disabled>
                        Loading
                    </Button>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Progress</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 60rem)',
                        gap: '3rem',
                    }}
                >
                    <FormControl label="Determinate (0%)">
                        <Progress value={0} />
                    </FormControl>
                    <FormControl label="Determinate (35%)">
                        <Progress value={35} />
                    </FormControl>
                    <FormControl label="Determinate (80%)">
                        <Progress value={80} />
                    </FormControl>
                    <FormControl label="Determinate (100%)">
                        <Progress value={100} />
                    </FormControl>
                    <FormControl label="Indeterminate">
                        <Progress indeterminate label="Syncing" />
                    </FormControl>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Meter</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 60rem)',
                        gap: '3rem',
                    }}
                >
                    <Meter
                        high={80}
                        label="Disk usage"
                        low={50}
                        max={100}
                        optimum={20}
                        showValue
                        value={35}
                    />
                    <Meter
                        high={80}
                        label="Disk usage (suboptimal)"
                        low={50}
                        max={100}
                        optimum={20}
                        showValue
                        value={65}
                    />
                    <Meter
                        high={80}
                        label="Disk usage (poor)"
                        low={50}
                        max={100}
                        optimum={20}
                        showValue
                        value={92}
                    />
                    <Meter
                        label="Battery (optimum high)"
                        high={80}
                        low={20}
                        max={100}
                        optimum={100}
                        showValue
                        value={90}
                    />
                    <Meter label="Plain 0–1 ratio" showValue value={0.6} />
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Alert</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 80rem)',
                        gap: '2rem',
                    }}
                >
                    <Alert variant="info" title="Heads up">
                        A new theme is available. Reload to pick it up.
                    </Alert>
                    <Alert variant="success" title="Saved">
                        Your changes have been written to the cloud.
                    </Alert>
                    <Alert
                        variant="warning"
                        title="Low storage"
                        action={
                            <Button size="small" variant="soft">
                                Manage
                            </Button>
                        }
                    >
                        You have 1.2 GB free on this device.
                    </Alert>
                    <Alert
                        variant="danger"
                        title="Sync failed"
                        action={
                            <Button size="small" variant="danger">
                                Retry
                            </Button>
                        }
                    >
                        Could not reach the server. Will retry in 30 seconds.
                    </Alert>
                    <Alert variant="info">
                        Body-only alert with no title — works too.
                    </Alert>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Card</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 45rem))',
                        gap: '2.5rem',
                    }}
                >
                    <Card>
                        <h3
                            style={{
                                margin: 0,
                                fontSize: '2.25rem',
                                fontWeight: 700,
                            }}
                        >
                            Default
                        </h3>
                        <p
                            style={{
                                margin: '0.75rem 0 0',
                                fontSize: '1.75rem',
                                color: 'var(--on-surface-variant)',
                            }}
                        >
                            Elevated warm surface with the asymmetric leaf
                            corner shape.
                        </p>
                    </Card>
                    <Card variant="flat">
                        <h3
                            style={{
                                margin: 0,
                                fontSize: '2.25rem',
                                fontWeight: 700,
                            }}
                        >
                            Flat
                        </h3>
                        <p
                            style={{
                                margin: '0.75rem 0 0',
                                fontSize: '1.75rem',
                                color: 'var(--on-surface-variant)',
                            }}
                        >
                            Same shape, no shadow — for cards inside a scrolling
                            list or grid.
                        </p>
                    </Card>
                    <Card variant="ink">
                        <h3
                            style={{
                                margin: 0,
                                fontSize: '2.25rem',
                                fontWeight: 700,
                            }}
                        >
                            Ink
                        </h3>
                        <p
                            style={{
                                margin: '0.75rem 0 0',
                                fontSize: '1.75rem',
                            }}
                        >
                            High-contrast dark surface for callouts and hero
                            sections.
                        </p>
                    </Card>
                    <Card variant="accent">
                        <h3
                            style={{
                                margin: 0,
                                fontSize: '2.25rem',
                                fontWeight: 700,
                            }}
                        >
                            Accent
                        </h3>
                        <p
                            style={{
                                margin: '0.75rem 0 0',
                                fontSize: '1.75rem',
                            }}
                        >
                            Primary tonal fill — pairs with the Badge / Chip
                            primary variants.
                        </p>
                    </Card>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Avatar</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '2rem',
                        alignItems: 'center',
                    }}
                >
                    <Avatar name="Ada Lovelace" size="small" />
                    <Avatar name="Alan Turing" />
                    <Avatar name="Grace Hopper" size="large" />
                    <Avatar name="Linus Torvalds" size="xlarge" />
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: '2rem',
                        alignItems: 'center',
                    }}
                >
                    <Avatar name="Ada Lovelace" status="online" />
                    <Avatar name="Alan Turing" status="away" />
                    <Avatar name="Grace Hopper" status="offline" />
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: '3rem',
                        alignItems: 'center',
                    }}
                >
                    <AvatarStack
                        names={[
                            'Ada Lovelace',
                            'Alan Turing',
                            'Grace Hopper',
                            'Linus Torvalds',
                        ]}
                    />
                    <AvatarStack
                        names={[
                            'Ada Lovelace',
                            'Alan Turing',
                            'Grace Hopper',
                            'Linus Torvalds',
                            'Margaret Hamilton',
                            'Donald Knuth',
                            'Edsger Dijkstra',
                        ]}
                        max={4}
                    />
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Tooltip</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '3rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        padding: '6rem 3rem',
                        justifyContent: 'center',
                    }}
                >
                    <Tooltip label="On top" side="top">
                        <Button variant="secondary">Top</Button>
                    </Tooltip>
                    <Tooltip label="Below" side="bottom">
                        <Button variant="secondary">Bottom</Button>
                    </Tooltip>
                    <Tooltip label="To the left" side="left">
                        <Button variant="secondary">Left</Button>
                    </Tooltip>
                    <Tooltip label="To the right" side="right">
                        <Button variant="secondary">Right</Button>
                    </Tooltip>
                    <Tooltip label="Snappy (0ms delay)" delay={0}>
                        <Button>Instant</Button>
                    </Tooltip>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Popover</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '3rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '2rem 0 12rem',
                    }}
                >
                    <Popover
                        open={popoverStartOpen}
                        onOpenChange={setPopoverStartOpen}
                        trigger={
                            <Button variant="secondary">Open (start)</Button>
                        }
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                fontSize: '1.75rem',
                            }}
                        >
                            <strong>Start aligned</strong>
                            <span
                                style={{ color: 'var(--on-surface-variant)' }}
                            >
                                Anchored to the trigger's left edge. Click
                                outside or press Escape to dismiss.
                            </span>
                        </div>
                    </Popover>
                    <Popover
                        open={popoverEndOpen}
                        onOpenChange={setPopoverEndOpen}
                        align="end"
                        width={320}
                        trigger={
                            <Button variant="secondary">Open (end)</Button>
                        }
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                fontSize: '1.75rem',
                            }}
                        >
                            <strong>End aligned</strong>
                            <span
                                style={{ color: 'var(--on-surface-variant)' }}
                            >
                                Anchored to the trigger's right edge, with a
                                fixed width.
                            </span>
                        </div>
                    </Popover>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Menu</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '3rem',
                        alignItems: 'center',
                        padding: '2rem 0 24rem',
                    }}
                >
                    <Popover
                        open={menuOpen}
                        onOpenChange={setMenuOpen}
                        width={260}
                        trigger={<Button variant="secondary">Actions ▾</Button>}
                    >
                        <Menu>
                            <MenuLabel>Workspace</MenuLabel>
                            <MenuItem
                                onClick={() => {
                                    setLastMenuAction('new-file');
                                    setMenuOpen(false);
                                }}
                                shortcut="⌘N"
                            >
                                New file
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setLastMenuAction('open');
                                    setMenuOpen(false);
                                }}
                                shortcut="⌘O"
                            >
                                Open…
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setLastMenuAction('save');
                                    setMenuOpen(false);
                                }}
                                shortcut="⌘S"
                            >
                                Save
                            </MenuItem>
                            <MenuSeparator />
                            <MenuLabel>Danger zone</MenuLabel>
                            <MenuItem
                                danger
                                onClick={() => {
                                    setLastMenuAction('delete');
                                    setMenuOpen(false);
                                }}
                                shortcut="⌫"
                            >
                                Delete file
                            </MenuItem>
                        </Menu>
                    </Popover>
                    <span
                        style={{
                            fontSize: '1.75rem',
                            color: 'var(--on-surface-variant)',
                        }}
                    >
                        Last action: <strong>{lastMenuAction}</strong>
                    </span>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>HoverCard</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '4rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8rem 0 16rem',
                    }}
                >
                    <HoverCard
                        align="start"
                        trigger={<Link href="#hovercard">@nino (bottom)</Link>}
                    >
                        <div
                            style={{
                                display: 'flex',
                                gap: '1.5rem',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar name="Nino Verse" size="large" />
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                }}
                            >
                                <strong style={{ fontSize: '1.875rem' }}>
                                    Nino Verse
                                </strong>
                                <span
                                    style={{
                                        fontSize: '1.625rem',
                                        color: 'var(--on-surface-variant)',
                                    }}
                                >
                                    Building the HMI component library. Hover
                                    and move in — this card stays open so you
                                    can click inside.
                                </span>
                            </div>
                        </div>
                    </HoverCard>
                    <HoverCard
                        side="top"
                        align="start"
                        trigger={<Button variant="ghost">Top / start</Button>}
                    >
                        <span style={{ fontSize: '1.75rem' }}>
                            Anchored above the trigger, aligned to its left
                            edge.
                        </span>
                    </HoverCard>
                    <HoverCard
                        side="right"
                        align="center"
                        width={280}
                        trigger={
                            <Button variant="ghost">Right / fixed width</Button>
                        }
                    >
                        <span style={{ fontSize: '1.75rem' }}>
                            Opens to the right, centred on the trigger, with a
                            fixed 280px width.
                        </span>
                    </HoverCard>
                    <HoverCard
                        side="left"
                        align="end"
                        openDelay={0}
                        closeDelay={0}
                        trigger={<Button variant="ghost">Left / snappy</Button>}
                    >
                        <span style={{ fontSize: '1.75rem' }}>
                            Zero open/close delay, to the left, end-aligned.
                        </span>
                    </HoverCard>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>ContextMenu</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '3rem',
                        alignItems: 'center',
                        paddingBottom: '24rem',
                    }}
                >
                    <ContextMenu
                        menu={
                            <Menu>
                                <MenuLabel>Edit</MenuLabel>
                                <MenuItem
                                    shortcut="⌘C"
                                    onClick={() => setCtxAction('copy')}
                                >
                                    Copy
                                </MenuItem>
                                <MenuItem
                                    shortcut="⌘V"
                                    onClick={() => setCtxAction('paste')}
                                >
                                    Paste
                                </MenuItem>
                                <MenuItem
                                    shortcut="⌘D"
                                    onClick={() => setCtxAction('duplicate')}
                                >
                                    Duplicate
                                </MenuItem>
                                <MenuSeparator />
                                <MenuItem
                                    danger
                                    shortcut="⌫"
                                    onClick={() => setCtxAction('delete')}
                                >
                                    Delete
                                </MenuItem>
                            </Menu>
                        }
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '48rem',
                                height: '20rem',
                                border: '0.25rem dashed var(--outline-variant)',
                                borderRadius: 'var(--corner-large)',
                                background: 'var(--surface-container-low)',
                                color: 'var(--on-surface-variant)',
                                fontSize: '1.875rem',
                                userSelect: 'none',
                            }}
                        >
                            Right-click anywhere in this area
                        </div>
                    </ContextMenu>
                    <span
                        style={{
                            fontSize: '1.75rem',
                            color: 'var(--on-surface-variant)',
                        }}
                    >
                        Last action: <strong>{ctxAction}</strong>
                    </span>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Tree</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '4rem',
                        alignItems: 'flex-start',
                        paddingBottom: '24rem',
                    }}
                >
                    <div style={{ width: '44rem' }}>
                        <Tree
                            aria-label="Project files"
                            selected={treeSelected}
                            onSelect={setTreeSelected}
                            defaultExpanded={['src', 'src/components']}
                            nodes={
                                [
                                    {
                                        value: 'src',
                                        label: 'src',
                                        children: [
                                            {
                                                value: 'src/components',
                                                label: 'components',
                                                children: [
                                                    {
                                                        value: 'button.tsx',
                                                        label: 'button.tsx',
                                                    },
                                                    {
                                                        value: 'tree.tsx',
                                                        label: 'tree.tsx',
                                                    },
                                                ],
                                            },
                                            {
                                                value: 'src/index.ts',
                                                label: 'index.ts',
                                            },
                                        ],
                                    },
                                    {
                                        value: 'public',
                                        label: 'public',
                                        children: [
                                            {
                                                value: 'public/themes',
                                                label: 'themes',
                                                children: [
                                                    {
                                                        value: 'default.css',
                                                        label: 'default.css',
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        value: 'package.json',
                                        label: 'package.json',
                                    },
                                    {
                                        value: 'node_modules',
                                        label: 'node_modules',
                                        disabled: true,
                                        children: [
                                            {
                                                value: 'nm/react',
                                                label: 'react',
                                            },
                                        ],
                                    },
                                ] satisfies TreeNode[]
                            }
                        />
                    </div>
                    <span
                        style={{
                            fontSize: '1.75rem',
                            color: 'var(--on-surface-variant)',
                        }}
                    >
                        Selected: <strong>{treeSelected}</strong>
                    </span>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Image</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '3rem',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        paddingBottom: '24rem',
                    }}
                >
                    <Image
                        src={sampleImage}
                        alt="Ninoverse cover"
                        ratio={4 / 3}
                        width={280}
                        radius="large"
                    />
                    <Image
                        src={sampleImageTall}
                        alt="HMI poster, contained"
                        ratio={4 / 3}
                        width={280}
                        fit="contain"
                        radius="medium"
                    />
                    <Image
                        src={sampleImage}
                        alt="Circular crop"
                        width={180}
                        height={180}
                        radius="full"
                    />
                    <Image
                        src="/this-image-does-not-exist.png"
                        alt="Missing image"
                        ratio={4 / 3}
                        width={280}
                        radius="large"
                    />
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Carousel</h2>
                <div style={{ maxWidth: '60rem', paddingBottom: '24rem' }}>
                    <Carousel
                        aria-label="Highlights"
                        slides={[
                            <Image
                                key="a"
                                src={sampleImage}
                                alt="Ninoverse cover"
                                ratio={16 / 9}
                            />,
                            <div
                                key="b"
                                style={{
                                    aspectRatio: '16 / 9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'var(--secondary-container)',
                                    color: 'var(--on-secondary-container)',
                                    fontSize: '3rem',
                                    fontWeight: 600,
                                }}
                            >
                                Rich slide content
                            </div>,
                            <Image
                                key="c"
                                src={sampleImageTall}
                                alt="HMI poster"
                                ratio={16 / 9}
                                fit="contain"
                            />,
                        ]}
                    />
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Timeline</h2>
                <div style={{ maxWidth: '60rem', paddingBottom: '24rem' }}>
                    <Timeline
                        items={[
                            {
                                title: 'Project created',
                                time: '09:24',
                                description:
                                    'Repository scaffolded and first commit pushed.',
                                color: 'primary',
                            },
                            {
                                title: 'CI pipeline green',
                                time: '10:02',
                                description:
                                    'Lint, build, and tests all passing.',
                                color: 'success',
                            },
                            {
                                title: 'Flaky test detected',
                                time: '11:47',
                                description:
                                    'Intermittent failure in the carousel autoplay spec.',
                                color: 'warning',
                            },
                            {
                                title: 'Deploy rolled back',
                                time: '12:15',
                                description:
                                    'Production deploy reverted after error spike.',
                                color: 'error',
                            },
                            {
                                title: 'Awaiting review',
                                time: '13:30',
                            },
                        ]}
                    />
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Stat</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(28rem, 1fr))',
                        gap: '2rem',
                        paddingBottom: '24rem',
                    }}
                >
                    <Stat
                        label="Revenue"
                        value="$48.2k"
                        trend="up"
                        delta="12.5%"
                        helpText="vs last month"
                    />
                    <Stat
                        label="Churn"
                        value="2.4%"
                        trend="down"
                        delta="0.8%"
                        helpText="vs last month"
                    />
                    <Stat
                        label="Active users"
                        value="1,284"
                        trend="neutral"
                        delta="0.0%"
                        helpText="flat week over week"
                    />
                    <Stat label="Open tickets" value="37" />
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>
                    Chart primitives
                </h2>
                <div style={{ maxWidth: '70rem', paddingBottom: '24rem' }}>
                    <ResponsiveContainer height={160}>
                        {({ width, height }) => (
                            <svg
                                width={width}
                                height={height}
                                role="img"
                                aria-label={`Measured ${Math.round(width)} by ${Math.round(height)} pixels`}
                            >
                                <rect
                                    x={0}
                                    y={0}
                                    width={width}
                                    height={height}
                                    rx={12}
                                    fill="var(--surface-container-high)"
                                    stroke="var(--outline-variant)"
                                />
                                <CartesianGrid
                                    width={width}
                                    height={height}
                                    rows={4}
                                    cols={6}
                                    padding={16}
                                />
                                <text
                                    x={width / 2}
                                    y={height / 2}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="var(--on-surface-variant)"
                                    fontSize={20}
                                    fontFamily="var(--font-oxanium)"
                                >
                                    {Math.round(width)} × {Math.round(height)}{' '}
                                    px
                                </text>
                            </svg>
                        )}
                    </ResponsiveContainer>
                    <div style={{ marginTop: '2rem' }}>
                        <Legend
                            align="start"
                            items={[
                                { label: 'Revenue', color: 'var(--primary)' },
                                { label: 'Costs', color: 'var(--tertiary)' },
                                {
                                    label: 'Forecast',
                                    color: 'var(--secondary)',
                                    inactive: true,
                                },
                            ]}
                        />
                    </div>
                    <div style={{ marginTop: '2rem' }}>
                        <ChartTooltip
                            title="Jan 2026"
                            items={[
                                {
                                    label: 'Revenue',
                                    value: '$48.2k',
                                    color: 'var(--primary)',
                                },
                                {
                                    label: 'Costs',
                                    value: '$31.7k',
                                    color: 'var(--tertiary)',
                                },
                            ]}
                        />
                    </div>
                    <div
                        style={{
                            marginTop: '2rem',
                            display: 'flex',
                            gap: '2rem',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Sparkline
                            data={[4, 8, 5, 10, 7, 12, 9, 14]}
                            aria-label="Upward trend"
                        />
                        <Sparkline
                            data={[14, 9, 11, 6, 8, 4, 5, 2]}
                            color="var(--error)"
                            area
                            showDot
                            aria-label="Downward trend with area"
                        />
                        <Sparkline
                            data={[6, 6, 7, 6, 8, 6, 7, 6]}
                            width={200}
                            height={48}
                            color="var(--tertiary)"
                            strokeWidth={3}
                            area
                            aria-label="Flat trend, larger"
                        />
                    </div>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>LineChart</h2>
                <div style={{ paddingBottom: '4rem' }}>
                    <LineChart
                        aria-label="Monthly revenue and costs"
                        width={560}
                        height={280}
                        showDots
                        labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                        series={[
                            {
                                name: 'Revenue',
                                data: [32, 40, 38, 50, 47, 60],
                                color: 'var(--primary)',
                            },
                            {
                                name: 'Costs',
                                data: [28, 30, 33, 31, 36, 38],
                                color: 'var(--tertiary)',
                            },
                        ]}
                    />
                    <div style={{ marginTop: '1rem' }}>
                        <Legend
                            align="start"
                            items={[
                                { label: 'Revenue', color: 'var(--primary)' },
                                { label: 'Costs', color: 'var(--tertiary)' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>BarChart</h2>
                <div style={{ paddingBottom: '4rem' }}>
                    <BarChart
                        aria-label="Quarterly units by product"
                        width={560}
                        height={280}
                        labels={['Q1', 'Q2', 'Q3', 'Q4']}
                        series={[
                            {
                                name: 'Product A',
                                data: [42, 55, 48, 63],
                                color: 'var(--primary)',
                            },
                            {
                                name: 'Product B',
                                data: [30, 38, 44, 40],
                                color: 'var(--tertiary)',
                            },
                        ]}
                    />
                    <div style={{ marginTop: '1rem' }}>
                        <Legend
                            align="start"
                            items={[
                                { label: 'Product A', color: 'var(--primary)' },
                                {
                                    label: 'Product B',
                                    color: 'var(--tertiary)',
                                },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>AreaChart</h2>
                <div style={{ paddingBottom: '4rem' }}>
                    <AreaChart
                        aria-label="Monthly active users by tier"
                        width={560}
                        height={280}
                        labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                        series={[
                            {
                                name: 'Pro',
                                data: [20, 28, 26, 35, 40, 52],
                                color: 'var(--primary)',
                            },
                            {
                                name: 'Free',
                                data: [12, 15, 18, 16, 22, 25],
                                color: 'var(--tertiary)',
                            },
                        ]}
                    />
                    <div style={{ marginTop: '1rem' }}>
                        <Legend
                            align="start"
                            items={[
                                { label: 'Pro', color: 'var(--primary)' },
                                { label: 'Free', color: 'var(--tertiary)' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>DonutChart</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '4rem',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        paddingBottom: '4rem',
                    }}
                >
                    <DonutChart
                        aria-label="Traffic by source"
                        centerLabel={
                            <span>
                                1.2k
                                <br />
                                visits
                            </span>
                        }
                        segments={[
                            { label: 'Direct', value: 45 },
                            { label: 'Search', value: 30 },
                            { label: 'Social', value: 15 },
                            { label: 'Referral', value: 10 },
                        ]}
                    />
                    <Legend
                        align="start"
                        items={[
                            { label: 'Direct', color: 'var(--primary)' },
                            { label: 'Search', color: 'var(--tertiary)' },
                            { label: 'Social', color: 'var(--secondary)' },
                            { label: 'Referral', color: 'var(--success)' },
                        ]}
                    />
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>BulletChart</h2>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        maxWidth: '46rem',
                        paddingBottom: '4rem',
                    }}
                >
                    <BulletChart
                        label="Revenue"
                        value={78}
                        target={85}
                        max={100}
                        ranges={[50, 75]}
                    />
                    <BulletChart
                        label="Profit"
                        value={62}
                        target={55}
                        max={100}
                        ranges={[40, 70]}
                        color="var(--success)"
                    />
                    <BulletChart
                        label="Cost"
                        value={92}
                        target={70}
                        max={100}
                        ranges={[60, 80]}
                        color="var(--error)"
                    />
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Gauge</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '4rem',
                        alignItems: 'flex-end',
                        flexWrap: 'wrap',
                        paddingBottom: '4rem',
                    }}
                >
                    <Gauge value={72} label="72%" />
                    <Gauge
                        value={45}
                        label="45"
                        color="var(--success)"
                        size={160}
                    />
                    <Gauge
                        value={88}
                        max={100}
                        label="88"
                        color="var(--error)"
                        thickness={0.34}
                        size={160}
                    />
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>ScatterPlot</h2>
                <div style={{ paddingBottom: '4rem' }}>
                    <ScatterPlot
                        aria-label="Height versus weight by group"
                        width={560}
                        height={280}
                        series={[
                            {
                                name: 'Group A',
                                data: [
                                    { x: 12, y: 22 },
                                    { x: 20, y: 35 },
                                    { x: 28, y: 30 },
                                    { x: 35, y: 48 },
                                    { x: 42, y: 44 },
                                    { x: 50, y: 60 },
                                ],
                                color: 'var(--primary)',
                            },
                            {
                                name: 'Group B',
                                data: [
                                    { x: 15, y: 12 },
                                    { x: 24, y: 18 },
                                    { x: 30, y: 16 },
                                    { x: 38, y: 26 },
                                    { x: 46, y: 22 },
                                    { x: 55, y: 33 },
                                ],
                                color: 'var(--tertiary)',
                            },
                        ]}
                    />
                    <div style={{ marginTop: '1rem' }}>
                        <Legend
                            align="start"
                            items={[
                                { label: 'Group A', color: 'var(--primary)' },
                                { label: 'Group B', color: 'var(--tertiary)' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Heatmap</h2>
                <div style={{ paddingBottom: '4rem' }}>
                    <Heatmap
                        aria-label="Weekly activity by hour"
                        showValues
                        xLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
                        yLabels={['Morning', 'Midday', 'Evening']}
                        data={[
                            [4, 8, 6, 12, 9],
                            [14, 18, 22, 20, 16],
                            [7, 11, 9, 15, 24],
                        ]}
                    />
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>FunnelChart</h2>
                <div style={{ paddingBottom: '4rem' }}>
                    <FunnelChart
                        aria-label="Signup conversion funnel"
                        showValues
                        stages={[
                            { label: 'Visited', value: 1200 },
                            { label: 'Signed up', value: 820 },
                            { label: 'Activated', value: 540 },
                            { label: 'Subscribed', value: 210 },
                        ]}
                    />
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>RadarChart</h2>
                <div style={{ paddingBottom: '4rem' }}>
                    <RadarChart
                        aria-label="Skill assessment by candidate"
                        size={340}
                        axes={[
                            'Speed',
                            'Power',
                            'Range',
                            'Defense',
                            'Control',
                            'Stamina',
                        ]}
                        series={[
                            {
                                name: 'Alpha',
                                data: [80, 65, 70, 55, 90, 60],
                                color: 'var(--primary)',
                            },
                            {
                                name: 'Beta',
                                data: [55, 80, 45, 75, 60, 85],
                                color: 'var(--tertiary)',
                            },
                        ]}
                    />
                    <div style={{ marginTop: '1rem' }}>
                        <Legend
                            align="start"
                            items={[
                                { label: 'Alpha', color: 'var(--primary)' },
                                { label: 'Beta', color: 'var(--tertiary)' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Select</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 40rem))',
                        gap: '3rem',
                        paddingBottom: '24rem',
                    }}
                >
                    <FormControl
                        label="Framework"
                        hint={`Picked: ${framework}`}
                    >
                        <Select
                            value={framework}
                            onChange={setFramework}
                            options={[
                                { value: 'react', label: 'React' },
                                { value: 'vue', label: 'Vue' },
                                { value: 'svelte', label: 'Svelte' },
                                { value: 'solid', label: 'Solid' },
                            ]}
                        />
                    </FormControl>
                    <FormControl label="Uncontrolled (with placeholder)">
                        <Select
                            placeholder="Pick a region…"
                            options={[
                                { value: 'eu-west', label: 'EU West' },
                                { value: 'us-east', label: 'US East' },
                                { value: 'ap-south', label: 'AP South' },
                            ]}
                        />
                    </FormControl>
                    <FormControl label="Disabled">
                        <Select
                            disabled
                            defaultValue="locked"
                            options={[{ value: 'locked', label: 'Locked' }]}
                        />
                    </FormControl>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Modal</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <Button onClick={() => setModalMedium(true)}>
                        Open medium modal
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setModalLarge(true)}
                    >
                        Open large modal
                    </Button>
                </div>
                <Modal
                    open={modalMedium}
                    onClose={() => setModalMedium(false)}
                    title="Confirm publish"
                    description="This will make the post visible to anyone with the link."
                    actions={
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => setModalMedium(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => setModalMedium(false)}
                            >
                                Publish
                            </Button>
                        </>
                    }
                >
                    <p
                        style={{
                            margin: 0,
                            fontSize: '1.75rem',
                            color: 'var(--on-surface-variant)',
                        }}
                    >
                        You can change visibility back to private at any time
                        from the post's settings menu.
                    </p>
                </Modal>
                <Modal
                    open={modalLarge}
                    onClose={() => setModalLarge(false)}
                    size="large"
                    title="Workspace settings"
                    description="Long-form content lives comfortably in the large variant."
                    actions={
                        <Button
                            variant="primary"
                            onClick={() => setModalLarge(false)}
                        >
                            Done
                        </Button>
                    }
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            fontSize: '1.75rem',
                        }}
                    >
                        <FormControl label="Display name">
                            <Input defaultValue="Ninoverse" />
                        </FormControl>
                        <FormControl label="Notes">
                            <Textarea defaultValue="Anything you'd like to remember about this workspace." />
                        </FormControl>
                    </div>
                </Modal>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Toast</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '2rem',
                        alignItems: 'center',
                    }}
                >
                    <Avatar name="Ada Lovelace" status="online" />
                    <Avatar name="Alan Turing" status="away" />
                    <Avatar name="Grace Hopper" status="offline" />
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: '3rem',
                        alignItems: 'center',
                    }}
                >
                    <AvatarStack
                        names={[
                            'Ada Lovelace',
                            'Alan Turing',
                            'Grace Hopper',
                            'Linus Torvalds',
                        ]}
                    />
                    <AvatarStack
                        names={[
                            'Ada Lovelace',
                            'Alan Turing',
                            'Grace Hopper',
                            'Linus Torvalds',
                            'Margaret Hamilton',
                            'Donald Knuth',
                            'Edsger Dijkstra',
                        ]}
                        max={4}
                    />
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Toast</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        variant="soft"
                        onClick={() =>
                            toast.info(
                                'New version available',
                                'Reload to pick up the latest build.',
                            )
                        }
                    >
                        Info
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() =>
                            toast.success(
                                'Saved',
                                'Changes synced to the cloud.',
                            )
                        }
                    >
                        Success
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() =>
                            toast.warning(
                                'Low storage',
                                '1.2 GB free on this device.',
                            )
                        }
                    >
                        Warning
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() =>
                            toast.danger(
                                'Upload failed',
                                'Could not reach the server.',
                            )
                        }
                    >
                        Danger
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            toast.info(
                                'Sticky toast',
                                'Stays until dismissed.',
                                {
                                    duration: 0,
                                },
                            )
                        }
                    >
                        Sticky
                    </Button>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Tabs</h2>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3rem',
                    }}
                >
                    <div>
                        <Tabs
                            value={pillTab}
                            onChange={setPillTab}
                            options={[
                                {
                                    value: 'inbox',
                                    label: 'Inbox',
                                    count: 12,
                                },
                                { value: 'sent', label: 'Sent' },
                                {
                                    value: 'archive',
                                    label: 'Archive',
                                    count: 3,
                                },
                            ]}
                        />
                        <p
                            style={{
                                margin: '1rem 0 0',
                                fontSize: '1.625rem',
                                color: 'var(--on-surface-variant)',
                            }}
                        >
                            Active: <strong>{pillTab}</strong>
                        </p>
                    </div>
                    <div>
                        <Tabs
                            variant="underline"
                            value={underlineTab}
                            onChange={setUnderlineTab}
                            options={[
                                { value: 'overview', label: 'Overview' },
                                {
                                    value: 'usage',
                                    label: 'Usage',
                                    count: 24,
                                },
                                { value: 'billing', label: 'Billing' },
                            ]}
                        />
                        <p
                            style={{
                                margin: '1rem 0 0',
                                fontSize: '1.625rem',
                                color: 'var(--on-surface-variant)',
                            }}
                        >
                            Active: <strong>{underlineTab}</strong>
                        </p>
                    </div>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Accordion</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 50rem))',
                        gap: '4rem',
                    }}
                >
                    <div>
                        <p
                            style={{
                                margin: '0 0 1rem',
                                fontSize: '1.625rem',
                                fontWeight: 700,
                            }}
                        >
                            Single (default)
                        </p>
                        <Accordion
                            defaultOpen={[0]}
                            items={[
                                {
                                    title: 'How do I install the library?',
                                    body: 'Run pnpm add @ninoverse/hmi-components, then import the components and the stylesheet.',
                                },
                                {
                                    title: 'What about the theme?',
                                    body: 'Drop the default.css file into your public dir and link it in your HTML. All components read its tokens at runtime.',
                                },
                                {
                                    title: 'Can I disable a section?',
                                    body: 'Yes — pass disabled: true on the AccordionItem.',
                                    disabled: true,
                                },
                            ]}
                        />
                    </div>
                    <div>
                        <p
                            style={{
                                margin: '0 0 1rem',
                                fontSize: '1.625rem',
                                fontWeight: 700,
                            }}
                        >
                            Multiple
                        </p>
                        <Accordion
                            multiple
                            defaultOpen={[0, 1]}
                            items={[
                                {
                                    title: 'Keyboard shortcuts',
                                    body: 'Tab moves between triggers; Enter or Space toggles a section.',
                                },
                                {
                                    title: 'Animation',
                                    body: 'Panels use the grid-template-rows 0fr → 1fr trick so content height isn’t measured.',
                                },
                                {
                                    title: 'Reduced motion',
                                    body: 'Honors prefers-reduced-motion by zeroing the transition duration.',
                                },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Breadcrumbs</h2>
                <Breadcrumbs
                    items={[
                        {
                            label: 'Home',
                            onClick: () => setCrumbsCurrent('Home'),
                        },
                        {
                            label: 'Library',
                            onClick: () => setCrumbsCurrent('Library'),
                        },
                        {
                            label: 'Components',
                            onClick: () => setCrumbsCurrent('Components'),
                        },
                        { label: crumbsCurrent },
                    ]}
                />
                <Breadcrumbs
                    separator="›"
                    items={[
                        { label: 'Docs', href: '#' },
                        { label: 'Guides', href: '#' },
                        { label: 'Getting started' },
                    ]}
                />
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Pagination</h2>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                    }}
                >
                    <div>
                        <p
                            style={{
                                margin: '0 0 1rem',
                                fontSize: '1.625rem',
                                color: 'var(--on-surface-variant)',
                            }}
                        >
                            Short (5 pages, all shown):
                        </p>
                        <Pagination
                            page={pageShort}
                            total={5}
                            onChange={setPageShort}
                        />
                    </div>
                    <div>
                        <p
                            style={{
                                margin: '0 0 1rem',
                                fontSize: '1.625rem',
                                color: 'var(--on-surface-variant)',
                            }}
                        >
                            Long (20 pages, windowed). Current:{' '}
                            <strong>{pageLong}</strong>
                        </p>
                        <Pagination
                            page={pageLong}
                            total={20}
                            onChange={setPageLong}
                        />
                    </div>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>List</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 50rem))',
                        gap: '3rem',
                    }}
                >
                    <div>
                        <p
                            style={{
                                margin: '0 0 1rem',
                                fontSize: '1.625rem',
                                fontWeight: 700,
                            }}
                        >
                            Simple list
                        </p>
                        <List
                            items={[
                                {
                                    id: 1,
                                    title: 'Inbox',
                                    subtitle: '12 unread messages',
                                    right: <Badge dot>Live</Badge>,
                                },
                                {
                                    id: 2,
                                    title: 'Drafts',
                                    subtitle: '3 unsent',
                                },
                                {
                                    id: 3,
                                    title: 'Archive',
                                    subtitle: 'Older than 30 days',
                                    right: <Badge>312</Badge>,
                                },
                            ]}
                        />
                    </div>
                    <div>
                        <p
                            style={{
                                margin: '0 0 1rem',
                                fontSize: '1.625rem',
                                fontWeight: 700,
                            }}
                        >
                            Draggable (drag handle visible)
                        </p>
                        <List
                            draggable
                            items={reorderable}
                            onReorder={setReorderable}
                        />
                    </div>
                </div>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Table</h2>
                <Table
                    columns={[
                        { key: 'name', label: 'Name' },
                        {
                            key: 'role',
                            label: 'Role',
                        },
                        {
                            key: 'commits',
                            label: 'Commits',
                            style: { textAlign: 'right' },
                        },
                        {
                            key: 'status',
                            label: 'Status',
                            sortable: false,
                            render: (row) => (
                                <Badge
                                    variant={
                                        row.status === 'active'
                                            ? 'success'
                                            : row.status === 'pending'
                                              ? 'warning'
                                              : 'default'
                                    }
                                    dot
                                >
                                    {String(row.status)}
                                </Badge>
                            ),
                        },
                    ]}
                    rows={[
                        {
                            id: 'ada',
                            name: 'Ada Lovelace',
                            role: 'Analyst',
                            commits: 142,
                            status: 'active',
                        },
                        {
                            id: 'alan',
                            name: 'Alan Turing',
                            role: 'Theoretician',
                            commits: 87,
                            status: 'pending',
                        },
                        {
                            id: 'grace',
                            name: 'Grace Hopper',
                            role: 'Compiler engineer',
                            commits: 254,
                            status: 'active',
                        },
                        {
                            id: 'linus',
                            name: 'Linus Torvalds',
                            role: 'Maintainer',
                            commits: 1024,
                            status: 'archived',
                        },
                    ]}
                    getRowKey={(row) => String(row.id)}
                />
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Navbar</h2>
                <Navbar
                    brand="Ninoverse"
                    current={navTab}
                    onNav={setNavTab}
                    links={[
                        { value: 'overview', label: 'Overview' },
                        { value: 'reports', label: 'Reports' },
                        { value: 'people', label: 'People' },
                        { value: 'settings', label: 'Settings' },
                    ]}
                    right={
                        <>
                            <Button size="small" variant="ghost">
                                Sign in
                            </Button>
                            <Button size="small" variant="primary">
                                Get started
                            </Button>
                        </>
                    }
                />
                <p
                    style={{
                        margin: 0,
                        fontSize: '1.625rem',
                        color: 'var(--on-surface-variant)',
                    }}
                >
                    Active: <strong>{navTab}</strong>
                </p>
            </section>

            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Sidebar</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '3rem',
                        alignItems: 'flex-start',
                    }}
                >
                    <Sidebar
                        current={sideNav}
                        onNav={setSideNav}
                        groups={[
                            {
                                label: 'Mail',
                                items: [
                                    {
                                        value: 'inbox',
                                        label: 'Inbox',
                                        icon: (
                                            <svg
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <title>Inbox</title>
                                                <path d="M2 9l1.5-5.5A1 1 0 014.5 3h7a1 1 0 011 .5L14 9v3.5a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5V9z" />
                                                <path d="M2 9h3l1 2h4l1-2h3" />
                                            </svg>
                                        ),
                                        badge: 12,
                                        badgeVariant: 'primary',
                                    },
                                    {
                                        value: 'starred',
                                        label: 'Starred',
                                        icon: (
                                            <svg
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <title>Starred</title>
                                                <path d="M8 2l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.8 4.2 13.8l.7-4.3-3.1-3 4.3-.6L8 2z" />
                                            </svg>
                                        ),
                                    },
                                    {
                                        value: 'sent',
                                        label: 'Sent',
                                        icon: (
                                            <svg
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <title>Sent</title>
                                                <path d="M14 2L7 9M14 2L9.5 14 7 9 2 6.5 14 2z" />
                                            </svg>
                                        ),
                                    },
                                ],
                            },
                            {
                                label: 'Workspace',
                                items: [
                                    {
                                        value: 'team',
                                        label: 'Team',
                                        icon: (
                                            <svg
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <title>Team</title>
                                                <circle
                                                    cx="8"
                                                    cy="5.5"
                                                    r="2.5"
                                                />
                                                <path d="M3 13.5c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />
                                            </svg>
                                        ),
                                        badge: 'New',
                                        badgeVariant: 'success',
                                    },
                                    {
                                        value: 'settings',
                                        label: 'Settings',
                                        icon: (
                                            <svg
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <title>Settings</title>
                                                <circle cx="8" cy="8" r="2" />
                                                <path d="M13 8c0-.4 0-.7-.1-1l1.2-.9-1-1.7L11.7 5c-.5-.5-1.1-.8-1.7-1l-.2-1.5h-2L7.6 4c-.6.2-1.2.5-1.7 1l-1.4-.6-1 1.7 1.2.9c0 .3-.1.6-.1 1s0 .7.1 1l-1.2.9 1 1.7L5.9 11c.5.5 1.1.8 1.7 1l.2 1.5h2l.2-1.5c.6-.2 1.2-.5 1.7-1l1.4.6 1-1.7-1.2-.9c.1-.3.1-.6.1-1z" />
                                            </svg>
                                        ),
                                    },
                                    {
                                        value: 'logout',
                                        label: 'Log out',
                                        icon: (
                                            <svg
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <title>Log out</title>
                                                <path d="M9 3.5H4a1 1 0 00-1 1v7a1 1 0 001 1h5" />
                                                <path d="M11 5l3 3-3 3M14 8H7" />
                                            </svg>
                                        ),
                                    },
                                ],
                            },
                        ]}
                    />
                    <p
                        style={{
                            margin: 0,
                            fontSize: '1.625rem',
                            color: 'var(--on-surface-variant)',
                        }}
                    >
                        Active: <strong>{sideNav}</strong>
                    </p>
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Skeleton</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: '3rem',
                        alignItems: 'flex-start',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                fontSize: '1.625rem',
                                color: 'var(--on-surface-variant)',
                            }}
                        >
                            Text lines
                        </p>
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="100%" />
                        <Skeleton variant="text" width="60%" />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2rem',
                        }}
                    >
                        <Skeleton variant="circle" width="6rem" height="6rem" />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                flex: 1,
                            }}
                        >
                            <Skeleton variant="text" width="50%" />
                            <Skeleton variant="rect" height="1.5rem" />
                            <Skeleton
                                variant="rect"
                                height="1.5rem"
                                width="80%"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Divider</h2>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                    }}
                >
                    <Divider />
                    <Divider>OR</Divider>
                    <Divider align="start">Recent</Divider>
                    <Divider align="end">2 of 4</Divider>
                    <div
                        style={{
                            display: 'flex',
                            gap: '2rem',
                            alignItems: 'center',
                            height: '4rem',
                        }}
                    >
                        <span style={{ fontSize: '1.625rem' }}>Left</span>
                        <Divider orientation="vertical" />
                        <span style={{ fontSize: '1.625rem' }}>Middle</span>
                        <Divider orientation="vertical" />
                        <span style={{ fontSize: '1.625rem' }}>Right</span>
                    </div>
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Kbd</h2>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            fontSize: '1.625rem',
                        }}
                    >
                        <span>Open command palette:</span>
                        <Kbd>Ctrl</Kbd>
                        <span>+</span>
                        <Kbd>K</Kbd>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            fontSize: '1.625rem',
                        }}
                    >
                        <span>Save:</span>
                        <Kbd size="small">⌘</Kbd>
                        <span>+</span>
                        <Kbd size="small">S</Kbd>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1.625rem',
                        }}
                    >
                        <span>Navigate:</span>
                        <Kbd>↑</Kbd>
                        <Kbd>↓</Kbd>
                        <Kbd>←</Kbd>
                        <Kbd>→</Kbd>
                    </div>
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Empty state</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: '3rem',
                    }}
                >
                    <EmptyState
                        icon={
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <title>Empty inbox</title>
                                <path d="M3 13l3-7h12l3 7v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                                <path d="M3 13h5l1 2h6l1-2h5" />
                            </svg>
                        }
                        title="Inbox zero"
                        description="No new messages. When something arrives, it will show up here automatically."
                    />
                    <EmptyState
                        icon={
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <title>No results</title>
                                <circle cx="11" cy="11" r="6" />
                                <path d="M16 16l4.5 4.5" />
                            </svg>
                        }
                        title="No matches"
                        description={
                            <>
                                We couldn&apos;t find anything matching that
                                search. Try a different keyword or clear all
                                filters.
                            </>
                        }
                        action={
                            <>
                                <Button variant="secondary">
                                    Clear filters
                                </Button>
                                <Button>New search</Button>
                            </>
                        }
                    />
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Slider</h2>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                        maxWidth: '60rem',
                    }}
                >
                    <FormControl label="Volume">
                        <Slider
                            value={volume}
                            onChange={setVolume}
                            showValue
                            aria-label="Volume"
                            formatValue={(v) => `${v}%`}
                        />
                    </FormControl>
                    <FormControl label="Contrast">
                        <Slider
                            value={contrast}
                            onChange={setContrast}
                            min={0}
                            max={100}
                            step={5}
                            aria-label="Contrast"
                        />
                    </FormControl>
                    <FormControl label="Disabled">
                        <Slider
                            defaultValue={30}
                            disabled
                            showValue
                            aria-label="Disabled slider"
                        />
                    </FormControl>
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Number input</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        gap: '2rem',
                        maxWidth: '90rem',
                    }}
                >
                    <FormControl label="Quantity">
                        <NumberInput
                            value={quantity}
                            onChange={setQuantity}
                            min={1}
                            max={99}
                            aria-label="Quantity"
                        />
                    </FormControl>
                    <FormControl label="Age">
                        <NumberInput
                            value={age}
                            onChange={setAge}
                            min={0}
                            max={120}
                            step={1}
                            aria-label="Age"
                        />
                    </FormControl>
                    <FormControl label="Disabled">
                        <NumberInput
                            defaultValue={5}
                            disabled
                            aria-label="Disabled number"
                        />
                    </FormControl>
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Combobox</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '3rem',
                        flexWrap: 'wrap',
                        alignItems: 'flex-end',
                    }}
                >
                    <FormControl label="City">
                        <div style={{ width: '36rem' }}>
                            <Combobox
                                value={city}
                                onChange={setCity}
                                options={cityOptions}
                                placeholder="Search cities…"
                                aria-label="City"
                            />
                        </div>
                    </FormControl>
                    <p
                        style={{
                            margin: 0,
                            fontSize: '1.625rem',
                            color: 'var(--on-surface-variant)',
                        }}
                    >
                        Selected: <strong>{city ?? 'none'}</strong>
                    </p>
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Date picker</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '3rem',
                        flexWrap: 'wrap',
                    }}
                >
                    <FormControl label="Single date">
                        <div style={{ width: '32rem' }}>
                            <DatePicker
                                value={pickedDate}
                                onChange={setPickedDate}
                                aria-label="Pick a date"
                            />
                        </div>
                    </FormControl>
                    <FormControl label="Date range">
                        <div style={{ width: '40rem' }}>
                            <DatePicker
                                mode="range"
                                value={pickedRange}
                                onChange={setPickedRange}
                                placeholder="Pick a range"
                                aria-label="Pick a date range"
                            />
                        </div>
                    </FormControl>
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>File upload</h2>
                <div style={{ maxWidth: '60rem' }}>
                    <FileUpload
                        value={uploadedFiles}
                        onChange={setUploadedFiles}
                        multiple
                        hint="PNG, JPG, or PDF up to 10 MB each"
                        aria-label="Project attachments"
                    />
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>
                    Value scale selector
                </h2>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                    }}
                >
                    <FormControl label="Star scale (default icon)">
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2rem',
                            }}
                        >
                            <ValueScaleSelector
                                value={productRating}
                                onChange={setProductRating}
                                aria-label="Product rating"
                            />
                            <span
                                style={{
                                    fontSize: '1.625rem',
                                    color: 'var(--on-surface-variant)',
                                }}
                            >
                                {productRating} / 5
                            </span>
                        </div>
                    </FormControl>
                    <FormControl label="Heart scale (custom icon, half-step)">
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2rem',
                            }}
                        >
                            <ValueScaleSelector
                                value={halfRating}
                                onChange={setHalfRating}
                                allowHalf
                                size="large"
                                aria-label="Affinity"
                                icon={
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <title>Heart</title>
                                        <path d="M12 21s-7-4.35-9.3-9.3C1.1 8 3 4 7 4c2.1 0 3.5 1.1 5 3 1.5-1.9 2.9-3 5-3 4 0 5.9 4 4.3 7.7C19 16.65 12 21 12 21z" />
                                    </svg>
                                }
                            />
                            <span
                                style={{
                                    fontSize: '1.625rem',
                                    color: 'var(--on-surface-variant)',
                                }}
                            >
                                {halfRating} / 5
                            </span>
                        </div>
                    </FormControl>
                    <FormControl label="Read-only star scale">
                        <ValueScaleSelector
                            value={4.5}
                            allowHalf
                            readOnly
                            size="small"
                            aria-label="Read-only rating"
                            valueText={(v, m) => `Rated ${v} out of ${m} stars`}
                        />
                    </FormControl>
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Multi input</h2>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                    }}
                >
                    <FormControl label="6-digit verification code (numeric)">
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2rem',
                            }}
                        >
                            <MultiInput
                                value={otpCode}
                                onChange={setOtpCode}
                                length={6}
                                autoComplete="one-time-code"
                                aria-label="Verification code"
                            />
                            <span
                                style={{
                                    fontSize: '1.625rem',
                                    color: 'var(--on-surface-variant)',
                                }}
                            >
                                Value: <strong>{otpCode || '(empty)'}</strong>
                            </span>
                        </div>
                    </FormControl>
                    <FormControl label="License key (3 × 4 alphanumeric)">
                        <MultiInput
                            length={12}
                            groupSize={4}
                            type="text"
                            pattern={/^[A-Za-z0-9]$/}
                            defaultValue="ABCD1234WXYZ"
                            aria-label="License key"
                        />
                    </FormControl>
                    <FormControl label="4-digit PIN (masked)">
                        <MultiInput
                            length={4}
                            mask
                            defaultValue="1234"
                            aria-label="PIN"
                        />
                    </FormControl>
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Drawer</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap',
                    }}
                >
                    <Button onClick={() => setDrawerRight(true)}>
                        Open right
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setDrawerLeft(true)}
                    >
                        Open left
                    </Button>
                    <Button
                        variant="soft"
                        onClick={() => setDrawerBottom(true)}
                    >
                        Open bottom
                    </Button>
                </div>
                <Drawer
                    open={drawerRight}
                    onClose={() => setDrawerRight(false)}
                    side="right"
                    title="Filters"
                    description="Tune the result set on the fly."
                    actions={
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => setDrawerRight(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={() => setDrawerRight(false)}>
                                Apply
                            </Button>
                        </>
                    }
                >
                    <p
                        style={{
                            margin: 0,
                            fontSize: '1.625rem',
                            color: 'var(--on-surface-variant)',
                        }}
                    >
                        Right-side drawer — Escape or scrim click closes it.
                    </p>
                </Drawer>
                <Drawer
                    open={drawerLeft}
                    onClose={() => setDrawerLeft(false)}
                    side="left"
                    title="Workspace"
                    description="Sample left drawer for navigation context."
                >
                    <p
                        style={{
                            margin: 0,
                            fontSize: '1.625rem',
                            color: 'var(--on-surface-variant)',
                        }}
                    >
                        Left-side drawer.
                    </p>
                </Drawer>
                <Drawer
                    open={drawerBottom}
                    onClose={() => setDrawerBottom(false)}
                    side="bottom"
                    title="Quick actions"
                >
                    <p
                        style={{
                            margin: 0,
                            fontSize: '1.625rem',
                            color: 'var(--on-surface-variant)',
                        }}
                    >
                        Bottom-anchored drawer — common on mobile.
                    </p>
                </Drawer>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Stepper</h2>
                <Stepper
                    orientation="horizontal"
                    steps={[
                        {
                            value: 'cart',
                            label: 'Cart',
                            description: '3 items',
                        },
                        {
                            value: 'address',
                            label: 'Address',
                            description: 'Delivery details',
                        },
                        {
                            value: 'payment',
                            label: 'Payment',
                            description: 'Choose method',
                        },
                        { value: 'review', label: 'Review' },
                    ]}
                    current={checkoutStep}
                    onChange={setCheckoutStep}
                    aria-label="Checkout progress"
                />
                <Stepper
                    orientation="vertical"
                    steps={[
                        {
                            value: 'cart',
                            label: 'Cart',
                            description: '3 items',
                        },
                        {
                            value: 'address',
                            label: 'Address',
                            description: 'Delivery details',
                        },
                        {
                            value: 'payment',
                            label: 'Payment',
                            description: 'Choose method',
                        },
                        { value: 'review', label: 'Review' },
                    ]}
                    current={checkoutStep}
                    aria-label="Checkout progress vertical"
                />
                <Stepper
                    orientation="vertical"
                    spacing={4}
                    steps={[
                        {
                            value: 'cart',
                            label: 'Cart',
                            description: '3 items',
                        },
                        {
                            value: 'address',
                            label: 'Address',
                            description: 'Delivery details',
                        },
                        {
                            value: 'payment',
                            label: 'Payment',
                            description: 'Choose method',
                        },
                        { value: 'review', label: 'Review' },
                    ]}
                    current={checkoutStep}
                    aria-label="Checkout progress vertical spacing=4"
                />
                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                    }}
                >
                    <Button
                        variant="secondary"
                        onClick={() => {
                            const order = [
                                'cart',
                                'address',
                                'payment',
                                'review',
                            ] as const;
                            const i = order.indexOf(checkoutStep);
                            if (i > 0)
                                setCheckoutStep(
                                    order[i - 1] as typeof checkoutStep,
                                );
                        }}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={() => {
                            const order = [
                                'cart',
                                'address',
                                'payment',
                                'review',
                            ] as const;
                            const i = order.indexOf(checkoutStep);
                            if (i < order.length - 1)
                                setCheckoutStep(
                                    order[i + 1] as typeof checkoutStep,
                                );
                        }}
                    >
                        Next
                    </Button>
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Command palette</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '2rem',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <Button onClick={() => setPaletteOpen(true)}>
                        Open command palette
                    </Button>
                    <p
                        style={{
                            margin: 0,
                            fontSize: '1.625rem',
                            color: 'var(--on-surface-variant)',
                        }}
                    >
                        Last action: <strong>{paletteResult}</strong>
                    </p>
                </div>
                <CommandPalette
                    open={paletteOpen}
                    onOpenChange={setPaletteOpen}
                    commands={
                        [
                            {
                                id: 'new-doc',
                                label: 'New document',
                                description: 'Start a blank page',
                                group: 'Create',
                                keywords: ['create', 'blank'],
                                onSelect: () =>
                                    setPaletteResult('New document'),
                            },
                            {
                                id: 'new-folder',
                                label: 'New folder',
                                group: 'Create',
                                keywords: ['directory'],
                                onSelect: () => setPaletteResult('New folder'),
                            },
                            {
                                id: 'open-recent',
                                label: 'Open recent',
                                description: 'Browse the last 20 files',
                                group: 'Navigation',
                                onSelect: () => setPaletteResult('Open recent'),
                            },
                            {
                                id: 'go-settings',
                                label: 'Go to settings',
                                group: 'Navigation',
                                onSelect: () =>
                                    setPaletteResult('Go to settings'),
                            },
                            {
                                id: 'toggle-theme',
                                label: 'Toggle theme',
                                description: 'Switch between light and dark',
                                group: 'Preferences',
                                onSelect: () =>
                                    setPaletteResult('Toggle theme'),
                            },
                            {
                                id: 'sign-out',
                                label: 'Sign out',
                                group: 'Account',
                                keywords: ['logout', 'leave'],
                                onSelect: () => setPaletteResult('Sign out'),
                            },
                        ] satisfies CommandPaletteCommand[]
                    }
                />
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>
                    Segmented control
                </h2>
                <FormControl label="View">
                    <SegmentedControl
                        value={view}
                        onChange={setView}
                        aria-label="View"
                        options={[
                            { value: 'list', label: 'List' },
                            { value: 'board', label: 'Board' },
                            { value: 'calendar', label: 'Calendar' },
                        ]}
                    />
                </FormControl>
                <FormControl label="Density (full width, small)">
                    <SegmentedControl
                        value={density}
                        onChange={setDensity}
                        size="small"
                        fullWidth
                        aria-label="Density"
                        options={[
                            { value: 'compact', label: 'Compact' },
                            { value: 'cozy', label: 'Cozy' },
                            {
                                value: 'spacious',
                                label: 'Spacious',
                                disabled: true,
                            },
                        ]}
                    />
                </FormControl>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Banner</h2>
                {maintenanceVisible && (
                    <Banner
                        variant="warning"
                        title="Scheduled maintenance"
                        action={
                            <Button variant="secondary">View status</Button>
                        }
                        onDismiss={() => setMaintenanceVisible(false)}
                    >
                        We'll be applying database upgrades on Saturday from
                        02:00 to 04:00 UTC. Expect brief read-only windows.
                    </Banner>
                )}
                <Banner variant="info" title="New release">
                    v0.49 ships Banner and ConfirmDialog. Read the changelog for
                    the full list.
                </Banner>
                <Banner variant="success" title="Backup completed">
                    Last snapshot finished 3 minutes ago — 1.2 GB synced.
                </Banner>
                <Banner
                    variant="danger"
                    title="Payment failed"
                    action={<Button variant="danger">Retry</Button>}
                >
                    Your card was declined. Please verify your billing details
                    and try again.
                </Banner>
            </section>
            <section
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '3rem' }}>Confirm dialog</h2>
                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        variant="danger"
                        onClick={() => setConfirmDeleteOpen(true)}
                    >
                        Delete project
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setConfirmLeaveOpen(true)}
                    >
                        Leave without saving
                    </Button>
                    <p
                        style={{
                            margin: 0,
                            fontSize: '1.625rem',
                            color: 'var(--on-surface-variant)',
                        }}
                    >
                        Last result: <strong>{confirmResult}</strong>
                    </p>
                </div>
                <ConfirmDialog
                    open={confirmDeleteOpen}
                    onCancel={() => {
                        setConfirmDeleteOpen(false);
                        setConfirmResult('Delete cancelled');
                    }}
                    onConfirm={() => {
                        setDeleteLoading(true);
                        window.setTimeout(() => {
                            setDeleteLoading(false);
                            setConfirmDeleteOpen(false);
                            setConfirmResult('Project deleted');
                        }, 900);
                    }}
                    title="Delete project?"
                    description="This will permanently remove the project, its files, and 14 collaborator invitations. This action cannot be undone."
                    confirmLabel={
                        deleteLoading ? 'Deleting…' : 'Delete project'
                    }
                    variant="danger"
                    loading={deleteLoading}
                />
                <ConfirmDialog
                    open={confirmLeaveOpen}
                    onCancel={() => {
                        setConfirmLeaveOpen(false);
                        setConfirmResult('Leave cancelled');
                    }}
                    onConfirm={() => {
                        setConfirmLeaveOpen(false);
                        setConfirmResult('Left without saving');
                    }}
                    title="Leave without saving?"
                    description="Your unsaved changes will be discarded."
                    confirmLabel="Leave"
                />
            </section>
            <ToastHost />
        </div>
    );
}
