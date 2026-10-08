# Links and routers

`hmi-breadcrumbs`, `hmi-navbar` and `hmi-sidebar` render real `<a href>` links, so a
plain click is a normal page load and works with no JavaScript wiring. To hand
navigation to a router instead, there are two ways, and they can be mixed in one
navbar.

| | Listen to `hmi-nav` | Slot your router's own link |
|---|---|---|
| Elements | breadcrumbs, navbar, sidebar | navbar, sidebar (`item-<value>`) |
| Client-side routing | you call the router in the handler | the router's link does it |
| Prefetching | no | whatever the router's link does |
| In the server HTML | no: `links` and `groups` are properties, so the element renders empty on the server | yes: a slotted link is light DOM |
| Active state | `current` | `aria-current="page"` on your link |

## Listening to `hmi-nav`

A click on a link fires the cancelable `hmi-nav`. Its detail has the link's `value`
(and `index` for breadcrumbs) and its `href`. Cancel the event and navigate yourself:

```tsx
// Next.js, in a Client Component
'use client';
const router = useRouter();
const pathname = usePathname();

<Navbar
    links={links}
    current={pathname}
    onNav={(e) => {
        e.preventDefault();
        if (e.detail.href) router.push(e.detail.href);
    }}
/>
```

- A modified click (ctrl, cmd, shift, alt, a non-primary button) fires nothing, so
  "open in a new tab" keeps working even when your handler cancels the event.
- A link without `href` never navigates; it only fires `hmi-nav`.
- The elements are controlled: they never change `current`. Set it from the route.

## Slotting your own link

A navbar or sidebar entry can be replaced whole by an element slotted as
`item-<value>`, where `<value>` is the entry's `value`. It takes a router link, a
button, or later a menu.

**`current` does not apply to a slotted item.** The built-in link it would mark is
not the one shown, so the active state is yours to set. What you get depends on the
element:

| What you slot | Link look (padding, radius, font, hover, focus ring) | Active state |
|---|---|---|
| a built-in entry, no slot | yes | from `current` |
| an `<a>`, including one a framework's link component renders, or one carrying a framework directive | yes, automatically | the same look as a current built-in link, when the `<a>` has `aria-current="page"` |
| any other element: a custom element, a button | no: style it yourself | `aria-current="page"` on it gives the tinted background, text colour and bold weight, without the padding and radius, so style the active state yourself too |

A custom element can use the theme tokens in its own styles, because they inherit
into it: `--on-surface-variant` for text, `--surface-container` for the hover and
active background, `--primary-container` and `--on-primary-container` for the
sidebar's active pair, and `--ring` for the focus ring.

If you slot an element that renders its own `<a>` inside a shadow root, neither the
look nor `aria-current` reaches that inner anchor: set `aria-current` there, and
style it, from inside your element.

### Setting `aria-current` per framework

The slotted `<a>` is part of your own template, so a directive on it, a router's link
component or an event handler all work as they do anywhere else. Only
`aria-current="page"` has to end up on the rendered `<a>`, and some routers set it
for you:

| Framework | Link | `aria-current` |
|---|---|---|
| Next.js | `<Link>` | you set it, from `usePathname()` |
| React Router | `<NavLink>` | automatic when the link is active |
| Vue Router | `<RouterLink>` | automatic when the link is exact-active; `aria-current-value` changes the value |
| Angular | `<a routerLink>` | `routerLinkActive` with `ariaCurrentWhenActive="page"` |
| SvelteKit, plain HTML | `<a href>` | you set it, from the current path |

The `slot` attribute has to reach the rendered `<a>`. `next/link` forwards extra
props to its anchor. Check your framework's link component the same way.

```tsx
// Next.js
<Navbar links={links}>
    <Link slot="item-docs" href="/docs" aria-current={pathname === '/docs' ? 'page' : undefined}>
        Docs
    </Link>
</Navbar>
```

```html
<!-- Angular: the directives on the <a> run as usual (add CUSTOM_ELEMENTS_SCHEMA) -->
<hmi-navbar [links]="links">
    <a slot="item-docs" routerLink="/docs"
       routerLinkActive ariaCurrentWhenActive="page"
       [routerLinkActiveOptions]="{ exact: true }">Docs</a>
</hmi-navbar>
```

```tsx
// React Router: NavLink sets aria-current on the anchor itself
<Navbar links={links}>
    <NavLink slot="item-docs" to="/docs">Docs</NavLink>
</Navbar>
```

## Notes

- **`'use client'`:** the `@lit/react` wrappers use React hooks, so in the Next.js App
  Router import them from a Client Component.
- **Server HTML:** `links` and `groups` are properties and are not rendered on the
  server. Slotted links are, so use them for navigation that must be in the server
  HTML.
- **Breadcrumbs** have no item slot. A crumb is an `<a href>`; use `hmi-nav` to route.
