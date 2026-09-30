# ADR 0002 — Adopt agentcfg and the organisation's shared workflows

- **Status:** Accepted, 2026-09-28 (batches A to H decided from 25 to 28 September)
- **Deciders:** library maintainer
- **Related:** `adr-0001-lit-web-components.md`, `tracker.md`; [`ninoverse/agent-config-sync`](https://github.com/ninoverse/agent-config-sync) (`docs/plan.md`, `docs/profile-schema.md`); [`ninoverse/.github`](https://github.com/ninoverse/.github) (`README.md`)

## Context

hmi's agent rules are its own: `CLAUDE.md`, the rule files in `.claude/` and
six element skills, all written by hand. The repositories the organisation
already manages, `agent-config-sync` and the three `claude-mit-*` templates,
compose theirs instead. `agentcfg` builds `AGENTS.md`, `CLAUDE.md`, `.agents/`
and `.claude/` from central fragments, pinned by `config_version` in
`.agentprofile.yml` and bumped by the organisation's central Renovate run. The
same repositories call `ninoverse/.github`'s reusable workflows for CI, audits
and releases.

An analysis of the three repositories, read at `hmi-components@e24ae90`
(5.13.0), `agent-config-sync@f33eec1` (v0.18.7) and `.github@023b34f` (v1.2.0),
found:

- agentcfg had nothing hmi could select: no TypeScript language, no framework
  value at all, and a `library` deployment that no repository selected and that
  didn't say what a merge sets off.
- Core's rules contradicted what the repositories actually did. They said the
  user opens every PR, one commit per branch, and no drafts. Claude sessions
  opened PRs in agent-config-sync, `.github` and hmi; hmi's #124 carried five
  commits and landed correctly as its squashed PR title; #122 stayed open from
  13 to 21 September, finished but waiting for visual sign-off.
- `.github` had shared workflows for Rust, Go and Cloud Run, and none for Node.
  hmi's six workflows hard-coded Node 20, and four of them pnpm 9. CI never ran
  on `main`, and it tested on Node 20, which Vitest 5 doesn't support.
- npm served 5.4.0, 22 releases behind. Nothing since v5.5.0 had been
  published, including v5.8.0, the first with a Lit element.
- hmi had no `renovate.json`, so the organisation's Renovate skipped it, and
  Dependabot security updates were its only dependency PRs.
- The element procedure existed three times (the six skills,
  `.claude/component-workflow.md` and the R12 checklist), and the copies had
  drifted. No step marked an element Done in the tracker.

The analysis worked through eight batches, A to H. Its page is private, so
this record carries the reasoning. Each decision keeps its number, D1 to D55,
so later PRs can cite it. D18 was not taken.

## Decision

hmi adopts agentcfg with `language: typescript`, `framework: lit`,
`deployment: library` and `concerns: [browser-ui]`, at agent-config v1.x, and
its workflows become callers of `ninoverse/.github`'s shared ones. Everything
hmi selects is built centrally first. The decisions, by batch, each with the
alternatives rejected:

### A — Foundations, 25 September

| # | Decision | Rejected alternatives |
|---|----------|-----------------------|
| D1 | The language owns `unit`: TypeScript declares `unit: package`. A framework adds its own work unit on top, as `framework/lit` adds element sequencing on the *Execution order* trigger, the way `architecture/ddd` already adds to it. Core is untouched. | The framework owning `unit` for TypeScript (breaks the code-unit sentences, such as "move shared error type into an errors element", and makes a framework mandatory); a framework's vocabulary overriding its language's (reverses agentcfg's "one name, one value"); splitting the word into `unit` and `work_unit` (edits core and every language, and only a framework could supply `work_unit`). If three or more framework values restate the same sequencing, that is the case for the split, as a major release. |
| D2 | The TypeScript toolchain is pnpm and tsc, with Biome and Vitest as defaults behind the script contract, pinned by `packageManager` and `.nvmrc`, with `engines.node` as the floor. A framework value records what it needs from those tools, such as NestJS's Biome option for parameter decorators. Only the format-on-edit hook names Biome, and it does nothing where Biome isn't installed. | Biome and Vitest as a fixed toolchain (binds every future TypeScript template to them, and NestJS sets up Jest and needs a Biome option for its decorators); naming no tool (the format hook and parts of the review rules can't be written). |
| D3 | The script contract is `lint`, `typecheck`, `test`, `build` and `format`, plus `ci`, which runs every gate in order and is called as `pnpm run ci`, because pnpm reserves `pnpm ci`. CI and the turn-end check call the scripts. Each repository adds its own gates to `ci`: for hmi, `test:ssr` and the manifest drift check. Revised in HMI-4: `test` runs both Vitest projects, which covers `test:ssr`, and the drift check stays a CI step, because run before a commit it fails on files regenerated correctly but not yet staged. | `pnpm gates` (saves typing `run`, loses the organisation's word). |
| D4 | Zero warnings, enforced: `lint` runs `biome check --error-on-warnings`, so the rule and the gate agree. | Plain `biome check`, which passes on warnings. |
| D5 | The turn-end type check runs only when a `.ts` or `.tsx` file changed since the last commit. | Every turn (`tsc -b` takes about 10 s warm and 18 s cold here). |
| D6 | `framework/lit` holds what stops being true only when a repository stops using Lit: element shape, properties, lifecycle and SSR safety, the generic half of the styling rules, events, slots, forms, overlays, the element tests and review checklist, the file layout, element sequencing and `/new-element`. The design system (MD3 token names, `--hmi-base`, no `rem`, `--panel-*`, the liquid filter), the `hmi-` prefix, the wiring list, the tracker and the React wrappers stay in hmi; the wrappers go central the day a second Lit repository ships them. What only the migration needs retires at v6. | — |
| D7 | agentcfg concatenates arrays across value partials, before any framework or concern ships one. `settings_extra` keeps replacing, so a repository can still remove an entry. | Leaving arrays replaced (a `framework/lit` partial allowing one command would drop TypeScript's allowlist and hooks). |

### B — Core policy conflicts, 26 September

| # | Decision | Rejected alternatives |
|---|----------|-----------------------|
| D8 | Claude opens the PR once the gates pass, with the GitHub tools it has, or prints the title and description when it has none. Claude never merges. | Keeping core's rule that the user opens every PR (contradicts practice in agent-config-sync, `.github` and hmi, including agent-config-sync, which composes it); an exception for hmi only (leaves the others with a rule nobody follows). |
| D9 | A PR is a draft only while it is finished but waits on a human check the gates can't make, such as a visual approval or a pending decision, and it is marked ready once that is done. Never for unfinished work: a branch is pushed only once its gates pass. | No drafts at all, core's rule (misses a finished PR waiting on sign-off, like #122). |
| D10 | Squash-only merges. The PR title is what lands on `main` and picks the release, and commits inside a PR are review steps. Each repository allows only squash merging, with the PR title as the squash message. | One commit per branch (a review fix means amending and force-pushing; it stays the fallback where a repository's settings can't change). |
| D11 | A branch is updated only when a conflict or a required check needs it, by merging `main` into it. A branch under review is never rebased or force-pushed. | Rebasing before review, hmi's rule (rewrites commits a reviewer has read, for the same result on `main` under squash). |
| D12 | Where the environment assigns a branch, such as `claude/<words>`, the agent asks which branch to use before creating another or pushing. A reused branch restarts from `main` after each merge. Whether work merged is read from its PR or from `main`'s log, never from whether its branch still exists: branches are deleted by hand, and not always. | — |
| D13 | D8 to D12, with any rule reversals from batch C, ship as one major release, agent-config v1.0.0. The organisation's CONTRIBUTING and PR template change in the same wave; D47 widens that wave. | Separate releases (D8 reverses a rule and D10 removes one, so each would be a major, and every consumer approves every major on its Dependency Dashboard). |

### C — Branch, commit and PR specifics, 26 September

| # | Decision | Rejected alternatives |
|---|----------|-----------------------|
| D14 | The `migrate/` branch prefix is dropped. Migrations use `feat/<kebab>`, or the assigned branch under D12. | Keeping it (nothing reads a branch name, and the PR title already says "migrate"). |
| D15 | hmi's commit scopes (`ui`, `react`, `theme`, `build`, `ci`, `docs`) stay as local content, an instance of core's layer rule rather than an exception to it. Adoption adds the scope-character rule: lowercase letters, digits, `-` and `_`, or the release is silently skipped. | The package name as the scope (names the whole repository in a one-package repository). |
| D16 | Every element PR carries the element's API table (property or attribute, slot, event and its detail, part), from `framework/lit`. The React comparison, the tracker link, the R12 checklist in the body, the 600-line note and one commit per element in a batch stay in hmi until v6. | — |
| D17 | A PR carries a visual-check record, not images; the images go to the reviewer in the session. The rule lives in the UI concern (D19, D26). An agent can't attach an image to a PR body through the GitHub API. | Committing images (binaries reach `main` through the squash); an assets branch (one more branch to delete by hand); hosting them elsewhere (splits the record). |
| D18 | **Not taken:** a separate fix for hmi's release table, which says "everything else → patch" although `test`, `build`, `ci` and merge commits release nothing (#126 released nothing). The error stays until adoption replaces hmi's commit rules with core's table. | — |

### D — The screenshot skill, 26 and 27 September

| # | Decision | Rejected alternatives |
|---|----------|-----------------------|
| D19 | A new concern, `concerns/browser-ui`, holds the `take-screenshot` skill, its first entry's script and the visual-check rule. A repository selects it when it renders UI in a browser. | Every UI framework value (copies, and a UI with no framework gets none); core (Rust and Go repositories that render nothing would get it); hmi only (the next UI repository starts from nothing). |
| D20 | agentcfg emits the non-markdown files in a task's directory to `.agents/<task>/`: one copy whichever emitters a profile selects, owned whole, listed in the manifest and verified by `check`. Scripts ship as text and are started through their interpreter. | The script inline in the skill (about 100 lines retyped on every run, and nothing checks them); an npm package or a pinned download (an install or a fetch on every use). |
| D21 | A dispatcher, `screenshot.sh`, runs the first entry whose needs hold, with the same arguments, and lists every entry's needs when none does. Entries share one contract and are added in agent-config-sync. | A table in the skill for the agent to choose from. |
| D22 | With no heading, a capture takes the whole page. The skill steers long pages to a heading, since a whole-page capture of a long page can't be read by eye. | — |
| D23 | A section with `display: contents` has its children clipped automatically; `--clip-children` stays as an override. | — |
| D24 | Each failed web-font request is named on stderr, with its error, so a capture in a fallback face is never mistaken for a real one. A fallback face changes layout: hmi's Badge row is 9 % wider without Quicksand. | — |
| D25 | Where `NODE_EXTRA_CA_CERTS` is set, Google Fonts are fetched from Node, with TLS verified there, and handed to the page. | Relaying everywhere (breaks fonts where only the system store trusts a proxy's CA). |
| D26 | The visual-check record is an on-demand rule at *Opening PRs*: capture the affected sections and show them before opening the PR, then record the page, section, viewport, theme settings and whether web fonts loaded, the verdict and who gave it. The PR is a draft only while the verdict is pending (D9). | — |
| D27 | The concern's rule is what sends an agent to the skill; framework values never mention screenshots. hmi's `verify-component` calls the skill instead of carrying its own recipe. | — |
| D28 | A path-filtered smoke job in agent-config-sync runs ShellCheck on the dispatcher, then the dispatcher and each entry against a fixture page outside `fragments/`. | No test (a break would reach every UI repository at once, and none of their CIs runs the script). |
| D29 | The dispatcher is POSIX shell, run as `sh .agents/take-screenshot/screenshot.sh`, so it starts where there is no Node. Entries can be in any interpreted language. | A Node dispatcher, as first proposed. |
| D30 | No environment field for the operating system: it belongs to the machine, and one repository's composed files serve every clone. Scripts stay portable, machine differences are checked when a script runs, and where `sh` is missing the agent runs an entry directly. Native Windows needs Git for Windows, as agentcfg's hooks already do. | A per-repository field (wrong for every clone on another system). |

### E — The element skills, 27 September

| # | Decision | Rejected alternatives |
|---|----------|-----------------------|
| D31 | `/new-element` is one task in `framework/lit`, shaped like `/new-crate`: pre-flight with the approved API table, then the element, its styles, its browser and SSR tests, the repository's own steps (D32), the gates and the hand-over. It carries its own templates, because a path-scoped rule loads when a matching file is read, not when the first one is created. | — |
| D32 | Every central task gets one step, just before its gates: if `.agents/<task>.local.md` exists, follow it now. hmi's `new-element.local.md` holds its prefix, the design-system parts, the React wrapper, the story, the wiring and the Storybook build. | A local skill around `/new-element` (two skills answer "add a Rating element", and picking the central one skips the wiring); a marker region in `SKILL.md` (reverses "owned whole"); a path-scoped local rule (loads on read, not on create, and only Claude reads it). |
| D33 | At adoption, `create-`, `scaffold-`, `wire-`, `verify-` and `ship-component` retire, with `.claude/component-workflow.md`. `migrate-component` stays until v6, reduced to the migration's own steps around `/new-element`: the React sources, the mapping sheet, the screenshot pair, the migration's PR sections and its tracker row. | — |
| D34 | The skills people start from, `/new-element`, `/migrate-component`, `/gates` and `/take-screenshot`, stay model-invocable, each with a one-sentence description. | User-only invocation (saves the descriptions, but the agent would improvise a migration without the procedure). |
| D35 | A migration's own commit sets its tracker row to Done, with the PR link, so on `main` Done is always true. "In progress" and "In review" leave the vocabulary, and the three stale rows are fixed. | "In review" in the migration's own PR, as the tracker said (stale the moment the PR merges, and nothing moved it on: Kbd, Skeleton and Spinner still read "In review" after #124 merged). |
| D36 | In v1.0.0, the last step of `new-crate`, `new-package` and `new-value` points to *Git flow* and *PR instructions* instead of repeating them. `/new-element` does the same from the start. | — |

### F — Workflows, 27 September

| # | Decision | Rejected alternatives |
|---|----------|-----------------------|
| D37 | `node-ci.yml` in `.github`: four gates calling `lint`, `typecheck`, `test` and `build`, and a Node-floor job that installs the exact `engines.node` floor with pnpm's `engine-strict` on. pnpm and Node come from `packageManager` and `.nvmrc`, Playwright browsers are an input, a repository's own checks stay jobs in its caller, and CI runs on `main` as well as on pull requests. The raise of hmi's floor to 22.12 was revised by D51. | — |
| D38 | `node-audit.yml`: `pnpm audit` every Monday and on dependency changes, with the policy in the repository's pnpm configuration. No licence gate until a Node repository has a licence policy. | — |
| D39 | `node-bump-version.yml`: the shared commit-type rules, `pnpm version`, an annotated tag after checking it is new, pushed with the organisation's release app. hmi's own `APP_ID` and `APP_PRIVATE_KEY` retire. | Keeping hmi's copy (lightweight tags, every local tag pushed, no check for an existing tag, `GITHUB_TOKEN` with write access). |
| D40 | `node-release.yml`: a GitHub release on every tag, with the packed tarball, its checksum and the conventional-commit changelog `rust-release.yml` writes, `extra-notes` included. Publishing to a registry is separate. | GitHub's generated notes, as `release-github.yml` writes them. |
| D41 | npm and a second registry are published only by hand, through one reusable `npm-publish.yml` that publishes a release's tarball, byte for byte, to any npm-protocol registry. hmi's two publish workflows become its callers. The second registry is Nora, decided in the plan on 28 September, so no Google token step is needed. | Publishing on every tag; Artifact Registry (needs a step that mints a Google token). |
| D42 | `firebase-deploy.yml` in `.github` runs `firebase deploy --only <targets> --project <project> --non-interactive`, with `firebase.json` and its predeploy hooks as the contract, covering Hosting, rules and Functions. hmi's docs deploy is its first caller. | A deploy of hmi's own (it has to be rewritten for its pins and permissions anyway). |
| D43 | A reusable `actionlint.yml` in `.github`, called from every repository's CI and from `.github`'s own. | Folding the job into each `<ecosystem>-ci.yml` (the same job defined three times). |

### G — Repository configuration, 27 September

| # | Decision | Rejected alternatives |
|---|----------|-----------------------|
| D44 | hmi opts into the organisation's Renovate. Dependabot's alerts stay on, since Renovate's security PRs are built from them; its security updates go off, so fixes don't arrive twice. #123 was merged on 29 September. | Dependabot alone (bumps neither the workflow pins nor the `agentcfg` pin). |
| D45 | The organisation's preset keeps Renovate off `engines`; `.nvmrc` and `packageManager` stay managed. A `node-library` preset updates only the lockfile for a library's dependencies and widens its peer ranges, and hmi extends it. | The preset's `rangeStrategy: bump` for a library (raises `lit`'s floor, and narrows the React peer range, for everyone who installs hmi). |
| D46 | hmi gets a `CODEOWNERS` in the managed repositories' shape: the maintainer for every file, then again, explicitly, for the rule files, the workflows, the pins, `renovate.json` and the Firebase configuration. | — |
| D47 | hmi keeps inheriting the organisation's PR template and CONTRIBUTING. The v1.0.0 wave covers all 15 files, across five repositories, that repeat the reversed rules, and the templates' copies point to the rules instead of repeating them. | A copy of each in hmi (one more place to keep in step). |
| D48 | A POSIX `scripts/agentcfg.sh` fetches the pinned `agentcfg` and runs it, as `pnpm agentcfg <command>` locally and as `sh scripts/agentcfg.sh check` in CI, without installing dependencies. `/.agentcfg/` is ignored, because Renovate collects its post-upgrade changes from `git status`. | An npm package of agentcfg (a second pin that could drift from `config_version`); the logic in a `package.json` string. |
| D49 | "Automatically delete head branches" is turned on. | Deleting branches by hand, as today. |

### H — The `library` deployment value, 28 September

| # | Decision | Rejected alternatives |
|---|----------|-----------------------|
| D50 | agentcfg's `library/api-stability.md` becomes `library/release.md`, "Releases and API stability", on *Git flow*'s trigger: a merge makes a GitHub release, `publish-<registry>.yml` publishes a release by hand, and a dependency's minimum rises only when the code needs the newer version. | — |
| D51 | `engines.node` promises what the published package needs, and `.nvmrc` pins development. For a library, the floor job packs the package on the development Node, installs it into an empty project on the floor with `engine-strict` on, and imports its entry points. hmi keeps `>=20` until a major drops it, instead of D37's raise to 22.12, and TypeScript's `version_floor` becomes "`engines.node` floor". Decided in the plan: 6.0.0 drops Node 20 if the floor can rise. | One floor, as D37 had it (Vitest's Node requirement would cut a major now, and every later tool floor another). |
| D52 | The PR that ships an element marks its React counterpart `@deprecated`, naming the wrapper that replaces it and the release that removes it, 6.0.0. One PR marks the eight already shipped. The freeze on `src/components/` allows that one line. | Letting the README stand in (a consumer's editor shows the React import as current until 6.0.0 removes it). |
| D53 | The docs site keeps deploying on every tag while 5.x is released, so it shows the migration as it lands. Once v6 is live it deploys after the npm publish, from the same tag, so it documents what its install line installs. Until then hmi's own rules record the exception to the library fragment. | Following the npm publish now; a second Hosting site for tags beside the live one (one more site and one more caller). |
| D54 | A repository is a library when its `.agentprofile.yml` says `deployment: library`, which today is hmi alone. A library on Node extends `node-library`. | — |
| D55 | `framework/lit` lists an element's public surface, as a fact about elements: the tag and the module that defines it; attributes and properties, with their types, defaults and reflection; events, with the shape of `detail` and whether they bubble, cross the shadow boundary or can be cancelled; slots and parts; the CSS custom properties it reads; form behaviour. hmi's own rules add the package's surface: the `exports` subpaths, the React wrappers' names and props, the theme token names and `--hmi-base`, and the script bundles' globals. | — |

## Consequences

**For hmi's rules, at adoption**

- `AGENTS.md`, `CLAUDE.md`, `.agents/` and `.claude/` are composed from
  `.agentprofile.yml` and checked in CI. hmi's own rules live in its section of
  `AGENTS.md`, outside the markers, and in `.agents/new-element.local.md`.
- Five element skills and `component-workflow.md` retire; `migrate-component`
  stays until v6.
- Claude opens PRs and never merges, a PR is a draft only while it waits on a
  human check, merges are squash-only, `main` is merged into a branch only
  when needed, and the `migrate/` prefix goes.

**For hmi's workflows**

- `ci-gate.yml`, `bump-version.yml`, `release-github.yml`, `publish-npm.yml`
  and `release-demo-page.yml` become short callers, and `publish-gcp.yml`
  gives way to a caller for Nora.
- CI runs on `main` too, and the required checks become the gate names instead
  of `verify`.
- `APP_ID` and `APP_PRIVATE_KEY` retire after the first release through the
  shared bump, `NPM_TOKEN` after the first trusted publish, and the Artifact
  Registry secrets and variables after the first publish to Nora.

**For consumers**

- Nothing breaks before v6: `engines.node` stays `>=20`, and a dependency's
  range rises only when the code needs the newer version.
- The React components that have Lit replacements carry `@deprecated`.
- The docs site deploys on every tag until v6, then after each npm publish.

**Costs**

- hmi adopts only after agent-config v1.0.0, which needs the TypeScript, Lit
  and `browser-ui` values, companion files (D20), the local-file step (D32)
  and the reversed core rules first.
- No element migration runs until the adoption is done, as decided in the plan
  on 28 September.
- Some settings only the maintainer can change: squash-only merging with the PR
  title (D10), automatic branch deletion (D49), the release app's visibility
  and bypass (D39), the required checks (D37), the Renovate app and Dependabot
  (D44), npm's trusted publisher (D41), the Firebase service account's roles
  (D42), and Nora's URL and token (D41).

## Follow-ups

What the analysis couldn't settle, and what settles each:

1. npm trusted publishing and provenance from a reusable workflow: the first
   publish by hand after the publish caller lands. npm matches the workflow
   that starts the run, so the trusted publisher names hmi's
   `publish-npm.yml`, whose job grants `id-token: write`; it needs npm 11.5.1
   or later on Node 22.14 or later.
2. Nora's authentication, assumed to be a token: the first publish to Nora.
3. Whether the Renovate app can read Dependabot alerts: hmi's Dependency
   Dashboard once it opts in.
4. `node-library` on hmi: a dry run on a Monday after it opts in. `lit` should
   keep `^3.3.3` with a lockfile-only update, and the React peer range should
   widen.
5. The floor job on Node 20.0.0: the CI caller's first run. If a dependency
   needs a later 20.x, raising the floor is a decision under D51, not a fix.
6. `pnpm/action-setup` with `packageManager`: it errors when both its
   `version` input and `packageManager` are set, so the change that adds the
   pins drops `version: 9`, and its own run shows the result.
7. The Firebase CLI pin and the predeploy hook: the first tag deployed through
   `firebase-deploy.yml`.
8. Where pnpm reads the audit policy: `node-audit.yml`'s documentation and
   hmi's first audit run.
9. The release app's bypass of the push rule on `main`: the first merge
   through the shared bump, which tags a release or is refused at the push.
10. pnpm 10 skips dependency build scripts, here esbuild's and
    rs-module-lexer's, and the build and tests still passed: confirmed on
    GitHub's runner by the change that adds the pins.
11. The React wrappers move into `framework/lit` when a second Lit repository
    ships them (D6).
12. Splitting `unit` from a work unit (D1) if three or more framework values
    restate the same sequencing.
13. The framework axis takes one value, so a monorepo with a front end and a
    server framework can't declare both. That changes when a repository needs
    it.
