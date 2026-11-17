/* Checks that each `./react` and `./react/<name>` file starts with
   'use client', so a Next.js Server Component can import the wrappers, and
   that no other JavaScript in dist/ does: the elements, the shared chunks and
   the legacy React tree stay plain modules. Rollup drops a directive written
   in a source module, so the build adds it as a banner, and this checks that
   it survives. Run after `pnpm build`. */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const directive = /^(['"])use client\1;?\s*$/;

const client = new Set(
    Object.entries(pkg.exports)
        .filter(([key]) => key === './react' || key.startsWith('./react/'))
        .map(([, target]) => resolve(root, target.import)),
);

async function* walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(path);
        else if (entry.name.endsWith('.js')) yield path;
    }
}

const failures = [];
const seen = new Set();
for await (const file of walk(join(root, 'dist'))) {
    const [first] = (await readFile(file, 'utf8')).split('\n', 1);
    const has = directive.test(first);
    const name = relative(root, file);
    if (client.has(file)) {
        seen.add(file);
        if (!has) failures.push(`${name} does not start with 'use client'`);
    } else if (has) {
        failures.push(
            `${name} starts with 'use client' but is not a ./react file`,
        );
    }
}
for (const file of client) {
    if (!seen.has(file))
        failures.push(`${relative(root, file)} is exported but not built`);
}

if (failures.length) {
    console.error(failures.join('\n'));
    process.exit(1);
}
console.log(
    `'use client' starts all ${client.size} ./react files, and no other.`,
);
