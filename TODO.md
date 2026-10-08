# TODO

## update-style-guide rule (`​.claude/update-style-guide.md`)

> **Folded into the Lit migration.** The token-update procedure now lives in
> `docs/migration/README.md` §11 (theme rules: token-only theme files, `--panel-*`,
> `--hmi-base`). The open questions below remain valid and should be answered when
> the rule is written after the v6 flip. Note that question 5 is stale: there are
> now eleven theme files under `public/css/themes/{constants.css, color/*,
> structure/*, material/*}`.

A dedicated rule for updating design tokens when a new design file or style
direction arrives — distinct from the full reproduction guide (build from scratch)
and from `/new-element` (build a single element).

### Open questions to decide before writing the rule

**1. Scope classification — how granular?**
Update types have different risk profiles and different files to touch:
- Value-only (same token roles, new hex values)
- Schema change (new roles added or removed — e.g. adding `--warning`)
- Shape system change (corner radii — dangerous if any component has hardcoded fallbacks)
- Typography change (font stack or base font size)
- Full redesign (all of the above)

Decision needed: classify update type first and branch the procedure, or treat everything as a full update regardless?

**2. Audit-before-touch**
Should the guide mandate a grep pass for hardcoded values (colors, radii, shadows)
*before* editing tokens? Violations won't surface from a token change alone and
won't fail the build. Options: require pre-audit always, require it only for shape/
typography changes, or trust code review.

**3. Diff-first vs replace-first**
- Diff-first: produce a structured diff of old vs new tokens, review it, then apply. Auditable.
- Replace-first: edit `default.css` directly, verify with screenshots. Faster.

**4. Visual regression — before/after screenshots**
The screenshot method exists. Worth requiring a full `App.tsx` screenshot before
(baseline) and after (diff) to catch unintended side effects from shared tokens?

**5. Multi-theme**
Currently only `public/css/themes/default.css`. If `themes/dark.css` or
`themes/brand-b.css` are ever added, the guide needs to cover: which file to
create, how theme switching works, whether `colors.ts` needs changes.

**6. `colors.ts` sync contract**
When a new token role is added to `default.css`, is the check that `colors.ts`
stays in sync a manual checklist step or something enforceable (e.g. a lint rule)?

---

## Code syntax highlighting (`Code` component)

Analysis of how hard it would be to add syntax highlighting to the `Code`
typography primitive. **Deferred — no work done yet.**

### Key constraint
The library has **one runtime dependency (Lit) and zero framework
dependencies** (`react`/`react-dom` are optional peers for the wrappers). Every
component is hand-rolled. The current `Code` output is ~474 bytes. Any approach
must be weighed against preserving that Lit-only, token-driven model
(`.claude/lit-migration.md` R1).

### Scope note
Highlighting is arguably **out of scope for a primitive**. `Code` is a Phase 1
foundation element; syntax highlighting is closer to a feature-level `CodeBlock`
component that could live separately later.

### Options considered (in order of preference)

**Option C — "bring your own highlighter" hook (~20 min, zero deps)**
Add an optional `render?: (code: string) => ReactNode` prop (or document that
`children` may be pre-highlighted nodes). Consumer brings Shiki/Prism if wanted;
`Code` stays a dumb presentational shell. Most aligned with a primitive library.

**Option B — tiny built-in tokenizer (~1 day, ~150–250 lines, zero deps)**
Hand-write a small regex tokenizer for one language family (JS/TS) emitting
`<span>` tokens colored with existing MD3 tokens (`--primary`, `--tertiary`,
`--on-surface-variant`, `--error`). Honest limitation: regex highlighting is
approximate (nested templates, regex literals, JSX will mis-tokenize) — fine for
docs/snippets, not an editor. New API: `<Code block language="ts">`.

**Option A — real highlighter (Shiki / Prism / highlight.js)**
Low to write, high in consequences. Adds a **heavy runtime dependency** (Shiki
ships MB of TextMate grammars/themes; Prism/highlight.js lighter but still real
deps with their own CSS), **breaks the Lit-only rule**, and needs theme
bridging to the MD3 palette. Requires explicit sign-off on the dependency
tradeoff before pursuing.

### Recommendation
Prefer **C** (or do nothing) for the library; reach for **B** only if built-in
highlighting is wanted without asking consumers to wire up a highlighter; avoid
**A** unless the Lit-only dependency rule is intentionally being abandoned.

---

## Divider labeled-variant accessibility

Surfaced during the Phase 1 utilities audit-pass. **Not a defect — left as-is.**

### The gap
The plain `Divider` renders a semantic `<hr>` (implicit `role="separator"` +
`aria-orientation`). The **labeled** variant (e.g. `<Divider>OR</Divider>`)
instead renders a `<div>` with the rule lines `aria-hidden` and a visible text
label — it is **not announced as a separator** to assistive technology.

