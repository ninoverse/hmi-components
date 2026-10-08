import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiNavbar, type NavbarNavDetail } from './navbar.js';

export type { NavbarLink, NavbarNavDetail } from './navbar.js';

/**
 * React wrapper for `<hmi-navbar>`.
 *
 * `links` is a property and `current` the active link's `value`. It is
 * controlled, as the v5 navbar was: `onNav` receives the event, whose `detail`
 * is `{ value, href }`; set `current` from it, and call `event.preventDefault()`
 * to handle the navigation yourself with a router. `brand` is text, or a child
 * with `slot="brand"`; `right` is a child with `slot="right"`. Rich labels,
 * badges and whole links are children with `slot="label-<value>"`,
 * `slot="badge-<value>"`, `slot="end-<value>"` and `slot="item-<value>"`. In the
 * Next.js App Router, import it from a `'use client'` file.
 *
 * @example
 * <Navbar brand="Ninoverse" links={links} current={tab} onNav={(e) => setTab(e.detail.value)} />
 */
export const Navbar = createComponent({
    tagName: 'hmi-navbar',
    elementClass: HmiNavbar,
    react: React,
    displayName: 'Navbar',
    events: {
        onNav: 'hmi-nav' as EventName<CustomEvent<NavbarNavDetail>>,
    },
});
