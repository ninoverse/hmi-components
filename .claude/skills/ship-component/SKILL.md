---
name: ship-component
description: Commit a verified HMI component and open a draft PR — final phase of the component workflow. Run after verify-component has passed and the user has approved the screenshot.
---

# Ship Component

Commits the finished component and opens a draft PR. This is **phase 4 of 4**.
Only run this after `verify-component` has passed and the user has approved the
screenshot.

## Inputs

- **Component name** (required): PascalCase for the commit message, kebab-case
  for the branch. Ask if not provided.

## Guardrails

- Never commit if `pnpm lint` or `pnpm build` would fail. Re-run
  `verify-component` if there is any doubt.
- One commit per component — never batch multiple components.
- Touch only the files created or modified in the previous phases:
  `src/components/<name>.tsx`, `src/components/styled/<name>.styled.css`,
  `src/index.ts`, `vite.config.ts`, `package.json`, `src/App.tsx`.

## Step 8 — Commit

Commit message format (exact):

```
feat(ui): add <ComponentName> component
```

Stage only the six files listed above; do not stage anything else.

## Step 9 — Push + draft PR

```bash
git push -u origin feat/<kebab-name>
```

Open a **draft** PR targeting `main` via the GitHub MCP tools. The PR body
should include:
- What the component is and what props it exposes.
- A note that a screenshot was reviewed by the user.

## Done

After the PR is open, post the PR URL and **stop**. Wait for the user before
starting any new component.