### Why the obvious fix doesn't work
Adding `role="separator"` to the labeled `<div>` is rejected by the project's
own Biome a11y rules, and the rejections are correct:
- `useSemanticElements` — `role="separator"` should be a real `<hr>`, but `<hr>`
  is a void element and **cannot contain a label**, so a labeled separator
  fundamentally can't be an `<hr>`.
- `useFocusableInteractive` — Biome treats `role="separator"` as interactive and
  demands a `tabIndex`, which would create a bogus keyboard tab stop on a purely
  decorative element.

Forcing it through would require `biome-ignore` suppressions — strictly worse
than the current clean, lint-passing code.

### Options if revisited
- **Do nothing** (current): the visible label is real text and reads fine in
  context; only the explicit "separator" semantic is missing.
- Use `role="separator"` **plus** `aria-label`/`aria-hidden` restructuring and a
  single scoped `biome-ignore` for `useFocusableInteractive`, documenting why a
  decorative separator is intentionally non-focusable.
- Revisit if/when the labeled divider needs to participate in a `menu`/`listbox`
  pattern where a separator role is actually consumed by AT.

### Recommendation
Leave as-is unless a concrete AT/screen-reader requirement appears. The
trade-off (suppressing the project's a11y lint vs. a missing-but-harmless
separator semantic) favors the cleaner code today.

---

## Phase 3 plan reconciliation — redundant components

During Phase 3 (`pinInput`, `rating`, `colorPicker`) two of the three planned
"new" components turned out to already exist under different names. Decisions:

### `pinInput` — SKIP (covered by `MultiInput`)
`MultiInput` already implements segmented PIN/OTP entry: per-cell auto-advance,
backspace-to-previous, arrow/Home/End navigation, paste-to-fill, `numeric`/`text`
types, `groupSize`/`separator`, `mask` (password dots), and `onComplete`. A
dedicated `PinInput` would duplicate it almost entirely. **Decision (confirmed
with the maintainer): do not build `PinInput`.** If a PIN/OTP preset is ever
wanted, add a thin wrapper over `MultiInput` (defaulting `mask` +
`autoComplete="one-time-code"`) rather than a new component.

### `rating` — SKIP (covered by `ValueScaleSelector`)
`ValueScaleSelector` is already a rating widget: star scale by default, custom
icon support (e.g. hearts), `allowHalf` half-steps, `readOnly`, sizes,
controlled/uncontrolled, full ARIA `slider` semantics + keyboard nav. A `Rating`
component would substantially duplicate it. **Decision (confirmed with the
maintainer): do not build `Rating`.** If the `rating` name is wanted publicly,
alias/rename `ValueScaleSelector` rather than adding a second widget.

### `colorPicker` — genuinely new, still to build.

---

## Angular forms support: `ControlValueAccessor` and `ngModel` (after v6)

**Status: not planned for the migration. Implement after v6 ships.**

### The gap
The Phase 4 form elements are form-associated custom elements: `name` plus
`value` reach `FormData`, `form.reset()` and `<fieldset disabled>` work, and
`hmi-input` / `hmi-change` carry `{ value }`. Angular's `ngModel`,
`formControlName` and `FormControl` bind through a `ControlValueAccessor`, and
Angular ships none for custom elements. Today an Angular consumer binds
explicitly: `[value]="v" (hmi-input)="v = $event.detail.value"`, or reads
`new FormData(form)` on submit. Reactive forms and template-driven `ngModel`
do not work with the `hmi-*` form elements.

### What to build
An Angular adapter, outside the element packages (it must not become a runtime
dependency of the library, which keeps Lit as its only one):
- a directive per element family (text, numeric, file, …) providing
  `NG_VALUE_ACCESSOR` and selecting on `hmi-input[ngModel]`,
  `hmi-input[formControlName]` and the like;
- `writeValue` → set the element's `value` property;
- `registerOnChange` → `hmi-input` (or `hmi-change` for `updateOn: 'blur'`);
- `registerOnTouched` → `focusout` on the host;
- `setDisabledState` → the `disabled` property;
- Angular validators → the element's `error` text, so the field shows the
  message and is marked invalid.

### Open questions
- Where it ships: a secondary entry point of this package, or its own package.
- Whether Angular's own validity state should also drive `error`, or only
  messages the consumer sets.
- Vue's `v-model` and Svelte's `bind:value` have the same gap and are outside
  this note; decide them together with this one.

---

## Svelte `bind:value` for the form elements (after v6)

**Status: not planned for the migration. Investigate and decide after v6 ships.**

