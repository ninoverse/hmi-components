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
