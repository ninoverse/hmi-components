/* Account settings, written in React with the `@lit/react` wrappers: each one
   comes from `@ninoverse/hmi-components/react/<name>` in a real app, here
   from source like the rest of the demo. The fields are uncontrolled: they
   start from `defaultValue`, the form collects them, and `form.reset()`
   restores them. */

import './settings.css';
import { type FormEvent, StrictMode, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Avatar } from '../../src/elements/avatar/avatar.react.js';
import { Badge } from '../../src/elements/badge/badge.react.js';
import { Button } from '../../src/elements/button/button.react.js';
import { Card } from '../../src/elements/card/card.react.js';
import { Checkbox } from '../../src/elements/checkbox/checkbox.react.js';
import { ColorPicker } from '../../src/elements/color-picker/color-picker.react.js';
import { Combobox } from '../../src/elements/combobox/combobox.react.js';
import { ConfirmDialog } from '../../src/elements/confirm-dialog/confirm-dialog.react.js';
import { DatePicker } from '../../src/elements/date-picker/date-picker.react.js';
import { FileUpload } from '../../src/elements/file-upload/file-upload.react.js';
import { Heading } from '../../src/elements/heading/heading.react.js';
import { Input } from '../../src/elements/input/input.react.js';
import { List } from '../../src/elements/list/list.react.js';
import { NumberInput } from '../../src/elements/number-input/number-input.react.js';
import { PasswordInput } from '../../src/elements/password-input/password-input.react.js';
import { RadioGroup } from '../../src/elements/radio-group/radio-group.react.js';
import { Select } from '../../src/elements/select/select.react.js';
import { Switch } from '../../src/elements/switch/switch.react.js';
import { Tabs } from '../../src/elements/tabs/tabs.react.js';
import { Text } from '../../src/elements/text/text.react.js';
import { Textarea } from '../../src/elements/textarea/textarea.react.js';
import { ToastHost, toast } from '../../src/elements/toast/toast.react.js';
import { mountShell } from '../shared/shell.js';

mountShell('settings', '../');

const SECTIONS = [
    { value: 'profile', label: 'Profile' },
    { value: 'preferences', label: 'Preferences' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'security', label: 'Security' },
];

const ROLES = [
    { value: 'operator', label: 'Operator' },
    { value: 'supervisor', label: 'Shift supervisor' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'quality', label: 'Quality engineer' },
];

const SITES = [
    { value: 'tor', label: 'Turin', description: 'Lines 1 to 4' },
    { value: 'mil', label: 'Milan', description: 'Lines 5 and 6' },
    { value: 'bcn', label: 'Barcelona', description: 'Line 7' },
    { value: 'lyo', label: 'Lyon', description: 'Lines 8 and 9' },
    { value: 'gdn', label: 'Gdańsk', description: 'Line 10' },
    { value: 'pzn', label: 'Poznań', description: 'Lines 11 and 12' },
];

const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'it', label: 'Italiano' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'pl', label: 'Polski' },
];

const UNITS = [
    { value: 'metric', label: 'Metric (°C, bar, kg)' },
    { value: 'imperial', label: 'Imperial (°F, psi, lb)' },
];

const SESSIONS = [
    {
        id: 'console',
        title: 'Line 3 console',
        subtitle: 'Chrome on Windows · now',
        right: 'This device',
    },
    {
        id: 'tablet',
        title: 'Shop-floor tablet',
        subtitle: 'Safari on iPadOS · 2 hours ago',
    },
    {
        id: 'laptop',
        title: 'Office laptop',
        subtitle: 'Firefox on Linux · yesterday',
    },
];

const ACCENTS = ['#e87a5d', '#6b86b3', '#5c9a6a', '#d49a3f', '#8a6bb3'];

type Errors = Partial<Record<string, string>>;

/** A field's panel, so a submit can show the tab of the first invalid one. */
const panelOf = (element: Element) =>
    element.closest<HTMLElement>('[data-panel]')?.dataset.panel;