### The gap
The Phase 4 form elements bind explicitly in every host: `value` in,
`hmi-input` / `hmi-change` out (`detail: { value }`). Svelte's `bind:value` is
sugar that listens for a native event on the element and reads its `value`
property. The elements emit `hmi-*` events, so two-way binding is not part of the
documented contract. Today a Svelte consumer writes
`<hmi-input {value} on:hmi-input={(e) => (value = e.detail.value)} />`.

### To investigate
Not verified yet, and should be before anything is promised:
- The inner native `<input>` fires a composed `input` event that reaches a
  listener on the host, with the host as the retargeted `target`. If the host's
  `value` is already updated when that listener runs, `bind:value` may already
  work for the text elements by accident. Check the order of events and how
  Svelte 5 binds on custom elements.
- `hmi-number-input`'s `value` is `number | null`, and the checkable controls
  in Phase 5 use `checked`, so a generic binding does not cover them.
- A native `change` event is not composed, so commit semantics do not cross the
  shadow boundary either.

### Options
- Document the explicit `value` plus `on:hmi-input` pattern only (no code).
- Ship a small Svelte action, such as `use:hmiModel={...}`, outside the element
  packages so Lit stays the only runtime dependency.
- Have the elements also dispatch native-looking `input` and `change` events, if
  the investigation shows that is what makes `bind:value` work.

### Open questions
- Where an adapter ships, as for the Angular `ControlValueAccessor` TODO above.
- Whether to decide this together with Vue's `v-model`.

---

## Dioxus: verify the form recipe in a real app (after v6)

**Status: nothing below has been run in a Dioxus app yet. Verify, then correct
the docs to match.**

### What the docs currently say
`docs/migration/translation-guide.md` §13 (Binding model) and `README.md` §8
describe Dioxus as: attributes from strings; booleans through the property in
`onmounted`; strings from the form's `values()`; and `web_sys` for events,
objects and files. `hmi-file-upload` exposes the selected files as `el.files`,
because Dioxus's own file API reads from a native `<input type="file">` and the
real input is inside the element's shadow DOM. All of this comes from how the web
platform and the README's `web_sys` pattern work, not from a Dioxus test.

### To verify, in a small Dioxus project
Cover web, fullstack and desktop where they differ:
1. **Submit:** does `FormEvent::values()` include the `hmi-*` controls and their
   string values? Do `required` and `error` block the submit as in a plain form?
2. **Files:** does `web_sys::FormData::new_with_form(&form)` return the real
   `File`s from `hmi-file-upload`, and does reading `el.files` work? Does
   Dioxus's own `files()` fail as expected, and does desktop (webview) differ?
3. **Events:** does adding `hmi-input` and `hmi-change` listeners through
   `web_sys` from `onmounted` work, and can the `detail` object be deserialized
   (for example with `serde_wasm_bindgen`)?
4. **Booleans and properties:** setting `disabled`, `value` and `error` from
   `onmounted`, and whether omitting the attribute behaves as documented.
5. **Fullstack:** server-rendered markup (declarative shadow DOM) hydrates
   without a flash or a mismatch, and the form value is intact after upgrade.
6. **Reset:** `form.reset()` restores the initial `value`.

### Deliverable
A tiny example (or a snippet in the docs) that is known to compile and run, and
the README / translation-guide Dioxus rows corrected wherever they were wrong.

### Open question
Whether a small Rust helper crate for the event and file glue is worth shipping,
or whether the documented `web_sys` recipe is enough.

## `hmi-radio-group` with slotted `<hmi-radio>` children (after v6)

`hmi-radio-group` builds its radios from the `options` array only, as v5's
`RadioGroup` does. Accepting `<hmi-radio>` children as well would allow a hint
or other markup per radio, but the group would have to coordinate radios that
live outside its shadow root: they would also belong to the page's form, so the
group's own `name=value` and each radio's would both be submitted, and the
exclusion and tab stop would have to span the slot boundary. Until then, radios
that need that freedom are standalone `hmi-radio` elements sharing a `name`,
which group themselves and submit natively, without a group label, error or
single value.

To do: design the child contract (does the group take over each child's `name`,
`required` and `disabled`?), decide how the group's value and the children's
`checked` stay in step, and add the slotted form without changing the `options`
form.

---

## `'use client'` banner on the React wrapper builds

The `@lit/react` wrappers use React hooks, so in the Next.js App Router they only
work when imported from a Client Component. A `'use client'` banner on
`dist/react/*.js` (and the `./react` barrel) would let a Server Component import
them, with props that are not functions. Check that Vite keeps the directive in
the build, and that the barrel can carry it without making the whole bundle a
client one. Noted in `docs/migration/translation-guide.md` ("Links and routers").