function Settings() {
    const form = useRef<HTMLFormElement>(null);
    const [section, setSection] = useState('profile');
    const [errors, setErrors] = useState<Errors>({});
    const [dirty, setDirty] = useState(false);
    const [name, setName] = useState('Alessandra Rossi');
    const [saved, setSaved] = useState<[string, string][] | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Any edit marks the form dirty and clears that field's error. The tabs
    // emit `hmi-change` too, but carry no name.
    useEffect(() => {
        const element = form.current;
        if (!element) return;
        const edited = (event: Event) => {
            const field = (event.target as HTMLElement & { name?: string })
                .name;
            if (!field) return;
            setDirty(true);
            setErrors((current) => ({ ...current, [field]: undefined }));
        };
        const reset = () => {
            setErrors({});
            setDirty(false);
            setName('Alessandra Rossi');
        };
        element.addEventListener('hmi-input', edited);
        element.addEventListener('hmi-change', edited);
        element.addEventListener('reset', reset);
        return () => {
            element.removeEventListener('hmi-input', edited);
            element.removeEventListener('hmi-change', edited);
            element.removeEventListener('reset', reset);
        };
    }, []);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const element = event.currentTarget;
        // Clear the errors first, so the fields report their own validity.
        flushSync(() => setErrors({}));
        const found: Errors = {};
        let first: HTMLElement | undefined;
        for (const field of Array.from(element.elements) as (HTMLElement & {
            name: string;
            validationMessage: string;
            checkValidity?: () => boolean;
        })[]) {
            if (field.checkValidity?.() === false && field.name) {
                found[field.name] = field.validationMessage;
                first ??= field;
            }
        }
        const data = new FormData(element);
        const next = data.get('newPassword');
        if (next && next !== data.get('confirmPassword')) {
            found.confirmPassword = 'Does not match the new password.';
            first ??=
                element.querySelector<HTMLElement>(
                    '[name="confirmPassword"]',
                ) ?? undefined;
        }
        if (next && !data.get('currentPassword')) {
            found.currentPassword = 'Enter your current password to change it.';
            first ??=
                element.querySelector<HTMLElement>(
                    '[name="currentPassword"]',
                ) ?? undefined;
        }
        if (first) {
            setErrors(found);
            const panel = panelOf(first);
            if (panel) setSection(panel);
            const field = first;
            requestAnimationFrame(() => field.focus());
            const count = Object.keys(found).length;
            toast.warning(
                'Not saved',
                count === 1
                    ? 'One field needs a look.'
                    : `${count} fields need a look.`,
            );
            return;
        }
        setSaved(
            Array.from(data, ([key, value]) => [
                key,
                value instanceof File
                    ? `${value.name} (${value.size} bytes)`
                    : key.endsWith('Password') && value
                      ? '•'.repeat(8)
                      : value,
            ]),
        );
        setDirty(false);
        toast.success('Settings saved', 'They apply at your next sign-in.');
    }

    return (
        <>
            <div className="demo-page-head">
                <div>
                    <Heading level={1} size="xlarge">
                        Account settings
                    </Heading>
                    <Text tone="muted">
                        How the consoles show your work, and how they reach you.
                    </Text>
                </div>
            </div>

            <form
                ref={form}
                className="set-layout"
                onSubmit={submit}
                noValidate
            >
                <Card className="set-card">
                    <Tabs
                        label="Settings sections"
                        variant="underline"
                        options={SECTIONS}
                        value={section}
                        onChange={(event) => setSection(event.detail.value)}
                    />

                    <section
                        data-panel="profile"
                        hidden={section !== 'profile'}
                        aria-label="Profile"
                    >
                        <div className="set-profile">
                            <Avatar name={name} size="xlarge" />
                            <FileUpload
                                name="photo"
                                label="Profile photo"
                                accept="image/*"
                                hint="A square image of at least 256 px."
                            />
                        </div>
                        <div className="set-fields">
                            <Input
                                name="name"
                                label="Full name"
                                defaultValue="Alessandra Rossi"
                                autocomplete="name"
                                required
                                error={errors.name ?? ''}
                                onInput={(event) =>
                                    setName(event.detail.value || ' ')
                                }
                            />
                            <Input
                                name="email"
                                type="email"
                                label="Work email"
                                defaultValue="a.rossi@example.com"
                                autocomplete="email"
                                required
                                error={errors.email ?? ''}
                            />
                            <Select
                                name="role"
                                label="Role"
                                options={ROLES}
                                defaultValue="supervisor"
                            />
                            <Combobox
                                name="site"
                                label="Plant"
                                options={SITES}
                                defaultValue="tor"
                                placeholder="Search the plants"
                                required
                                error={errors.site ?? ''}
                            />
                            <Textarea
                                className="set-wide"
                                name="bio"
                                label="About you"
                                rows={3}
                                maxlength={280}
                                hint="Shown to the other operators on your line. Up to 280 characters."
                            />
                        </div>
                    </section>

                    <section
                        data-panel="preferences"
                        hidden={section !== 'preferences'}
                        aria-label="Preferences"
                    >
                        <div className="set-fields">
                            <Select
                                name="language"
                                label="Language"
                                options={LANGUAGES}
                                defaultValue="en"
                            />
                            <DatePicker
                                name="rotation"
                                label="Shift rotation starts"
                                defaultValue="2026-11-02"
                                hint="Your first day shift of the next rotation."
                            />
                            <RadioGroup
                                name="units"
                                label="Units"
                                options={UNITS}
                                defaultValue="metric"
                            />
                            <ColorPicker
                                name="accent"
                                label="Marker colour"
                                swatches={ACCENTS}
                                defaultValue="#e87a5d"
                                hint="Your pins and notes on shared charts."
                            />
                            <Switch
                                name="compact"
                                value="on"
                                className="set-wide"
                            >
                                Compact tables: more rows on a screen
                            </Switch>
                        </div>
                    </section>

                    <section
                        data-panel="notifications"
                        hidden={section !== 'notifications'}
                        aria-label="Notifications"
                    >
                        <fieldset className="set-group">
                            <legend>Reach me by</legend>
                            <Checkbox
                                name="channels"
                                value="email"
                                defaultChecked
                            >
                                Email
                            </Checkbox>
                            <Checkbox name="channels" value="sms">
                                Text message
                            </Checkbox>
                            <Checkbox
                                name="channels"
                                value="push"
                                defaultChecked
                            >
                                Push, on the shop-floor tablet
                            </Checkbox>
                        </fieldset>
                        <fieldset className="set-group">
                            <legend>Tell me about</legend>
                            <Switch
                                name="alarms"
                                value="on"
                                defaultChecked
                                hint="Always on for supervisors."
                            >
                                Critical alarms on my line
                            </Switch>
                            <Switch name="reports" value="on" defaultChecked>
                                The end-of-shift report
                            </Switch>
                            <Switch name="maintenance" value="on">
                                Maintenance windows
                            </Switch>
                        </fieldset>
                        <div className="set-fields">
                            <NumberInput
                                name="repeat"
                                label="Repeat an unacknowledged alarm every"
                                defaultValue={5}
                                min={1}
                                max={60}
                                hint="In minutes, from 1 to 60."
                                required
                                error={errors.repeat ?? ''}
                            />
                        </div>
                    </section>

                    <section
                        data-panel="security"
                        hidden={section !== 'security'}
                        aria-label="Security"
                    >
                        <div className="set-fields">
                            <PasswordInput
                                name="currentPassword"
                                label="Current password"
                                autocomplete="current-password"
                                error={errors.currentPassword ?? ''}
                            />
                            <span aria-hidden="true" />
                            <PasswordInput
                                name="newPassword"
                                label="New password"
                                autocomplete="new-password"
                                minlength={12}
                                hint="At least 12 characters."
                                error={errors.newPassword ?? ''}
                            />
                            <PasswordInput
                                name="confirmPassword"
                                label="Repeat the new password"
                                autocomplete="new-password"
                                error={errors.confirmPassword ?? ''}
                            />
                            <Switch
                                name="twoFactor"
                                value="on"
                                defaultChecked
                                className="set-wide"
                            >
                                Two-step sign-in with the authenticator app
                            </Switch>
                        </div>
                        <Heading level={3} size="small">
                            Signed in on
                        </Heading>
                        <List items={SESSIONS} />
                        <div className="set-row">
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    toast.info(
                                        'Signed out',
                                        'The other two sessions have ended.',
                                    )
                                }
                            >
                                Sign out the other sessions
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => setConfirmDelete(true)}
                            >
                                Delete the account
                            </Button>
                        </div>
                    </section>

                    <div slot="footer" className="set-actions">
                        {dirty ? (
                            <Badge variant="warning">Unsaved changes</Badge>
                        ) : (
                            <span />
                        )}
                        <div className="set-row">
                            <Button type="reset" variant="ghost">
                                Discard
                            </Button>
                            <Button type="submit" variant="primary">
                                Save changes
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="set-saved" variant="flat">
                    <Heading slot="header" level={2} size="small">
                        Last saved
                    </Heading>
                    {saved ? (
                        <dl>
                            {saved.map(([key, value]) => (
                                // A checkbox group repeats its name, never with the same value.
                                <div key={`${key}=${value}`}>
                                    <dt>{key}</dt>
                                    <dd>{value || '—'}</dd>
                                </div>
                            ))}
                        </dl>
                    ) : (
                        <Text tone="muted" size="small">
                            Nothing yet. Save to see what the form sends: every
                            field is a real form control, so{' '}
                            <code>new FormData(form)</code> reads them all.
                        </Text>
                    )}
                </Card>
            </form>

            <ConfirmDialog
                open={confirmDelete}
                variant="danger"
                heading="Delete the account?"
                description="Your settings, notes and pins go. Shift reports you signed stay, under your name."
                confirmLabel="Delete it"
                onCancel={() => setConfirmDelete(false)}
                onConfirm={() => {
                    setConfirmDelete(false);
                    toast.danger(
                        'Account deletion requested',
                        'An administrator confirms it within a day.',
                    );
                }}
            />
            <ToastHost />
        </>
    );
}

createRoot(document.getElementById('app') as HTMLElement).render(
    <StrictMode>
        <Settings />
    </StrictMode>,
);
